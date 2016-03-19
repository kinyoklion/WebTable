/**
 * Created by Ryan Lamb on 11/14/15.
 * Defines an object that represents a point.
 */

define(['MapData/observable'], function (observable) {

    /**
     * Object which represents an X, Y coordinate pair.
     * @param {number} [opt_x] The optional x coordinate value.
     * @param {number} [opt_y] The optional y coordinate value.
     * @constructor
     */
    function Point(opt_x, opt_y) {
        var x = (opt_x === undefined) ? 0 : opt_x;
        var y = (opt_y === undefined) ? 0 : opt_y;

        observable.MakeObservable(this);

        this.createObservedProperty("x", x);
        this.createObservedProperty("y", y);

        /**
         * Create a JSON version of this object which does not include extra information.
         */
        this.toJSON = function () {
            return {x: this.x, y: this.y};
        };
    }

    /**
     * Create a point from a JSON point.
     * @param {object} jsonPoint The parsed JSON object to create a point for.
     * @returns {Point} Point created from the JSON object.
     */
    function fromJSON(jsonPoint) {
        return new Point(jsonPoint.x, jsonPoint.y);
    }

    return {
        Point: Point,
        fromJSON: fromJSON
    };
});
