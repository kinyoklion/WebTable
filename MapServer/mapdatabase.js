/**
 * Created by Ryan Lamb on 11/20/15.
 * 
 * This class handles basic database operations.
 */

/**
 * Construct a map database instance.
 * @param {string} url URL for the mongodb.
 */
function MapDatabase(url) {
    var MongoClient = require('mongodb').MongoClient;
    var assert = require('assert');
    var db;
    var connected = false;
    var writeOptions = {
        writeConcern: {
            w: 1,
            j: true,
            wtimeout: 5000
        }
    };

    /**
     * Insert a map in to the database.
     * @param {MapData} map Map to insert into the database.
     * @param {function} callback Method to call when the insert is complete.
     */
    this.insertMap = function(map, callback) {
        db.collection('maps').insertOne(map.toJSON(), function(err, result) {
            assert.equal(err, null);
            callback(result);
        });
    };

    /**
     * Get a map, by name, from the database.
     * @param {string} mapName The name of the map to access.
     * @param {function} callback Function to call when the map data is ready.
     */
    this.getMap = function(mapName, callback) {
        var cursor = db.collection('maps').find({
            "name": mapName
        });
        var foundDoc = false;

        cursor.each(function(err, doc) {
            assert.equal(err, null);
            //TODO: Determine how to handle more than one document.
            if (doc != null) {
                foundDoc = true;
                callback(foundDoc, doc);
            }
            else {
                callback(foundDoc, undefined);
            }
        });
    };

    this.updateField = function(mapName, path, value) {
        var update = {};
        if (value.toJSON !== undefined) {
            value = value.toJSON();
        }
        update[path] = value;

        return db.collection('maps').update({
            "name": mapName
        }, {
            $set: update
        }, writeOptions);
    };

    this.removeItem = function(mapName, path, index) {
        var unsetArgument = {};
        unsetArgument[path + "." + index] = 1;
        var removeArgument = {};
        removeArgument[path] = null;
        return db.collection('maps').update({
            name: mapName
        }, {
            $unset: unsetArgument
        }).then(function() {
            db.collection('maps').update({
                name: mapName
            }, {
                $pull: removeArgument
            }, writeOptions);
        });
    };

    this.addItem = function(mapName, path, value) {
        var pushArgument = {};
        if (value.toJSON !== undefined) {
            value = value.toJSON();
        }
        pushArgument[path] = value;
        console.log("Push path: " + path);
        return db.collection('maps').update({
            name: mapName
        }, {
            $push: pushArgument
        }, writeOptions);
    };

    this.findMaps = function(callback) {
        var cursor = db.collection('maps').find();
        cursor.each(function(err, doc) {
            assert.equal(err, null);
            if (doc != null) {
                console.dir(doc);
            }
            else {
                callback();
            }
        });
    };

    this.connect = function(callback) {
        if (connected) {
            callback();
        }
        else {
            MongoClient.connect(url, function(err, newDb) {
                assert.equal(null, err);
                db = newDb;
                connected = true;
                callback();
            });
        }
    };

    this.disconnect = function() {
        connected = false;
        db.close();
    };

    this._drop = function(callback) {
        db.dropDatabase(callback);
    };
};

module.exports = MapDatabase;