function MapDatabase(url) {
    var MongoClient = require('mongodb').MongoClient;
    var assert = require('assert');
    var db;
    
    
    this.insertMap = function(map, callback) {
        db.collection('maps').insertOne(map.toJSON(), function(err, result) {
            assert.equal(err, null);
            callback(result);
        });
    };
    
    this.getMap = function(mapName, callback) {
        var cursor = db.collection('maps').find({"name": mapName});
        var foundDoc = false;
        cursor.each(function(err, doc) {
            assert.equal(err, null);
            //TODO: Determine how to handle more than one document.
            if(doc != null) {
                foundDoc = true;
                callback(foundDoc, doc);
            } else {
                callback(foundDoc, undefined);
            }
        });
    };
    
    this.findMaps = function(callback) {
        var cursor = db.collection('maps').find( );
        cursor.each(function(err, doc) {
            assert.equal(err, null);
            if (doc != null) {
                console.dir(doc);
            } else {
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