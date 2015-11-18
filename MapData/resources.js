/**
 * Created by Ryan Lamb on 11/15/15.
 * Resources manages all of the resource items in the map. It is also responsible for generating the IDs associated
 * with each resource.
 */

define(["MapData/resource", "MapData/observable"], function(resource, observable) {

    /**
     * The Resources object is responsible for managing the resources of a map.
     * @param {object} [opt_json] Optional arguments for construction from a JSON object.
     * @constructor
     */
    function Resources(opt_json) {
        var nextId = (opt_json === undefined) ? 0 : opt_json.nextId;
        var resourceList = {};

        if(opt_json !== undefined) {
            Object.keys(opt_json.resourceList).forEach(function(key) {
                resourceList[key] = resource.fromJSON(opt_json.resourceList[key])
            });
        }

        //There will be observations for addition and removal of resources.
        observable.MakeObservable(this);

        /**
         * Get a resource id to use for a new resource.
         * @returns {string} The resource id to use for the new resource.
         */
        function getResourceId() {
            var idToAssign = nextId;
            nextId++;
            return String(idToAssign);
        }

        /**
         * Add a resource for usage in the map. If the resource exists, then the id for the existing resource will be
         * returned.
         * @param {object} value The value of the resource.
         * @param {boolean} isReference Flag indicating if the resource is a reference.
         * @returns {string} The resource id for the added resource.
         */
        this.addResource = function(value, isReference) {
            var valueId = undefined;

            Object.keys(resourceList).forEach(function(key) {
                if(resourceList[key].value === value && resourceList[key].isReference === isReference) {
                    valueId = key;
                }
            });

            if(valueId === undefined) {
                valueId = getResourceId();
                var newResource = new resource.Resource(valueId, value, isReference);
                resourceList[valueId] = newResource;
            }

            //Make sure the key is always a string.
            return valueId;
        };

        /**
         * Get the resource for the specified id.
         * @param {String} id The id of the resource to access.
         * @returns {Resource} The resource associated with the specified id.
         */
        this.getResource = function(id) {
            if(id in resourceList) {
                return resourceList[id];
            }
            return undefined;
        };

        /**
         * Perform a sweep and remove resources that are no longer in use.
         */
        this.removeUnusedResources = function() {
            var idsToRemove = [];

            Object.keys(resourceList).forEach(function(key) {
                if(!resourceList[key].hasReferences()) {
                    idsToRemove.push(key);
                }
            });

            Object.keys(idsToRemove).forEach(function(key) {
               delete resourceList[idsToRemove[key]];
            });
        };

        /**
         * Create a simplified JSON compatible version of this object.
         */
        this.toJSON = function() {
            return {nextId: nextId, resourceList: resourceList};
        };
    }

    /**
     * Create Resources from a JSON object.
     * @param jsonResources The JSON object resources.
     */
    function fromJSON(jsonResources) {
        return new Resources(jsonResources);
    }

    return {
        Resources: Resources,
        fromJSON: fromJSON
    }
});
