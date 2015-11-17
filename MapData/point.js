/**
 * Created by Ryan Lamb on 11/14/15.
 * Defines an object that represents a point.
 */

define(["./observable.js"], function (observable) {

    /**
     * Object which represents an X, Y coordinate pair.
     * @param {number} [opt_x] The optional x coordinate value.
     * @param {number} [opt_y] The optional y coordinate value.
     * @constructor
     */
    function Point(opt_x, opt_y) {
        var x = (opt_x === undefined) ? 0 : opt_x;
        var y = (opt_y === undefined) ? 0 : opt_y;

        var setting = this;

        observable.MakeObservable(this);

        /**
         * Property for the x coordinate.
         */
        Object.defineProperty(this, "x", {
            get: function () {
                return setting.getX()
            },
            set: function (y) {
                setting.setX(y)
            }
        });

        /**
         * Property for the Y coordinate.
         */
        Object.defineProperty(this, "y", {
            get: function () {
                return setting.getY()
            },
            set: function (y) {
                setting.setY(y)
            }
        });

        /**
         * Set the value of the X coordinate.
         * @param {number} value The new value for the X coordinate.
         */
        this.setX = function (value) {
            x = value;
            this.notify("x", value);
        };

        /**
         * Get the value of the X coordinate.
         * @returns {number} The value of the X coordinate.
         */
        this.getX = function () {
            return x;
        };

        /**
         * Set the value of the Y coordinate.
         * @param {number} value The new value for the Y coordinate.
         */
        this.setY = function (value) {
            y = value;
            this.notify("y", value);
        };

        /**
         * Get the value of the Y coordinate.
         * @returns {number} The value of the Y coordinate.
         */
        this.getY = function () {
            return y;
        };

        /**
         * Create a JSON version of this object which does not include extra information.
         */
        this.toJSON = function () {
            return {x: x, y: y};
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
    }
});
