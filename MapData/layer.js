/**
 * Created by Ryan Lamb on 11/15/15.
 * Layer represents a layer within the map. Layers are the container for
 * managing objects.
 */

define(['MapData/observable', 'MapData/mapobject'], function(observable, mapobject) {

    /**
     * Construct a layer object. Layer objects are responsible for managing
     * objects.
     * @param {object} [opt_json] Construct a layer from an optional JSON
     * object.
     */
    function Layer(opt_json) {
        this._visible = (opt_json === undefined) ? true : opt_json.visible;
        this._editorVisible = (opt_json === undefined) ? true : opt_json.editorVisible;
        this._viewerVisible = (opt_json === undefined) ? true : opt_json.viewerVisible;
        this._opacity = (opt_json === undefined) ? 1 : opt_json.opacity;
        this._name = (opt_json == undefined) ? 1 : opt_json.name;

        this._objects = [];

        if (opt_json !== undefined) {
            for (var objectIndex = 0; objectIndex < opt_json.objects.length; objectIndex++) {
                this._objects.push(new mapobject.fromJSON(opt_json.objects[objectIndex]));
            }
        }

        observable.MakeObservable(this);

        this.createObservedProperty("visible", this._visible);
        this.createObservedProperty("editorVisible", this._editorVisible);
        this.createObservedProperty("viewerVisible", this._viewerVisible);
        this.createObservedProperty("opacity", this._opacity);
        this.createObservedProperty("name", this._name);
    }

    /**
     * Add an object to the layer.
     * @param {MapObject} objectToAdd The object to add to the layer.
     */
    Layer.prototype.addObject = function(objectToAdd) {
        this._objects.push(objectToAdd);
        this.addChildObservable("objects[" + String(this._objects.length - 1) + "]", objectToAdd);
        this.notify("objects", objectToAdd, observable.ChangeType.ADDED);
    };

    /**
     * Remove the object at the specified index.
     * @param {number} objectIndex The index of the object to remove.
     */
    Layer.prototype.removeObjectByIndex = function(objectIndex) {
        if (objectIndex > this._objects.length || objectIndex < 0) {
            throw new Error("Invalid object index: " + objectIndex);
        }
        var object = this._objects[objectIndex];
        this.removeChildObservable(object);
        this._objects.splice(objectIndex, 1);
    };

    /**
     * Get the object at the specified index.
     * @param {number} objectIndex The index of the object to remove.
     * @returns {MapObject} The object at the index.
     */
    Layer.prototype.getObjectByIndex = function(objectIndex) {
        if (objectIndex > this._objects.length || objectIndex < 0) {
            throw new Error("Invalid object index: " + objectIndex);
        }
        return this._objects[objectIndex];
    };

    /**
     * Get the number of objects in the layer.
     * @returns {number} The number of objects in the layer.
     */
    Layer.prototype.getObjectCount = function() {
        return this._objects.length;
    };

    /**
     * Create a version of this object suitable for JSON serialization.
     */
    Layer.prototype.toJSON = function() {
        var objectList = [];
        for (var objectIndex = 0; objectIndex < this._objects.length; objectIndex++) {
            objectList.push(this._objects[objectIndex].toJSON());
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