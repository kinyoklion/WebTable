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
        // var loadedMap = null;

        // persistence.loadMap("TestMap", function(found, map) {
        //     if (found === true && map !== undefined) {
        //         console.log("Loaded Map: " + map.name);
        //         loadedMap = map;
        //     }
        //     else if (found === false) {
        //         console.log("Map Not Found");
        //         persistence.createMap("TestMap", function() {});
        //     }
        // });

        var http = require('http');
        var dispatcher = require('httpdispatcher');

        dispatcher.setStatic('resources');
        dispatcher.beforeFilter(/\/getMap\/[0-9a-zA-Z]+/, function(req, res) {
            var mapName = req.url.slice(8);
            console.log("Map Name:" + mapName);

            persistence.loadMap(mapName, function(found, map) {
                if (found === true && map !== undefined) {
                    console.log("Loaded Map: " + map.name);
                    res.writeHead(200, {
                        'Content-Type': 'text/plain'
                    });
                    res.end("{\"ok\":1,\"map\":" + JSON.stringify(map) + "}");
                }
                else if (found === false) {
                    res.writeHead(200, {
                        'Content-Type': 'text/plain'
                    });
                    res.end(JSON.stringify("{\"ok\":0}"));
                }
            });
        });

        const PORT = 8081;

        function handleRequest(request, response) {
            try {
                console.log(request.url);
                dispatcher.dispatch(request, response);
            }
            catch (error) {
                console.log(error);
            }
        }

        var server = http.createServer(handleRequest);

        server.listen(PORT, function() {
            console.log("Server listening on: http://localhost:%s", PORT);
        });
    });