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

    this.createMap = function(mapName, callback) {
        database.connect(function() {
            var map = new mapdata.MapData();
            map.name = mapName;
            database.insertMap(map, function(result) {
                callback(result);
            });
        });
    };
    
    this.then = function(callback) {
        Promise.all(operations).then(function() {
            operations = [];
            callback();
        });
    };

    var updateMap = function(sender, path, value, change) {
        if (change === observable.ChangeType.UPDATED) {
            operations.push(database.updateField(persistedName, path, value));

        }
        else if (change === observable.ChangeType.REMOVED) {
            operations.push(database.removeItem(persistedName, path, value));
        }
        else if (change === observable.ChangeType.ADDED) {
            console.log("Adding item to database! Path: " + path);
            operations.push(database.addItem(persistedName, path, value));
        }

        //Store the name of the most recent database. This is needed if it
        //changes and doesn't hurt if it doesn't change.
        persistedName = loadedMap.name;
    };
}

module.exports = PersistenceEngine;
