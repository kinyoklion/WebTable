/**
 * Created by Ryan Lamb on 11/14/15.
 */

/* The following comment informs JSLint about the expect method of Jasmine. */ 
/*global expect*/

describe("Point", function() {

    var Point;
    var fromJSON;
    var ChangeType;

    beforeEach(function(done) {
        require(['MapData/point', 'MapData/observable'], function(point, observable) {
            Point = point.Point;
            fromJSON = point.fromJSON;
            ChangeType = observable.ChangeType;
            done();
        });
    });

    it("should have default values", function() {
        var point = new Point();
        expect(point.x).toBe(0);
        expect(point.y).toBe(0);
    });

    it("should allow modification of the values", function() {
        var point = new Point();
        point.x = 10;
        point.y = 20;

        expect(point.x).toBe(10);
        expect(point.y).toBe(20);
    });

    it("should provide notification of x value changes", function() {
        var point = new Point();
        var observeCalled = false;

        point.observe(function(sender, path, value, change) {
            observeCalled = true;
            expect(path).toBe("x");
            expect(value).toBe(20);
            expect(change).toBe(ChangeType.UPDATED);
        });

        point.x = 20;

        expect(observeCalled).toBe(true);
    });

    it("should provide notification of y value changes", function() {
        var point = new Point();
        var observeCalled = false;

        point.observe(function(sender, path, value, change) {
            observeCalled = true;
            expect(path).toBe("y");
            expect(value).toBe(20);
            expect(change).toBe(ChangeType.UPDATED);
        });

        point.y = 20;

        expect(observeCalled).toBe(true);
    });

    it("should stringify", function() {
        var point = new Point();
        point.x = 12;
        point.y = 13;

        var jsonPoint = JSON.stringify(point);
        var parsed = JSON.parse(jsonPoint);
        expect(parsed.x).toBe(12);
        expect(parsed.y).toBe(13);
    });

    it("should be parsed from JSON", function() {
        var jsonPoint = '{"x":12, "y":13}';
        var parsed = JSON.parse(jsonPoint);
        var newPoint = fromJSON(parsed);
        expect(newPoint.x).toBe(12);
        expect(newPoint.y).toBe(13);
    });
});