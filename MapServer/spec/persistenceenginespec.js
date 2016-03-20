/**
 * Created by Ryan Lamb on 3/19/16.
 */

/* The following comment informs JSLint about the expect method of Jasmine. */
/*global expect*/
/*global fail*/

describe("PersistenceEngine", function() {

    var persistence;
    var MapData;
    var Layer;
    var count = 0;

    beforeEach(function(done) {
        var requirejs = require('requirejs');

        requirejs.config({
            nodeRequire: require,
            baseUrl: '../',
        });

        requirejs(['MapData/mapdata', 'MapData/observable', 'MapData/layer'],
            function(mapdata, observable, layer) {
                MapData = mapdata.MapData;
                Layer = layer.Layer;

                var mapdatabase = require("../mapdatabase.js");
                var database = new mapdatabase('mongodb://localhost:27017/unittest' + count);
                count = count + 1;

                database.connect(function() {
                    //Clear the database so each test runs on a clean instance.
                    database._drop(function() {
                        var persistenceEngine = require("../persistenceengine.js");
                        persistence = new persistenceEngine(database, mapdata, observable);
                        done();
                    });

                });

            });
    });

    it("should be created", function() {
        expect(persistence).not.toBe(null);
        expect(persistence).not.toBe(undefined);
    });

    it("should not have the test map", function(done) {
        persistence.loadMap("TestMap", function(mapLoaded, map) {
            expect(mapLoaded).toBe(false);
            expect(map).toBe(undefined);
            done();
        });
    });

    it("should allow creation of a map", function(done) {
        persistence.createMap("TestMap", function(result) {
            expect(result.result.ok).toBe(1);
            done();
        });
    });

    it("should persist changes to the map name", function(done) {
        persistence.createMap("TestMap", function(result) {
            persistence.loadMap("TestMap", function(mapFound, map) {
                if (mapFound === true && map != undefined) {
                    map.name = "NewMapName";
                    persistence.then(function() {
                        persistence.loadMap("NewMapName", function(mapFound, map) {
                            if (mapFound === true && map != undefined) {
                                expect(map.name).toBe("NewMapName");
                                done();
                            }
                            else if (mapFound !== true) {
                                fail("Map could not be loaded.");
                                done();
                            }
                        });
                    });
                }
                else if (mapFound !== true) {
                    fail("Map could not be loaded.");
                    done();
                }
            });

        });
    });

    it("should persist addition of layers", function(done) {
        persistence.createMap("TestMap", function(result) {
            persistence.loadMap("TestMap", function(mapFound, map) {
                if (mapFound === true && map != undefined) {
                    var testLayer = new Layer();
                    testLayer.name = "TestLayer";

                    var testLayer2 = new Layer();
                    testLayer2.name = "TestLayer2";

                    map.layers.addLayer(testLayer);
                    map.layers.addLayer(testLayer2);

                    persistence.then(function() {
                        persistence.loadMap("TestMap", function(mapFound, map) {
                            if (mapFound === true && map != undefined) {
                                expect(map.layers.getLayerCount()).toBe(2);
                                expect(map.layers.getLayerByName("TestLayer").name).toBe("TestLayer");
                                expect(map.layers.getLayerByName("TestLayer2").name).toBe("TestLayer2");
                                done();
                            }
                        });
                    });

                }
                else if (mapFound !== true) {
                    fail("Map could not be loaded.")
                    done();
                }
            });

        });
    });
});