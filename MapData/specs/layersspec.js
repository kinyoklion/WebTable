/**
 * Created by Ryan Lamb on 11/18/15.
 */

/* The following comment informs JSLint about the expect method of Jasmine. */ 
/*global expect*/

describe("Layers", function() {

    var Layers;
    var Layer;
    var fromJSON;
    var ChangeType;
    
    var testLayers;

    beforeEach(function(done) {
        require(['MapData/layers', 'MapData/layer', 'MapData/observable'], function(layers, layer, observable) {
            Layers = layers.Layers;
            Layer = layer.Layer;
            fromJSON = layers.fromJSON;
            console.log("Type of fromJSON: " + typeof(fromJSON));
            ChangeType = observable.ChangeType;
            testLayers = new Layers();
            done();
        });
    });
    
    it("should notify when a layer is added", function() {
        var observerCalled = false;
        var testLayer = new Layer();
        testLayer.name = "TestLayer";
        
        testLayers.observe(function(sender, path, value, change) {
            observerCalled = true;
            expect(value.name).toBe("TestLayer");
            expect(change).toBe(ChangeType.ADDED);
            expect(path).toBe("layers");
        });
        
        testLayers.addLayer(testLayer);
        expect(observerCalled).toBe(true);
    });
    
    it("should notify when a layer is removed", function() {
        var observerCalled = false;
        var testLayer = new Layer();
        testLayer.name = "TestLayer";
        testLayers.addLayer(testLayer);
        
        testLayers.observe(function(sender, path, value, change) {
            observerCalled = true;
            expect(value).toBe(0);
            expect(change).toBe(ChangeType.REMOVED);
            expect(path).toBe("layers");
        });
        
        testLayers.removeLayerByName("TestLayer");
        expect(observerCalled).toBe(true);
    });
    
    it("should increment the layer count when layers are added", function (){
        expect(testLayers.getLayerCount()).toBe(0);
        testLayers.addLayer(new Layer());
        expect(testLayers.getLayerCount()).toBe(1);
        testLayers.addLayer(new Layer());
        expect(testLayers.getLayerCount()).toBe(2);
    });
    
    if("should decriment the layer count when layers are removed", function() {
        var layer1 = new Layer();
        layer1.name = "Layer1";
        var layer2 = new Layer();
        layer2.name = "Layer2";
        testLayers.addLayer(layer1);
        testLayers.addLayer(layer2);
        
        testLayers.removeLayerByName("Layer1");
        expect(testLayers.getLayerCount()).toBe(1);
        testLayers.removeLayerByName("Layer2");
        expect(testLayers.getLayerCount).toBe(0);
    });
    
    it("should notify of changes to contained layers", function() {
        var observerCalled = false;
        var testLayer = new Layer();
        testLayer.name = "TestLayer";
        testLayers.addLayer(testLayer);
        
        testLayers.observe(function(sender, path, value, change) {
            observerCalled = true;
            expect(path).toBe("layers.0.name");
            expect(value).toBe("NewName");
            expect(change).toBe(ChangeType.UPDATED);
        });
        
        testLayer.name = "NewName";
        expect(observerCalled).toBe(true); 
    });
    
    it("should be able to get a layer that has been added", function() {
        var observerCalled = false;
        var testLayer = new Layer();
        testLayer.name = "TestLayer";
        testLayers.addLayer(testLayer);
        var accessedLayer = testLayers.getLayerByName("TestLayer");
        expect(accessedLayer.name).toBe("TestLayer");
    });
    
    it("should not be able to get a layer that has been removed", function() {
        var observerCalled = false;
        var testLayer = new Layer();
        testLayer.name = "TestLayer";
        testLayers.addLayer(testLayer);
        testLayers.removeLayerByName("TestLayer");
        var accessedLayer = testLayers.getLayerByName("TestLayer");
        expect(accessedLayer).toBe(undefined);
    });
    
   it("should stringify and de-stringify", function() {
        var layer1 = new Layer();
        layer1.name = "Layer1";
        var layer2 = new Layer();
        layer2.name = "Layer2";
        testLayers.addLayer(layer1);
        testLayers.addLayer(layer2);
        var jsonString = JSON.stringify(testLayers);
        var jsonObject = JSON.parse(jsonString);
        var newLayers = fromJSON(jsonObject);
        expect(newLayers.getLayerCount()).toBe(2);
        expect(testLayers.getLayerByIndex(0).name).toBe("Layer1");
        expect(testLayers.getLayerByIndex(1).name).toBe("Layer2");
   });
});