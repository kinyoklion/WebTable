/**
 * Created by Ryan Lamb on 11/14/15.
 */

describe("Layer", function() {

    var Layer;
    var fromJSON;
    var ChangeType;

    beforeEach(function(done) {
        require(['MapData/layer', 'MapData/observable'], function(layer, observable) {
            Layer = layer.Layer;
            fromJSON = layer.fromJSON;
            ChangeType = observable.ChangeType;
            done();
        });
    });

    it("should have default values", function() {
        var layer = new Layer();
        expect(layer.visible).toBe(true);
        expect(layer.editorVisible).toBe(true);
        expect(layer.viewerVisible).toBe(true);
    });

    it("should allow modification of the values", function() {
        var layer = new Layer();
        layer.visible = false;
        layer.editorVisible = false;
        layer.viewerVisible = false;
    });

    it("should provide notification of the visible value changes", function() {
        var layer = new Layer();
        var observeCalled = false;

        layer.observe(function(sender, path, value, change) {
            observeCalled = true;
            expect(path).toBe("visible");
            expect(value).toBe(false);
            expect(change).toBe(ChangeType.UPDATED);
        });

        layer.visible = false;

        expect(observeCalled).toBe(true);
    });

    it("should provide notification of the editorVisible value changes", function() {
        var layer = new Layer();
        var observeCalled = false;

        layer.observe(function(sender, path, value, change) {
            observeCalled = true;
            expect(path).toBe("editorVisible");
            expect(value).toBe(false);
            expect(change).toBe(ChangeType.UPDATED);
        });

        layer.editorVisible = false;

        expect(observeCalled).toBe(true);
    });
    
    it("should provide notification of the editorVisible value changes", function() {
        var layer = new Layer();
        var observeCalled = false;

        layer.observe(function(sender, path, value, change) {
            observeCalled = true;
            expect(path).toBe("viewerVisible");
            expect(value).toBe(false);
            expect(change).toBe(ChangeType.UPDATED);
        });

        layer.viewerVisible = false;

        expect(observeCalled).toBe(true);
    });

    it("should stringify", function() {
        var layer = new Layer();
        layer.visible = false;
        layer.editorVisible = true;
        layer.viewerVisible = false;

        var jsonLayer = JSON.stringify(layer);
        var parsed = JSON.parse(jsonLayer);
        expect(parsed.visible).toBe(false);
        expect(parsed.editorVisible).toBe(true);
        expect(parsed.viewerVisible).toBe(false);
    });

    it("should be parsed from JSON", function() {
        var layer = new Layer();
        layer.visible = false;
        layer.editorVisible = true;
        layer.viewerVisible = false;

        var jsonLayer = JSON.stringify(layer);
        var parsed = JSON.parse(jsonLayer);
        var newLayer = fromJSON(parsed);
        
        expect(newLayer.visible).toBe(false);
        expect(newLayer.editorVisible).toBe(true);
        expect(newLayer.viewerVisible).toBe(false);
    });
});