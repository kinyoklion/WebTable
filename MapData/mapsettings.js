/**
 * Created by Ryan Lamb on 11/14/15.
 * This object is responsible for storing and managing top level map settings.
 */

define(["./observable.js", "./point.js"], function (observable, point) {

    /**
     * Enumeration for the different grid types.
     * @type {{NONE: number, SQUARE: number, HEX: number}}
     */
    var GridType = {
        NONE: 0,
        SQUARE: 1,
        HEX: 2
    };

    /**
     * Object that represents the high level settings for a map.
     * @param {object} [opt_json] Optional parameter containing a serialized form of the settings.
     * @constructor
     */
    function MapSettings(opt_json) {

        var gridSize = (opt_json === undefined) ? 10 : opt_json.gridSize;
        var gridOffset = (opt_json === undefined) ? new point.Point() : point.fromJSON(opt_json.gridOffset);
        var gridType = (opt_json === undefined) ? GridType.SQUARE : opt_json.gridType;

        var setting = this;
        observable.MakeObservable(this);
        this.addChildObservable("gridOffset", gridOffset);

        /**
         * The grid size property.
         */
        Object.defineProperty(this, "gridSize", {
            get: function () {
                return setting.getGridSize()
            },
            set: function (y) {
                setting.setGridSize(y)
            }
        });

        /**
         * The grid offset property. This will adjust the location of the grid relative to the map content.
         */
        Object.defineProperty(this, "gridOffset", {
            get: function () {
                return setting.getGridOffset()
            },
            set: function (y) {
                setting.setGridOffset(y)
            }
        });

        /**
         * The grid type property.
         */
        Object.defineProperty(this, "gridType", {
            get: function () {
                return setting.getGridType()
            },
            set: function (y) {
                setting.setGridType(y)
            }
        });

        /**
         * Set the grid size.
         * @param {number} value The new grid size.
         */
        this.setGridSize = function (value) {
            gridSize = value;
            this.notify("gridSize", value);
        };

        /**
         * Get the current grid size.
         * @returns {number} The current grid size.
         */
        this.getGridSize = function () {
            return gridSize;
        };

        /**
         * Set the grid type.
         * @param {number} value Set the grid type. Should use a constant as defined in GridType.
         */
        this.setGridType = function (value) {
            gridType = value;
            this.notify("gridType", value);
        };

        /**
         * Get the current grid type.
         * @returns {number} The current grid type.
         */
        this.getGridType = function () {
            return gridType;
        };

        /**
         * Set the grid offset.
         * @param {Point} value The new grid offset value.
         */
        this.setGridOffset = function (value) {
            this.removeChildObservable(gridOffset);
            gridOffset = value;
            this.addChildObservable("gridOffset", gridOffset);
            this.notify("gridOffset", value);
        };

        /**
         * Get the current grid offset.
         * @returns {Point} The current grid offset.
         */
        this.getGridOffset = function () {
            return gridOffset;
        };

        /**
         * Create a simplified form for JSON serialization.
         * @returns {{gridSize: number, gridType: number, gridOffset: {x, y}}}
         */
        this.toJSON = function () {
            return {gridSize: gridSize, gridType: gridType, gridOffset: gridOffset.toJSON()};
        };
    }

    /**
     * Function which creates map settings from their serialized form.
     * @param {object} jsonSettings Serialized mapsettings.
     * @returns {MapSettings} Instance constructed from the serialized settings.
     */
    function fromJSON(jsonSettings) {
        return new MapSettings(jsonSettings);
    }

    return {
        MapSettings: MapSettings,
        GridType: GridType,
        fromJSON: fromJSON
    }
});
