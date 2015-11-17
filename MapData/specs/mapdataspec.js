/**
 * Created by Ryan Lamb on 11/14/15.
 */

describe("MapData", function() {

    var MapData;
    var GridType;
    var fromJSON;
    var Point;

    beforeEach(function(done) {
        require(['MapData/mapdata', 'MapData/point'], function(mapdata, point) {
            MapData = mapdata.MapData;
            GridType = mapdata.GridType;
            fromJSON = mapdata.fromJSON;
            Point = point.Point;
            done();
        });
    });

    it("should have default values", function() {
        var data = new MapData();
        expect(data.settings.gridSize).toBe(10);
        expect(data.settings.gridType).toBe(GridType.SQUARE);
        expect(data.settings.gridOffset.x).toBe(0);
        expect(data.settings.gridOffset.y).toBe(0);
    });

    it("should not allow the settings to be replaced", function() {
        var data = new MapData();
        expect(function() { data.settings = "test"}).toThrow(new Error("Cannot replace settings."));
    });

    it("should stringify", function() {
        var data = new MapData();
        data.settings.gridType = GridType.HEX;
        data.settings.gridSize = 32;
        data.settings.gridOffset = new Point(99, 100);

        var jsonString = JSON.stringify(data);
        var parsedObject = JSON.parse(jsonString);
        var newData = fromJSON(parsedObject);

        expect(newData.settings.gridSize).toBe(32);
        expect(newData.settings.gridType).toBe(GridType.HEX);
        expect(newData.settings.gridOffset.x).toBe(99);
        expect(newData.settings.gridOffset.y).toBe(100);
    });
});