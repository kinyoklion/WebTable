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
        this._nextId = (opt_json === undefined) ? 0 : opt_json.nextId;
        this._resourceList = {};
        var resources = this;

        if (opt_json !== undefined) {
            opt_json.resourceList.forEach(function(item) {
                resources._resourceList[item.id] = resource.fromJSON(item);
            });
        }

        //There will be observations for addition and removal of resources.
        observable.MakeObservable(this);
    }

    /**
     * Get a resource id to use for a new resource.
     * @returns {string} The resource id to use for the new resource.
     */
    Resources.prototype._getResourceId = function() {
        var idToAssign = this._nextId;
        this._nextId++;
        return String(idToAssign);
    };

    /**
     * Add a resource for usage in the map. If the resource exists, then the id for the existing resource will be
     * returned.
     * @param {object} value The value of the resource.
     * @param {boolean} isReference Flag indicating if the resource is a reference.
     * @returns {string} The resource id for the added resource.
     */
    Resources.prototype.addResource = function(value, isReference) {
        var valueId = undefined;

        var resources = this;
        
        Object.keys(this._resourceList).forEach(function(key) {
            if (resources._resourceList[key].value === value && resources._resourceList[key].isReference === isReference) {
                valueId = key;
            }
        });

        if (valueId === undefined) {
            valueId = this._getResourceId();
            var newResource = new resource.Resource(valueId, value, isReference);
            this._resourceList[valueId] = newResource;
            this.notify("resourceList", newResource, observable.ChangeType.ADDED);
        }

        //Make sure the key is always a string.
        return valueId;
    };

    /**
     * Get the resource for the specified id.
     * @param {String} id The id of the resource to access.
     * @returns {Resource} The resource associated with the specified id.
     */
    Resources.prototype.getResource = function(id) {
        if (id in this._resourceList) {
            return this._resourceList[id];
        }
        return undefined;
    };

    /**
     * Perform a sweep and remove resources that are no longer in use.
     */
    Resources.prototype.removeUnusedResources = function() {
        var idsToRemove = [];
        var resources = this;

        Object.keys(this._resourceList).forEach(function(key) {
            if (!resources._resourceList[key].hasReferences()) {
                idsToRemove.push(key);
            }
        });

        var notify = this.notify;

        Object.keys(idsToRemove).forEach(function(key) {
            notify("resourceList", key, observable.ChangeType.REMOVED);
            delete resources._resourceList[idsToRemove[key]];
        });
    };

    /**
     * Create a simplified JSON compatible version of this object.
     */
    Resources.prototype.toJSON = function() {
        var resourcesList = [];
        var resources = this;
        Object.keys(resources._resourceList).forEach(function(key) {
            resourcesList.push(resources._resourceList[key]);
        });
        return {
            nextId: this._nextId,
            resourceList: resourcesList
        };
    };

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
    };
});
