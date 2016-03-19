/**
 * Created by Ryan Lamb on 11/14/15.
 * This script will serve as the main entry point for the map server.
 */

var requirejs = require('requirejs');

requirejs.config({
    nodeRequire: require,
    baseUrl: '../',
});

requirejs(['MapData/mapdata', 'MapData/observable'],
    function(mapdata, observable) {
        var mapdatabase = require("./mapdatabase.js");
        var database = new mapdatabase('mongodb://localhost:27017/test');
        var persistenceEngine = require("./persistenceengine.js");
        var persistence = new persistenceEngine(database, mapdata, observable);

        persistence.loadMap("Name1", function(found, map) {
            if (found === true && map !== undefined) {
                console.log("Map Name: " + map.name);
                if (map.name === "Name1") {
                    map.name = "Name0";
                }
                else {
                    map.name = "Name1";
                }
            }
            else if (found === false) {
                console.log("Map Not Found");
                //persistence.createMap("Name0", function() {});
            }
        });
    });