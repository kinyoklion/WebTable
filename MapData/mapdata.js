/**
 * Created by Ryan Lamb on 11/14/15.
 * The purpose of this object is to store and manage map data.
 */

define(['MapData/mapsettings', 'MapData/observable', 'MapData/layers', 'MapData/resources'], function (mapsettings, observable, layersModule, resourcesModule) {

    /**
     * Object which contains all data for a map.
     * @param {object} [opt_json] Optional JSON object to construct from.
     * @constructor
     */
    function MapData(opt_json) {
        var settings = (opt_json === undefined) ? new mapsettings.MapSettings() : mapsettings.fromJSON(opt_json.settings);
        var layers = (opt_json === undefined) ? new layersModule.Layers() : layersModule.fromJSON(opt_json.layers);
        var resources = (opt_json === undefined) ? new resourcesModule.Resources() : resourcesModule.fromJSON(opt_json.resources);

        observable.MakeObservable(this);
        this.createObservableChildProperty("settings", settings, "settings", false);
        this.createObservableChildProperty("layers", layers, "layers", false);
        this.createObservableChildProperty("resources", resources, "resources", false);

        /**
         * Create a simplified form of this object for JSON serialization.
         * @returns {object} Object suitable for JSON serialization.
         */
        this.toJSON = function () {
            return {
                settings: settings.toJSON(),
                layers: layers.toJSON(),
                resources: resources.toJSON()
            };
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