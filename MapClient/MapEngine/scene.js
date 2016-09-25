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

    Scene.prototype.add = function(object) {
        this._threejsScene.add(object._threejsObject)
    };

    return {
        Scene: Scene
    };
});