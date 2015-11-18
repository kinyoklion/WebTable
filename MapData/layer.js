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
         
         /**
          * Flag indicating if this layer is visible. This is the global
          * visibility. Setting it to false means it will not be viewable by
          * editors or viewers. If it is true, then the more specific visibility
          * of the object may be toggled.
          */
         Object.defineProperty(this, "visible", {
            get: function () {
                return visible;
            },
            set: function (v) {
                visible = v;
                this.notify("visible", visible);
            }
        });
        
        /**
         * Flag that indicates if this layer should be visible in the editor.
         * If a layer is not "visible" then this setting will be ignored.
         */
         Object.defineProperty(this, "editorVisible", {
            get: function () {
                return editorVisible;
            },
            set: function (v) {
                editorVisible = v;
                this.notify("editorVisible", editorVisible);
            }
        });
        
        /**
         * Flag indicating if this layer should be viewable by a viewing client.
         * If a layer is not "visible" then this setting will be ignored.
         */
         Object.defineProperty(this, "viewerVisible", {
            get: function () {
                return viewerVisible;
            },
            set: function (v) {
                viewerVisible = v;
                this.notify("viewerVisible", viewerVisible);
            }
        });

         /**
          * A float from 0 to 1 indicating the opacity of the layer.
          */
         Object.defineProperty(this, "opacity", {
             get: function () {
                 return opacity;
             },
             set: function (v) {
                 opacity = v;
                 this.notify("opacity", opacity);
             }
         });
         
          /**
          * The name of the layer.
          */
         Object.defineProperty(this, "name", {
             get: function () {
                 return name;
             },
             set: function (v) {
                 name = v;
                 this.notify("name", name);
             }
         });
        
        /**
         * Create a version of this object suitable for JSON serialization.
         */
        this.toJSON = function () {
            return {
                visible: visible,
                editorVisible: editorVisible,
                viewerVisible: viewerVisible,
                opacity: opacity,
                name: name
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