/**
 * Created by Ryan Lamb on 3/27/16.
 * Defines an object that represents a sprite.
 */

define(['MapData/observable', 'MapData/mapobject'], function(observable, mapobject) {

    /**
     * Object which represents a sprite.
     * @param {object} [opt_json] Optional object containing a JSON serialized
     * sprite.
     * @constructor
     */
    function Sprite(opt_json) {
        mapobject.MapObject.call(this, opt_json);
        this.resourceId = undefined;
        
        if(opt_json !== undefined) {
            this._resourceId = opt_json.resourceId;
        }
        
        this.createObservedProperty("resourceId", this._resourceId);
    }
    
    Sprite.prototype = Object.create(mapobject.MapObject.prototype);

    /**
     * Create a JSON version of this object which does not include extra information.
     */
    Sprite.prototype.toJSON = function() {
        var json = mapobject.MapObject.prototype.toJSON.call(this);
        json.resourceId = this.resourceId;
        json.objectType = "Sprite";
        return json;
    };
    
    /**
     * Create a sprite from a JSON sprite.
     * @param {object} jsonSprite The parsed JSON object to create a Sprite for.
     * @returns {Sprite} Sprite created from the JSON object.
     */
    function fromJSON(jsonSprite) {
        return new Sprite(jsonSprite);
    }

    return {
        Sprite: Sprite,
        fromJSON: fromJSON
    };
});
