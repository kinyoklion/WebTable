/**
 * Created by Ryan Lamb on 11/18/15.
 * The Layers class is responsible for maintining an ordered list of Layer objects.
 */

define(["MapData/layer", "MapData/observable"], function(layer, observable) {

    /**
     * Construct a Layers object.
     * @param {object} [opt_json] Optional argument for construction from a
     * JSON object
     */
    function Layers(opt_json) {
        //Ordered list of the layers.
        this._layers = [];
        observable.MakeObservable(this);

        if (opt_json !== undefined) {
            for (var layerIndex = 0; layerIndex < opt_json.layers.length; layerIndex++) {
                var layerToAdd = new layer.fromJSON(opt_json.layers[layerIndex]);
                this._layers.push(layerToAdd);
                this.addChildObservable("layers." + String(layerIndex), layerToAdd);
            }
        }
    }

    /**
     * Add a new layer to the list of layers.
     * @param {Layer} Layer to add to the list.
     */
    Layers.prototype.addLayer = function(newLayer) {
        this._layers.push(newLayer);
        //TODO: RRL: Need a generic way to do this. This is not a good
        //approach for indexes.
        this.addChildObservable("layers." + String(this._layers.length - 1), newLayer);
        this.notify("layers", newLayer, observable.ChangeType.ADDED);
    };

    /**
     * Remove the layer with the specified name.
     * @param {string} layerName The name of the layer to remove.
     */
    Layers.prototype.removeLayerByName = function(layerName) {
        for (var layerIndex = 0; layerIndex < this._layers.length; layerIndex++) {
            if (this._layers[layerIndex].name == layerName) {
                var layer = this._layers[layerIndex];
                this.removeChildObservable(layer);
                this._layers.splice(layerIndex, 1);
                this.notify("layers", layerIndex, observable.ChangeType.REMOVED);
                return;
            }
        }
    };

    /**
     * Get the number of layers present.
     * @returns {number} The number of layers present.
     */
    Layers.prototype.getLayerCount = function() {
        return this._layers.length;
    };

    /**
     * Get a layer by name.
     * @param {string} layerName The name of the layer to get.
     * @returns {Layer} The requested layer.
     */
    Layers.prototype.getLayerByName = function(layerName) {
        for (var layerIndex = 0; layerIndex < this._layers.length; layerIndex++) {
            if (this._layers[layerIndex].name == layerName) {
                return this._layers[layerIndex];
            }
        }
    };

    /**
     * Get a layer by its index.
     * @param {number} layerIndex The index of the layer to get.
     * @returns {Layer} The requested layer.
     */
    Layers.prototype.getLayerByIndex = function(layerIndex) {
        return this._layers[layerIndex];
    };

    Layers.prototype.getLayerCount = function() {
        return this._layers.length;
    };

    /**
     * Create a simplified version of this object suitable for JSON
     * serialization.
     * @returns {object} Object suitable for serialization.
     */
    Layers.prototype.toJSON = function() {
        var layerList = [];
        for (var layerIndex = 0; layerIndex < this._layers.length; layerIndex++) {
            layerList.push(this._layers[layerIndex].toJSON());
        }

        return {
            layers: this._layers
        };
    };

    /**
     * Construct layers from a JSON object.
     * @param {object} jsonLayers The JSON object to construct the layers from.
     */
    function fromJSON(jsonLayers) {
        return new Layers(jsonLayers);
    }

    return {
        Layers: Layers,
        fromJSON: fromJSON
    };
});