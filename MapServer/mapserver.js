/**
 * Created by Ryan Lamb on 11/14/15.
 * This script will serve as the main entry point for the map server.
 */

var requirejs = require('requirejs');

requirejs.config({
    nodeRequire: require,
    baseUrl: '../',
});

requirejs(['MapData/mapdata',
        'MapData/layer',
        'MapData/observable'],
    function(mapdata,layer, observable) {
        const PORT = 8081;

        var mapdatabase = require("./mapdatabase.js");
        var database = new mapdatabase('mongodb://localhost:27017/test');
        var persistenceEngine = require("./persistenceengine.js");
        var persistence = new persistenceEngine(database, mapdata, observable);

        var http = require('http');
        var dispatcher = require('httpdispatcher');

        dispatcher.setStatic('resources');

        function loadMap(mapName, res, callback) {
            persistence.loadMap(mapName, function(found, map) {
                if (found === true && map !== undefined) {
                    if(callback !== undefined) {
                        callback(map);
                    }

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
        }

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
            loadMap(mapName, res);
        });

        var addLayerRegex = /\/addLayer\/([0-9a-zA-Z]+)\/([0-9a-zA-Z]+)/;
        dispatcher.beforeFilter(addLayerRegex, function(req, res) {
            var match = addLayerRegex.exec(req.url);
            var mapName = match[1];
            var layerName = match[2];
            console.log("Map: " + mapName + " Layer: " + layerName);

            loadMap(mapName, res, function(map) {
                var newLayer = new layer.Layer();
                newLayer.name = layerName;
                map.layers.addLayer(newLayer);
                persistence.then();
            });
        });

        var removeLayerRegex = /\/removeLayer\/([0-9a-zA-Z]+)\/([0-9a-zA-Z]+)/;
        dispatcher.beforeFilter(removeLayerRegex, function(req, res) {
            var match = removeLayerRegex.exec(req.url);
            var mapName = match[1];
            var layerName = match[2];
            console.log("Map: " + mapName + " Layer: " + layerName);

            loadMap(mapName, res, function(map) {
                map.layers.removeLayerByName(layerName);
                persistence.then();
            });
        });
        
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