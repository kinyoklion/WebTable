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
        var mapdatabase = require("./mapdatabase.js");
        var database = new mapdatabase('mongodb://localhost:27017/test');
        database.connect(function () {
            database.getMap("TestMap", function(found, map) {
                if(found === true) {
                    if(map !== undefined) {
                        console.log("Found the map!");
                        console.dir(map);
                        console.log("Deserializing the map.");
                        var loadedMap = mapdata.fromJSON(map);
                        console.log("Deserialized the map.");
                        console.dir(loadedMap)
                        database.disconnect();
                    }
                } else {
                    console.log("Creating new map entry.");
                    map = new mapdata.MapData();
                    map.name = "TestMap";
                    database.insertMap(map, function () {
                        console.log("Inserted new map.");
                        database.disconnect(); 
                    });
                }
            });
        });
    });