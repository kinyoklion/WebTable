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

        this.createObservedProperty("gridSize", gridSize);
        this.createObservedProperty("gridType", gridType);
        this.createObservableChildProperty("gridOffset", gridOffset, "gridOffset");

        /**
         * Create a simplified form for JSON serialization.
         * @returns {{gridSize: number, gridType: number, gridOffset: {x, y}}}
         */
        this.toJSON = function () {
            return {gridSize: this.gridSize, gridType: this.gridType, gridOffset: this.gridOffset.toJSON()};
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
