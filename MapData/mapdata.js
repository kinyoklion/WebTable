/**
 * Created by Ryan Lamb on 11/14/15.
 * The purpose of this object is to store and manage map data.
 */

define(["./mapsettings", "./observable"], function (mapsettings, observable) {

    /**
     * Object which contains all data for a map.
     * @param {object} [opt_json] Optional JSON object to construct from.
     * @constructor
     */
    function MapData(opt_json) {
        var settings = (opt_json === undefined) ? new mapsettings.MapSettings() : mapsettings.fromJSON(opt_json.settings);

        observable.MakeObservable(this);
        this.createObservableChildProperty("settings", settings, "settings", false);

        /**
         * Create a simplified form of this object for JSON serialization.
         * @returns {{settings: ({gridSize, gridType, gridOffset}|{gridSize: number, gridType: number, gridOffset: {x, y}})}}
         */
        this.toJSON = function () {
            return {settings: settings.toJSON()};
        };
    }

    /**
     * Construct a MapSettings from the serialized form.
     * @param jsonObject
     */
    function fromJSON(jsonObject) {
        return new MapData(jsonObject);
    }

    return {
        MapData: MapData,
        GridType: mapsettings.GridType,
        fromJSON: fromJSON
    }
});