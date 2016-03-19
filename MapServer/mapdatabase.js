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

    this.updateMap = function(mapName, path, value) {
        var update = {};
        update[path] = value;
        
        db.collection('maps').update({
            "name": mapName
        }, {
            $set: update
        }, {
            upsert: false
        });
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
        MongoClient.connect(url, function(err, newDb) {
            assert.equal(null, err);
            db = newDb;
            callback();
        });
    };

    this.disconnect = function() {
        db.close();
    };
};

module.exports = MapDatabase;