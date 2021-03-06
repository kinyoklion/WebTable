/**
 * Created by Ryan Lamb on 11/14/15.
 */

/* The following comment informs JSLint about the expect method of Jasmine. */
/*global expect*/

describe("Layer", function() {

    var Layer;
    var fromJSON;
    var ChangeType;
    var MapObject;
    var Sprite;

    beforeEach(function(done) {
        require(['MapData/layer', 'MapData/observable', 'MapData/mapobject', 'MapData/sprite'], function(layer, observable, mapobject, sprite) {
            Layer = layer.Layer;
            fromJSON = layer.fromJSON;
            ChangeType = observable.ChangeType;
            Sprite = sprite.Sprite;
            MapObject = mapobject.MapObject;
            done();
        });
    });

    it("should have default values", function() {
        var layer = new Layer();
        expect(layer.visible).toBe(true);
        expect(layer.editorVisible).toBe(true);
        expect(layer.viewerVisible).toBe(true);
        expect(layer.opacity).toBe(1);
    });

    it("should allow modification of the values", function() {
        var layer = new Layer();
        layer.visible = false;
        layer.editorVisible = false;
        layer.viewerVisible = false;
        layer.opacity = 0.5;
        layer.name = "TestLayer";

        expect(layer.visible).toBe(false);
        expect(layer.editorVisible).toBe(false);
        expect(layer.viewerVisible).toBe(false);
        expect(layer.opacity).toBe(0.5);
        expect(layer.name).toBe("TestLayer");

    });

    it("should provide notification of visible value changes", function() {
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

    it("should provide notification of editorVisible value changes", function() {
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

    it("should provide notification of editorVisible value changes", function() {
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

    it("should provide notification of opacity value changes", function() {
        var layer = new Layer();
        var observeCalled = false;

        layer.observe(function(sender, path, value, change) {
            observeCalled = true;
            expect(path).toBe("opacity");
            expect(value).toBe(0.5);
            expect(change).toBe(ChangeType.UPDATED);
        });

        layer.opacity = 0.5;

        expect(observeCalled).toBe(true);
    });

    it("should provide notification of name value changes", function() {
        var layer = new Layer();
        var observeCalled = false;

        layer.observe(function(sender, path, value, change) {
            observeCalled = true;
            expect(path).toBe("name");
            expect(value).toBe("ChangedName");
            expect(change).toBe(ChangeType.UPDATED);
        });

        layer.name = "ChangedName";

        expect(observeCalled).toBe(true);
    });

    it("should stringify", function() {
        var layer = new Layer();
        layer.visible = false;
        layer.editorVisible = true;
        layer.viewerVisible = false;
        layer.opacity = 0.25;

        var jsonLayer = JSON.stringify(layer);
        var parsed = JSON.parse(jsonLayer);
        expect(parsed.visible).toBe(false);
        expect(parsed.editorVisible).toBe(true);
        expect(parsed.viewerVisible).toBe(false);
        expect(parsed.opacity).toBe(0.25);
    });

    it("should allow addition of MapObjects", function() {
        var object = new MapObject();
        object.transform.x = 10;
        var layer = new Layer();
        layer.addObject(object);
        expect(layer.getObjectCount()).toBe(1);
        expect(layer.getObjectByIndex(0).transform.x).toBe(10);
    });

    it("should allow addition of Sprites", function() {
        var object = new Sprite();
        object.resourceId = 20;
        object.transform.x = 10;
        var layer = new Layer();
        layer.addObject(object);
        expect(layer.getObjectCount()).toBe(1);
        expect(layer.getObjectByIndex(0).transform.x).toBe(10);
        expect(layer.getObjectByIndex(0).resourceId).toBe(20);
    });

    it("should be parsed from JSON", function() {
        var sprite = new Sprite();
        sprite.resourceId = 20;
        sprite.transform.x = 10;

        var object = new MapObject();
        object.transform.x = 13;

        var layer = new Layer();
        layer.visible = false;
        layer.editorVisible = true;
        layer.viewerVisible = false;
        layer.opacity = 0.25;

        layer.addObject(sprite);
        layer.addObject(object);

        var jsonLayer = JSON.stringify(layer);
        var parsed = JSON.parse(jsonLayer);
        var newLayer = fromJSON(parsed);

        expect(newLayer.visible).toBe(false);
        expect(newLayer.editorVisible).toBe(true);
        expect(newLayer.viewerVisible).toBe(false);
        expect(parsed.opacity).toBe(0.25);

        expect(newLayer.getObjectCount()).toBe(2);
        expect(newLayer.getObjectByIndex(0).transform.x).toBe(10);
        expect(newLayer.getObjectByIndex(0).resourceId).toBe(20);

        expect(newLayer.getObjectByIndex(1).transform.x).toBe(13);
    });
});