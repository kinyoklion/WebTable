/**
 * Created by Ryan Lamb on 9/24/16.
 */
/**
 * Created by Ryan Lamb on 9/16/16.
 * Class for managing scenes.
 */

define(['three'], function(THREE) {
    function Scene() {
        this._threejsScene = new THREE.Scene();
    }

    /**
     * Add an object to the scene.
     * @param object Object to add to the scene.
     */
    Scene.prototype.add = function(object) {
        this._threejsScene.add(object._threejsObject)
    };

    /**
     * Clear all objects in the scene.
     */
    Scene.prototype.clear = function() {
        for( var objectIndex = this._threejsScene.children.length - 1; objectIndex >= 0; objectIndex--) {
            var object = this._threejsScene.children[objectIndex];
            this._threejsScene.remove(object);
        }
    };

    return {
        Scene: Scene
    };
});