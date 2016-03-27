/**
 * Created by Ryan Lamb on 03/27/16.
 */

/* The following comment informs JSLint about the expect method of Jasmine. */
/*global expect*/

describe("Sprite", function() {

    var Sprite;
    var fromJSON;
    var ChangeType;
    var handlePropertyChangedTest;

    var testObject;

    beforeEach(function(done) {
        require(['MapData/sprite', 'MapData/observable',
                'MapData/specs/observabletesthelper'
            ],
            function(sprite, observable, observableHelper) {
                Sprite = sprite.Sprite;
                fromJSON = sprite.fromJSON;
                ChangeType = observable.ChangeType;
                testObject = new sprite.Sprite();
                handlePropertyChangedTest = observableHelper.handlePropertyChangedTest;
                done();
            });
    });

    it("should have a default transform", function() {
        expect(testObject.transform.x).toBe(0);
        expect(testObject.transform.y).toBe(0);
        expect(testObject.transform.z).toBe(0);
        expect(testObject.transform.xAngle).toBe(0);
        expect(testObject.transform.yAngle).toBe(0);
        expect(testObject.transform.zAngle).toBe(0);
        expect(testObject.transform.xScale).toBe(1);
        expect(testObject.transform.yScale).toBe(1);
        expect(testObject.transform.zScale).toBe(1);
    });

    it("should have an undefined resource id", function() {
        expect(testObject.resourceId).toBe(undefined);
    });

    it("should notify of resourceId value changes", function() {
        handlePropertyChangedTest(testObject, "resourceId", 11,
            ChangeType.UPDATED);
    });

    it("should notify of x value changes", function() {
        handlePropertyChangedTest(testObject.transform, "x", 10,
            ChangeType.UPDATED, testObject, "transform");
    });

    it("should notify of y value changes", function() {
        handlePropertyChangedTest(testObject.transform, "y", 11,
            ChangeType.UPDATED, testObject, "transform");
    });

    it("should notify of z value changes", function() {
        handlePropertyChangedTest(testObject.transform, "z", 12,
            ChangeType.UPDATED, testObject, "transform");
    });

    it("should notify of xAngle value changes", function() {
        handlePropertyChangedTest(testObject.transform, "xAngle", 13,
            ChangeType.UPDATED, testObject, "transform");
    });

    it("should notify of yAngle value changes", function() {
        handlePropertyChangedTest(testObject.transform, "yAngle", 14,
            ChangeType.UPDATED, testObject, "transform");
    });

    it("should notify of zAngle value changes", function() {
        handlePropertyChangedTest(testObject.transform, "zAngle", 15,
            ChangeType.UPDATED, testObject, "transform");
    });

    it("should notify of xScale value changes", function() {
        handlePropertyChangedTest(testObject.transform, "xScale", 16,
            ChangeType.UPDATED, testObject, "transform");
    });

    it("should notify of yScale value changes", function() {
        handlePropertyChangedTest(testObject.transform, "yScale", 17,
            ChangeType.UPDATED, testObject, "transform");
    });

    it("should notify of zScale value changes", function() {
        handlePropertyChangedTest(testObject.transform, "zScale", 18,
            ChangeType.UPDATED, testObject, "transform");
    });

    it("should stringify", function() {
        testObject.transform.x = 1;
        testObject.transform.y = 2;
        testObject.transform.z = 3;
        testObject.transform.xAngle = 4;
        testObject.transform.yAngle = 5;
        testObject.transform.zAngle = 6;
        testObject.transform.xScale = 7;
        testObject.transform.yScale = 8;
        testObject.transform.zScale = 9
        testObject.resourceId = 15;

        var jsonString = JSON.stringify(testObject);
        var parsed = JSON.parse(jsonString);
        var newObject = fromJSON(parsed);

        expect(newObject.transform.x).toBe(1);
        expect(newObject.transform.y).toBe(2);
        expect(newObject.transform.z).toBe(3);
        expect(newObject.transform.xAngle).toBe(4);
        expect(newObject.transform.yAngle).toBe(5);
        expect(newObject.transform.zAngle).toBe(6);
        expect(newObject.transform.xScale).toBe(7);
        expect(newObject.transform.yScale).toBe(8);
        expect(newObject.transform.zScale).toBe(9);
        expect(newObject.resourceId).toBe(15);
    });
});