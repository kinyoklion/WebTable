/**
 * Created by Ryan Lamb on 11/14/15.
 */

describe("MapSettings", function() {

    var MapSettings;
    var GridType;
    var Point;
    var fromJSON;
    var ChangeType;

    beforeEach(function(done) {
        require(['MapData/mapsettings', 'MapData/point', 'MapData/observable'], function(mapsettings, point, observable) {
            MapSettings = mapsettings.MapSettings;
            GridType = mapsettings.GridType;
            Point = point.Point;
            fromJSON = mapsettings.fromJSON;
            ChangeType = observable.ChangeType;
            done();
        });
    });

    it("should have default values", function() {
        var settings = new MapSettings();
        expect(settings.gridSize).toBe(10);
        expect(settings.gridType).toBe(GridType.SQUARE);
        expect(settings.gridOffset.x).toBe(0);
        expect(settings.gridOffset.y).toBe(0);

    });

    it("should allow modification of the grid size", function() {
        var settings = new MapSettings();
        settings.gridSize = 20;
        expect(settings.gridSize).toBe(20);
    });

    it("should notify of changes to the grid size", function() {
        var settings = new MapSettings();
        var observerCalled = false;

        settings.observe(function(sender, path, value) {
            observerCalled = true;
            expect(path).toBe("gridSize");
            expect(value).toBe(20);
        });

        settings.gridSize = 20;

        expect(observerCalled).toBe(true);
    });

    it("should notify of changes to the grid type", function() {
        var settings = new MapSettings();
        var observerCalled = false;

        settings.observe(function(sender, path, value, change) {
            observerCalled = true;
            expect(path).toBe("gridType");
            expect(value).toBe(GridType.HEX);
            expect(change).toBe(ChangeType.UPDATED);
        });

        settings.gridType = GridType.HEX;

        expect(observerCalled).toBe(true);
    });

    it("should notify of changes to the grid offset", function() {
        var settings = new MapSettings();
        var observerCalled = false;

        settings.observe(function(sender, path, value, change) {
            observerCalled = true;
            expect(path).toBe("gridOffset");
            expect(value.x).toBe(20);
            expect(value.y).toBe(30);
            expect(change).toBe(ChangeType.UPDATED);
        });

        settings.gridOffset = new Point(20, 30);

        expect(observerCalled).toBe(true);
    });

    it("should notify of changes to the x value of the grid offset", function() {
        var settings = new MapSettings();
        var observerCalled = false;

        settings.observe(function(sender, path, value, change) {
            observerCalled = true;
            expect(path).toBe("gridOffset.x");
            expect(value).toBe(20);
            expect(change).toBe(ChangeType.UPDATED);
        });

        settings.gridOffset.x = 20;

        expect(observerCalled).toBe(true);
    });

    it("should notify of changes to the y value of the grid offset", function() {
        var settings = new MapSettings();
        var observerCalled = false;

        settings.observe(function(sender, path, value, change) {
            observerCalled = true;
            expect(path).toBe("gridOffset.y");
            expect(value).toBe(30);
            expect(change).toBe(ChangeType.UPDATED);
        });

        settings.gridOffset.y = 30;

        expect(observerCalled).toBe(true);
    });

    it("should stringify", function() {
        var settings = new MapSettings();
        settings.gridType = GridType.HEX;
        settings.gridSize = 32;
        settings.gridOffset = new Point(99, 100);

        var jsonString = JSON.stringify(settings);
        var parsedObject = JSON.parse(jsonString);
        var newSettings = fromJSON(parsedObject);

        expect(settings.gridSize).toBe(32);
        expect(settings.gridType).toBe(GridType.HEX);
        expect(settings.gridOffset.x).toBe(99);
        expect(settings.gridOffset.y).toBe(100);
    });
});