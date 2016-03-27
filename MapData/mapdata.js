/**
 * Created by Ryan Lamb on 11/14/15.
 * The purpose of this object is to store and manage map data.
 */

define(['MapData/mapsettings', 'MapData/observable', 'MapData/layers', 'MapData/resources'], function(mapsettings, observable, layersModule, resourcesModule) {

    /**
     * Object which contains all data for a map.
     * @param {object} [opt_json] Optional JSON object to construct from.
     * @constructor
     */
    function MapData(opt_json) {
        this._settings = (opt_json === undefined) ? new mapsettings.MapSettings() : mapsettings.fromJSON(opt_json.settings);
        this._layers = (opt_json === undefined) ? new layersModule.Layers() : layersModule.fromJSON(opt_json.layers);
        this._resources = (opt_json === undefined) ? new resourcesModule.Resources() : resourcesModule.fromJSON(opt_json.resources);
        this._name = (opt_json === undefined) ? "Untitled" : opt_json.name;

        observable.MakeObservable(this);
        this.createObservableChildProperty("settings", this._settings, "settings", false);
        this.createObservableChildProperty("layers", this._layers, "layers", false);
        this.createObservableChildProperty("resources", this._resources, "resources", false);
        this.createObservedProperty("name", this._name, "name");
    }

    /**
     * Create a simplified form of this object for JSON serialization.
     * @returns {object} Object suitable for JSON serialization.
     */
    MapData.prototype.toJSON = function() {
        return {
            settings: this._settings.toJSON(),
            layers: this._layers.toJSON(),
            resources: this._resources.toJSON(),
            name: this.name
        };
    };

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
    };
});