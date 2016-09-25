/**
 * Created by Ryan Lamb on 9/16/16.
 * MapRenderer is responsible for rendering maps.
 *
 */

define(['three'], function(THREE) {
    function MapRenderer() {
        this.renderer = new THREE.WebGLRenderer();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
    }

    MapRenderer.prototype.render = function(scene, camera) {
        this.renderer.render(scene._threejsScene, camera._threejsCamera);
    };

    return {
      MapRenderer: MapRenderer
    };
});