/**
 * Created by Ryan Lamb on 11/14/15.
 */

/* The following comment informs JSLint about the expect method of Jasmine. */ 
/*global expect*/

describe("Transform", function() {

    var Transform;
    var fromJSON;
    var ChangeType;
    
    var testTransform;

    beforeEach(function(done) {
        require(['MapData/transform', 'MapData/observable'], function(transform, observable) {
            Transform = transform.Transform;
            fromJSON = transform.fromJSON;
            ChangeType = observable.ChangeType;
            testTransform = new transform.Transform();
            done();
        });
    });

    it("should have default values", function() {
        expect(testTransform.x).toBe(0);
        expect(testTransform.y).toBe(0);
        expect(testTransform.z).toBe(0);
        expect(testTransform.xAngle).toBe(0);
        expect(testTransform.yAngle).toBe(0);
        expect(testTransform.zAngle).toBe(0);
        expect(testTransform.xScale).toBe(1);
        expect(testTransform.yScale).toBe(1);
        expect(testTransform.zScale).toBe(1);
    });
    
    it("should allow modification of values", function() {
        testTransform.x = 1;
        testTransform.y = 2;
        testTransform.z = 3;
        testTransform.xAngle = 4;
        testTransform.yAngle = 5;
        testTransform.zAngle = 6;
        testTransform.xScale = 7;
        testTransform.yScale = 8;
        testTransform.zScale = 9;
        
        expect(testTransform.x).toBe(1);
        expect(testTransform.y).toBe(2);
        expect(testTransform.z).toBe(3);
        expect(testTransform.xAngle).toBe(4);
        expect(testTransform.yAngle).toBe(5);
        expect(testTransform.zAngle).toBe(6);
        expect(testTransform.xScale).toBe(7);
        expect(testTransform.yScale).toBe(8);
        expect(testTransform.zScale).toBe(9);
    });
    
    function handlePropertyChangedTest(object, property, testValue, changeType) {
        var observedCalled = false;
        
        object.observe(function(sender, path, value, change) {
            expect(value).toBe(testValue);
            expect(change).toBe(changeType);
            expect(path).toBe(property);
            observedCalled = true;
        });
        
        object[property] = testValue;
        expect(observedCalled).toBe(true);
    }
    
    it("should notify of x value changes", function() {
        handlePropertyChangedTest(testTransform, "x", 10, ChangeType.UPDATED);
    });
    
    it("should notify of y value changes", function() {
        handlePropertyChangedTest(testTransform, "y", 11, ChangeType.UPDATED);
    });
    
    it("should notify of z value changes", function() {
        handlePropertyChangedTest(testTransform, "z", 12, ChangeType.UPDATED);
    });
    
    it("should notify of xAngle value changes", function() {
        handlePropertyChangedTest(testTransform, "xAngle", 13, ChangeType.UPDATED);
    });
    
    it("should notify of yAngle value changes", function() {
        handlePropertyChangedTest(testTransform, "yAngle", 14, ChangeType.UPDATED);
    });
    
    it("should notify of zAngle value changes", function() {
        handlePropertyChangedTest(testTransform, "zAngle", 15, ChangeType.UPDATED);
    });
    
    it("should notify of xScale value changes", function() {
        handlePropertyChangedTest(testTransform, "xScale", 16, ChangeType.UPDATED);
    });
    
    it("should notify of yScale value changes", function() {
        handlePropertyChangedTest(testTransform, "yScale", 17, ChangeType.UPDATED);
    });
    
    it("should notify of zScale value changes", function() {
        handlePropertyChangedTest(testTransform, "zScale", 18, ChangeType.UPDATED);
    });
    
    it("should stringify", function () {
        testTransform.x = 1;
        testTransform.y = 2;
        testTransform.z = 3;
        testTransform.xAngle = 4;
        testTransform.yAngle = 5;
        testTransform.zAngle = 6;
        testTransform.xScale = 7;
        testTransform.yScale = 8;
        testTransform.zScale = 9;
        
        var jsonString = JSON.stringify(testTransform);
        var parsed = JSON.parse(jsonString);
        var newTransform = fromJSON(parsed);
        
        expect(newTransform.x).toBe(1);
        expect(newTransform.y).toBe(2);
        expect(newTransform.z).toBe(3);
        expect(newTransform.xAngle).toBe(4);
        expect(newTransform.yAngle).toBe(5);
        expect(newTransform.zAngle).toBe(6);
        expect(newTransform.xScale).toBe(7);
        expect(newTransform.yScale).toBe(8);
        expect(newTransform.zScale).toBe(9);
    });
});