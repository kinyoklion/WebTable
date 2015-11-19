/**
 * Created by Ryan Lamb on 11/15/15.
 * Layer represents a layer within the map. Layers are the container for
 * managing objects.
 */
 
 define(["MapData/observable"], function (observable) {
     
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
         
         //TODO: RRL: Add object list.
         
         observable.MakeObservable(this);
         
         this.createObservedProperty("visible", visible);
         this.createObservedProperty("editorVisible", editorVisible);
         this.createObservedProperty("viewerVisible", viewerVisible);
         this.createObservedProperty("opacity", opacity);
         this.createObservedProperty("name", name);
        
        /**
         * Create a version of this object suitable for JSON serialization.
         */
        this.toJSON = function () {
            return {
                visible: this.visible,
                editorVisible: this.editorVisible,
                viewerVisible: this.viewerVisible,
                opacity: this.opacity,
                name: this.name
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