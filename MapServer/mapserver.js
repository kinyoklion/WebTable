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

        var http = require('http');
        var dispatcher = require('httpdispatcher');

        dispatcher.setStatic('resources');

        dispatcher.beforeFilter(/\/createMap\/[0-9a-zA-Z]+/, function(req, res) {
            var mapName = req.url.slice(11);
            persistence.createMap(mapName, function(result) {
                if(result.insertedCount == 0) {
                    res.end(JSON.stringify("{\"ok\":0}"));
                }
                else {
                    res.writeHead(200, {
                        'Content-Type': 'text/plain'
                    });
                    res.end(JSON.stringify("{\"ok\":1}"));
                }
            });
        });

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

        var modificationRegex = /\/(modify\/)([0-9a-zA-Z]+\/)(.*)/;
        dispatcher.beforeFilter(modificationRegex, function(req, res) {
            var match = modificationRegex.exec(req.url);
            var mapName = match[2];
            var modification = match[3];
            console.log("Map Name: " + mapName);
            console.log("Modification: " + modification);

            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end(JSON.stringify("{\"ok\":1}"));
        });

        const PORT = 8081;

        function handleRequest(request, response) {
            try {
                console.log("Request Url: " + request.url);
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