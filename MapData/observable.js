/**
 * Created by Ryan Lamb on 11/14/15.
 * Contains a helper that can make a class observable.
 */
define(function () {

    /**
     * Enumeration that indicates the kind of change that has happened.
     * In the case of ADDED the value will be the newly added value.
     * In the case of REMOVED the value will be the index or key removed.
     * @type {{UPDATED: number, ADDED: number, REMOVED: number}}
     */
    var ChangeType = {
        UPDATED: 0,
        ADDED: 1,
        REMOVED: 2
    };

    /**
     * Add functionality to an object that allows its properties to be easily observed.
     * @param {object} object This is an object to be extended for observation.
     * @constructor
     */
    function MakeObservable(object) {
        var observers = [];
        object.rootName = "";

        /**
         * This method adds an observation callback.
         * @param {function} callback Callback which accepts a sender, path, and value.
         */
        object.observe = function (callback) {
            observers.push(callback);
        };

        /**
         * Remove an observation callback.
         * @param {function} callback Callback function to be removed.
         */
        object.unObserve = function (callback) {
            var index = observers.indexOf(callback);

            if (index !== -1) {
                observers.splice(index, 1);
            }
        };

        /**
         * Notify observers of a change in value.
         * @param {string} path The path to the value which has changed.
         * @param {object} value The new value.
         * @param {number} [opt_change] The type of change made.
         */
        object.notify = function (path, value, opt_change) {
            opt_change = (opt_change === undefined) ? ChangeType.UPDATED : opt_change;

            observers.forEach(function (callback) {
                callback(this, path, value, opt_change);
            });
        };

        /**
         * Propagate observation from child properties.
         * @param {string} rootName The root name to use for this child.
         * @param {object} child The child object to propagate status for.
         */
        object.addChildObservable = function (rootName, child) {
            child.observe(childObserverCallback);
            child.setRootName(rootName);
        };

        /**
         * Stop observing changes to a child.
         * @param child The child to stop observing.
         */
        object.removeChildObservable = function (child) {
            child.unObserve(childObserverCallback);
        };

        /**
         * Set the root name for this observable object.
         * @param {string} value The root name for this object.
         */
        object.setRootName = function (value) {
            rootName = value;
        };

        /**
         * Function called when a value in a child changes.
         * @param {object} sender The object originating the event.
         * @param {string} path The path to the changed value.
         * @param {object} value The new value of the object.
         * @param {number} [opt_change] The type of change made.
         */
        var childObserverCallback = function (sender, path, value, opt_change) {
            object.notify(sender.rootName + "." + path, value, opt_change);
        };
    }

    return {
        MakeObservable: MakeObservable,
        ChangeType: ChangeType
    }
});