/**
 * Created by Ryan Lamb on 11/14/15.
 * This script will serve as the main entry point for the map server.
 */

var requirejs = require('requirejs');

requirejs.config({
    nodeRequire: require,
    baseUrl: '../',
});

requirejs(['MapData/mapdata'],
    function   (mapdata) {
        var mapInstance = new mapdata.MapData();
        console.log(mapInstance);
        
        var MongoClient = require('mongodb').MongoClient;
        var assert = require('assert');
        var url = 'mongodb://localhost:27017/test';
        MongoClient.connect(url, function(err, db) {
            assert.equal(null, err);
            console.log("Connected correctly to server.");
            db.close();
        });
    });