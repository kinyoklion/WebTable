/**
 * Created by Ryan Lamb on 11/15/15.
 * Layer represents a layer within the map. Layers are the container for
 * managing objects.
 */
 
 define(['MapData/observable', 'MapData/mapobject'], function (observable, mapobject) {
     
     /**
      * Construct a layer object. Layer objects are responsible for managing
      * objects.
      * @param {object} [opt_json] Construct a layer from an optional JSON
      * object.
      */
     function Layer(opt_json) {
        var visible = (opt_json === undefined) ? true : opt_json.visible;
        var editorVisible = (opt_json === undefined) ? true : opt_json.editorVisible;
        var viewerVisible = (opt_json === undefined) ? true : opt_json.viewerVisible;
        var opacity = (opt_json === undefined) ? 1 : opt_json.opacity;
        var name = (opt_json == undefined) ? 1 : opt_json.name;
        
        var objects = [];
        
        if(opt_json !== undefined) {
        for(var objectIndex = 0; objectIndex < opt_json.objects.length; objectIndex++) {
            objects.push(new mapobject.fromJSON(opt_json.objects[objectIndex]));
            }
        }
        
        observable.MakeObservable(this);
        
        this.createObservedProperty("visible", visible);
        this.createObservedProperty("editorVisible", editorVisible);
        this.createObservedProperty("viewerVisible", viewerVisible);
        this.createObservedProperty("opacity", opacity);
        this.createObservedProperty("name", name);
        
        /**
         * Add an object to the layer.
         * @param {MapObject} objectToAdd The object to add to the layer.
         */
        this.addObject = function(objectToAdd) {
            objects.push(objectToAdd);
            this.addChildObservable("objects["+ String(objects.length - 1) +"]", objectToAdd);
            this.notify("objects", objectToAdd, observable.ChangeType.ADDED);
        };
        
        /**
         * Remove the object at the specified index.
         * @param {number} objectIndex The index of the object to remove.
         */
        this.removeObjectByIndex = function(objectIndex) {
            if(objectIndex > objects.length || objectIndex < 0) {
                throw new Error("Invalid object index: " + objectIndex);
            }
            var object = objects[objectIndex];
            this.removeChildObservable(object);
            objects.splice(objectIndex, 1);
        };
        
        /**
         * Get the object at the specified index.
         * @param {number} objectIndex The index of the object to remove.
         * @returns {MapObject} The object at the index.
         */
        this.getObjectByIndex = function(objectIndex) {
            if(objectIndex > objects.length || objectIndex < 0) {
                throw new Error("Invalid object index: " + objectIndex);
            }
            return objects[objectIndex];
        };
        
        /**
         * Get the number of objects in the layer.
         * @returns {number} The number of objects in the layer.
         */
        this.getObjectCount = function() {
            return objects.length;
        };
        
        /**
         * Create a version of this object suitable for JSON serialization.
         */
        this.toJSON = function () {
            var objectList = [];
            for(var objectIndex = 0; objectIndex < objects.length; objectIndex++) {
                objectList.push(objects[objectIndex].toJSON());
            }
            return {
                visible: this.visible,
                editorVisible: this.editorVisible,
                viewerVisible: this.viewerVisible,
                opacity: this.opacity,
                name: this.name,
                objects: objectList
            };
        };
    }
    
    /**
     * Create a layer object from a JSON object.
     */
    function fromJSON(jsonLayer) {
        return new Layer(jsonLayer);
    }
    
    return {
        Layer: Layer,
        fromJSON: fromJSON
    };
     
 });