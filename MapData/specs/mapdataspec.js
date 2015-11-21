/**
 * Created by Ryan Lamb on 11/14/15.
 */
 
/* The following comment informs JSLint about the expect method of Jasmine. */ 
/*global expect*/

describe("MapData", function() {

    var MapData;
    var GridType;
    var fromJSON;
    var Point;
    var handlePropertyChangedTest;
    var ChangeType;
    var Resource;
    var Layer;
    
    var mapData;

    beforeEach(function(done) {
        require(['MapData/mapdata', 'MapData/point',
            'MapData/specs/observabletesthelper', 'MapData/observable',
            'MapData/resource', 'MapData/layer'], 
            function(mapdata, point, observabletesthelper, observable, resource, layer) {
                
            MapData = mapdata.MapData;
            GridType = mapdata.GridType;
            fromJSON = mapdata.fromJSON;
            Point = point.Point;
            mapData = new mapdata.MapData();
            handlePropertyChangedTest = observabletesthelper.handlePropertyChangedTest;
            ChangeType = observable.ChangeType;
            Resource = resource.Resource;
            Layer = layer.Layer;
            done();
        });
    });

    it("should have default values", function() {
        expect(mapData.settings.gridSize).toBe(10);
        expect(mapData.settings.gridType).toBe(GridType.SQUARE);
        expect(mapData.settings.gridOffset.x).toBe(0);
        expect(mapData.settings.gridOffset.y).toBe(0);
        
        expect(mapData.layers.getLayerCount()).toBe(0);
    });

    it("should not allow the settings to be replaced", function() {
        expect(function() { mapData.settings = "test"}).toThrow(new Error("Cannot set: settings"));
    });
    
    it("should not allow the layers to be replaced", function() {
        expect(function() { mapData.layers = "test"}).toThrow(new Error("Cannot set: layers"));
    });
    
    it("should not allow the resources to be replaced", function() {
        expect(function() { mapData.resources = "test"}).toThrow(new Error("Cannot set: resources"));
    });
    
    it("should notify of resources value changes", function() {
        var observerCalled = false;
        
        mapData.observe(function(sender, path, value, change) {
            observerCalled = true;
            expect(change).toBe(ChangeType.ADDED);
            expect(value.value).toBe("value");
            expect(value.isReference).toBe(false);
            expect(path).toBe("resources.resourceList");
        });
        
        mapData.resources.addResource("value", false);
        
        expect(observerCalled).toBe(true);
    });
    
    it("should notify of layers value changes", function() {
        var observerCalled = false;
        
        mapData.observe(function(sender, path, value, change) {
            observerCalled = true;
            expect(change).toBe(ChangeType.ADDED);
            expect(value.name).toBe("TestLayer");
            expect(path).toBe("layers.layers");
        });
        
        var newLayer = new Layer();
        newLayer.name = "TestLayer";
        mapData.layers.addLayer(newLayer);
        
        expect(observerCalled).toBe(true);
    });

    it("should stringify", function() {
        mapData.settings.gridType = GridType.HEX;
        mapData.settings.gridSize = 32;
        mapData.settings.gridOffset = new Point(99, 100);

        var jsonString = JSON.stringify(mapData);
        var parsedObject = JSON.parse(jsonString);
        var newMapData = fromJSON(parsedObject);

        expect(newMapData.settings.gridSize).toBe(32);
        expect(newMapData.settings.gridType).toBe(GridType.HEX);
        expect(newMapData.settings.gridOffset.x).toBe(99);
        expect(newMapData.settings.gridOffset.y).toBe(100);
    });
});