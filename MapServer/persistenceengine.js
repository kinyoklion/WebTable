/**
 * Created by Ryan Lamb on 11/20/15.
 * 
 * This class is responsible for syncing change to the in-memory map model to
 * the database. It is also responsible for loading maps from the database.
 */

/**
 * Construct an instance of the persistence engine.
 * @param {MapDatabase} database Backing database which stores maps.
 */
function PersistenceEngine(database, mapdata, observable) {
    var loadedMap = null;
    //Need the name currently in the database if the name gets updated. If we
    //only have the new name, then we will not be able to find the record.
    var persistedName = null;
    var operations = [];
    var pendingOperations = [];

    this.loadMap = function(mapName, callback) {
        var persistence = this;
        database.connect(function() {
            database.getMap(mapName, function(mapFound, map) {
                if (mapFound === true && map !== undefined) {
                    loadedMap = mapdata.fromJSON(map);
                    loadedMap.observe(updateMap);
                    persistedName = loadedMap.name;
                    callback(mapFound, loadedMap);
                }
                else {
                    callback(mapFound, undefined);
                }
            });
        });
    };

    /**
     * Create a new map with the given name.
     * @param {string} mapName The name for the new map.
     * @param {function} Callback executed after the map has been added. The result contains the number
     * of records added. If this is 0, then no map was created.
     */
    this.createMap = function(mapName, callback) {
        database.connect(function() {
            var map = new mapdata.MapData();
            map.name = mapName;
            database.insertMap(map, function(result) {
                callback(result);
            });
        });
    };

    /**
     * Execute any pending operations.
     * @param {function} callback A callback that will execute after all pending operations have completed.
     */
    this.then = function(callback) {

        if(callback === undefined) {
            callback = function() {};
        }

        if(pendingOperations.length == 0)
        {
            callback();
            return;
        }

        var operation = pendingOperations[0];
        pendingOperations.splice(0, 1);

        var change = operation.change;
        var path = operation.path;
        var value = operation.value;
        var nameAtTime = operation.name;

        var promise = null;

        if (change === observable.ChangeType.UPDATED) {
            promise = database.updateField(nameAtTime, path, value);
        }
        else if (change === observable.ChangeType.REMOVED) {
            promise = database.removeItem(nameAtTime, path, value);
        }
        else if (change === observable.ChangeType.ADDED) {
            promise = database.addItem(nameAtTime, path, value);
        }

        var localThis = this;

        promise.then(function() {
            localThis.then(callback)
        });
    };

    /**
     * Record an update to be persisted.
     * @param {object} sender Object which is the origin of the change.
     * @param {string} path A path that indicates the object within the map model.
     * @param {object} value The value associated with the change.
     * @param {ChangeType} change The type of the change.
     */
    var updateMap = function(sender, path, value, change) {
        pendingOperations.push({name: persistedName, change: change, path: path, value: value});

        //Store the name of the most recent database. This is needed if it
        //changes and doesn't hurt if it doesn't change.
        persistedName = loadedMap.name;
    };
}

module.exports = PersistenceEngine;
