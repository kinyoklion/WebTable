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
        var objectTransform = (opt_json === undefined) ? new transform.Transform() :
            transform.fromJSON(opt_json.transform);
        
        observable.MakeObservable(this);

        this.createObservableChildProperty("transform", objectTransform, "transform");
        
        this.toJSON = function() {
            return {
                transform: this.transform.toJSON()
            };
        };
    }
    
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