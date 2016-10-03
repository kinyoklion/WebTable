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
        'MapData/observable',
        'MapData/sprite'],
    function(mapdata,layer, observable, sprite) {
        const PORT = 8081;

        var mapdatabase = require("./mapdatabase.js");
        var database = new mapdatabase('mongodb://localhost:27017/test');
        var persistenceEngine = require("./persistenceengine.js");
        var persistence = new persistenceEngine(database, mapdata, observable);

        var http = require('http');
        var dispatcher = require('httpdispatcher');

        dispatcher.setStatic('static');
        dispatcher.setStaticDirname('../');

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
            loadMap(mapName, res);
        });

        var addLayerRegex = /\/addLayer\/([0-9a-zA-Z]+)\/([0-9a-zA-Z]+)/;
        dispatcher.beforeFilter(addLayerRegex, function(req, res) {
            var match = addLayerRegex.exec(req.url);
            var mapName = match[1];
            var layerName = match[2];

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

            loadMap(mapName, res, function(map) {
                map.layers.removeLayerByName(layerName);
                persistence.then();
            });
        });

        // addItem/map/layer/name/resource
        var addItemToLayer = /\/addItem\/([0-9a-zA-Z]+)\/([0-9a-zA-Z]+)\/([0-9a-zA-Z]+)\/([0-9a-zA-Z.]+)/;
        dispatcher.beforeFilter(addItemToLayer, function(req, res) {
            var match = addItemToLayer.exec(req.url);
            var mapName = match[1];
            var layerName = match[2];
            //RRL: I didn't name items, but maybe I should have.
            var itemName = match[3];
            var resource = match[4];
            loadMap(mapName, res, function(map) {
                var layer = map.layers.getLayerByName(layerName);
                var resourceId = map.resources.addResource(resource, true);
                var item = new sprite.Sprite();
                item.resourceId = resourceId;
                layer.addObject(item);
                persistence.then();
            });
        });

        // changeGridSize/map/size
        var changeGridSize = /\/changeGridSize\/([0-9a-zA-Z]+)\/([0-9]+)/;
        dispatcher.beforeFilter(changeGridSize, function(req, res) {
            var match = changeGridSize.exec(req.url);
            var mapName = match[1];
            var gridSize = match[2];

            loadMap(mapName, res, function(map) {
                map.settings.gridSize = gridSize;
                persistence.then();
            });
        });

        // adjustGridOffset/map/xoffset/yoffset
        var adjustGridOffset = /\/adjustGridOffset\/([0-9a-zA-Z]+)\/([0-9]+)\/([0-9]+)/;
        dispatcher.beforeFilter(adjustGridOffset, function(req, res) {
            var match = adjustGridOffset.exec(req.url);
            var mapName = match[1];
            var offsetX = match[2];
            var offsetY = match[3];

            loadMap(mapName, res, function(map) {
                map.settings.gridOffset.x = offsetX;
                map.settings.gridOffset.y = offsetY;
                persistence.then();
            });
        });

        var clientMap = "test";

        // setClientMap/map/
        var setClientMap = /\/setClientMap\/([0-9a-zA-Z]+)/;
        dispatcher.beforeFilter(setClientMap, function(req, res) {
            var match = setClientMap.exec(req.url);
            clientMap = match[1];

            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end("{\"ok\":1,\"clientmap\":" + clientMap + "}");
        });

        var getClientMap = /\/getClientMap/;
        dispatcher.beforeFilter(getClientMap, function(req, res) {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end("{\"ok\":1,\"clientmap\":\"" + clientMap + "\"}");
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