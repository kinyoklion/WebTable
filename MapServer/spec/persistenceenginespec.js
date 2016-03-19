/**
 * Created by Ryan Lamb on 3/19/16.
 */

/* The following comment informs JSLint about the expect method of Jasmine. */
/*global expect*/
/*global fail*/

describe("PersistenceEngine", function() {

    var persistence;
    var MapData;

    beforeEach(function(done) {
        var requirejs = require('requirejs');

        requirejs.config({
            nodeRequire: require,
            baseUrl: '../',
        });

        requirejs(['MapData/mapdata', 'MapData/observable'],
            function(mapdata, observable) {
                MapData = mapdata.MapData;
                var mapdatabase = require("../mapdatabase.js");
                var database = new mapdatabase('mongodb://localhost:27017/unittest');

                database.connect(function() {
                    //Clear the database so each test runs on a clean instance.
                    database._drop();
                    var persistenceEngine = require("../persistenceengine.js");
                    persistence = new persistenceEngine(database, mapdata, observable);
                    done();
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
                    persistence.loadMap("NewMapName", function(mapFound, map) {
                        if (mapFound === true && map != undefined) {
                            expect(map.name).toBe("NewMapName");
                            done();
                        }
                        else if (mapFound !== true) {
                            fail("Map could not be loaded.")
                            done();
                        }
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