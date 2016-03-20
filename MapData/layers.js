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
        var layers = [];
        if(opt_json !== undefined) {
            for(var layerIndex = 0; layerIndex < opt_json.layers.length; layerIndex++) {
                layers.push(new layer.fromJSON(opt_json.layers[layerIndex]));
            }
        }
        
        observable.MakeObservable(this);
        
        /**
         * Add a new layer to the list of layers.
         * @param {Layer} Layer to add to the list.
         */
        this.addLayer = function(newLayer) {
           layers.push(newLayer);
           //TODO: RRL: Need a generic way to do this. This is not a good
           //approach for indexes.
           this.addChildObservable("layers."+ String(layers.length - 1), newLayer);
           this.notify("layers", newLayer, observable.ChangeType.ADDED);
        };
        
        /**
         * Remove the layer with the specified name.
         * @param {string} layerName The name of the layer to remove.
         */
        this.removeLayerByName = function(layerName) {
            for(var layerIndex = 0; layerIndex < layers.length; layerIndex++) {
                if(layers[layerIndex].name == layerName) {
                    var layer = layers[layerIndex];
                    this.removeChildObservable(layer);
                    layers.splice(layerIndex, 1);
                    this.notify("layers", layerIndex, observable.ChangeType.REMOVED);
                    return;
                }
            }
        };
        
        /**
         * Get the number of layers present.
         * @returns {number} The number of layers present.
         */
        this.getLayerCount = function() {
            return layers.length;
        };
        
        /**
         * Get a layer by name.
         * @param {string} layerName The name of the layer to get.
         * @returns {Layer} The requested layer.
         */
        this.getLayerByName = function(layerName) {
            for(var layerIndex = 0; layerIndex < layers.length; layerIndex++) {
                if(layers[layerIndex].name == layerName) {
                    return layers[layerIndex];
                }
            }
        };
        
        /**
         * Get a layer by its index.
         * @param {number} layerIndex The index of the layer to get.
         * @returns {Layer} The requested layer.
         */
        this.getLayerByIndex = function(layerIndex) {
            return layers[layerIndex];
        };
        
        /**
         * Create a simplified version of this object suitable for JSON
         * serialization.
         * @returns {object} Object suitable for serialization.
         */
        this.toJSON = function() {
            var layerList = [];
            for(var layerIndex = 0; layerIndex < layers.length; layerIndex++) {
                layerList.push(layers[layerIndex].toJSON());
            }
            
            return {
                layers: layers
            };
        };
    } 
    
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