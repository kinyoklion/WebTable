/**
 * Created by Ryan Lamb on 03/27/16.
 * Object which can deserialize any of the different MapObject subclasses.
 */

define(['MapData/mapobject', 'MapData/sprite'], function(mapobject, sprite) {

    var deserializeMethods = {
        "MapObject": mapobject.fromJSON,
        "Sprite": sprite.fromJSON
    };

    /**
     * Create a map object from a JSON object.
     */
    function fromJSON(jsonObject) {
        return deserializeMethods[jsonObject.objectType](jsonObject);
    }

    return {
        fromJSON: fromJSON
    };

});