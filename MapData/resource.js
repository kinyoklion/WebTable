/**
 * Created by Ryan Lamb on 11/15/15.
 * Resource represents a single unique resource.
 */

define(function () {

    /**
     * Construct a resource instance. Once constructed a resource cannot be modified.
     * @param {number} id The identifier for the resource.
     * @param {object} value The value of the resource.
     * @param {boolean} isReference Boolean indicating if the resource is a reference. If it is not a reference, then
     * the resource is directly embedded within this object.
     * @constructor
     */
    function Resource(id, value, isReference) {
        //Note that the resource type does not need to be observable because it cannot change.
        var referenceCount = 0;

        /**
         * Read only property for the resource id.
         */
        Object.defineProperty(this, "id", {
            get: function () {
                return id;
            },
            set: function () {
                throw new Error("id cannot be changed");
            }
        });

        /**
         * Read only property for the resource value.
         */
        Object.defineProperty(this, "value", {
            get: function () {
                return value;
            },
            set: function() {
                throw new Error("value cannot be changed")
            }
        });

        /**
         * Read only property which indicates if the value is a reference.
         */
        Object.defineProperty(this, "isReference", {
            get: function () {
               return isReference;
            },
            set: function () {
              throw new Error("isReference cannot be changed");
            }
        });

        /**
         * Add a reference to this resource.
         */
        this.addReference = function() {
            referenceCount++;
        };

        /**
         * Remove a reference from this resource.
         */
        this.removeReference = function() {
            if(referenceCount === 0) {
                throw new Error("Reference count imbalance. Removing reference from object with no references.");
            }
            referenceCount--;
        };

        /**
         * Check if this resource has any references.
         * @returns {boolean} Flag indicating if this object has any references.
         */
        this.hasReferences = function() {
            return referenceCount > 0;
        };

        /**
         * Construct a simplified form for JSON serialization.
         * @returns {{id: number, value: Object, isReference: boolean}}
         */
        this.toJSON = function() {
            return {id: id, value: value, isReference: isReference};
        };
    }

    /**
     * Create a resource from a json serialized resource.
     * @param {object} jsonResource The JSON resource to create the resource from.
     * @returns {Resource} Resource constructed from the JSON object.
     */
    function fromJSON(jsonResource) {
        return new Resource(jsonResource.id, jsonResource.value, jsonResource.isReference);
    }

    return {
        Resource: Resource,
        fromJSON: fromJSON
    }
});