/**
 * Created by Ryan Lamb on 11/19/15.
 * MapObjects are used to represent all objects within a map.
 */

define(['MapData/observable', 'MapData/transform'], function(observable, transform) {

    /**
     * Construct a MapObject.
     * @param {object} [opt_json] Optional object containing a JSON serialized
     * form.
     */
    function MapObject(opt_json) {
        this._objectTransform = (opt_json === undefined) ? new transform.Transform() :
            transform.fromJSON(opt_json.transform);

        observable.MakeObservable(this);

        this.createObservableChildProperty("transform", this._objectTransform, "transform");
    }

    /**
     * Creat a JSON representation of the map object.
     */
    MapObject.prototype.toJSON = function() {
        return {
            transform: this.transform.toJSON(),
            objectType: "MapObject"
        };
    };

    /**
     * Construct a transform from a JSON representation.
     * @param {object} jsonMapObject A JSON object version of the MapObject.
     */
    function fromJSON(jsonMapObject) {
        return new MapObject(jsonMapObject);
    }

    return {
        MapObject: MapObject,
        fromJSON: fromJSON
    };
});