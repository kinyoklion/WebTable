/**
 * Created by Ryan Lamb on 9/16/16.
 * MapEngine is the main entry point for the map rendering loop and logic.
 */

require.config({
    paths: {
        "three": "lib/ThreeJS/three"
    },
    shim: {three: {
        exports: 'THREE'
    }}
});

define(['MapClient/MapEngine/maprenderer',
    'MapClient/MapEngine/camera',
    'MapClient/MapEngine/texturedplane',
    'MapClient/MapEngine/scene'], function(renderer, camera, texturedplane, scene){
    function MapEngine() {
        this.scene = new scene.Scene();
        this.camera = new camera.Camera(camera.CameraType.Orthographic);
        //Start the camera back some from 0.
        this.camera.position.z = 50;
        this.renderer = new renderer.MapRenderer(this.camera);
        this.testPlane = new texturedplane.TexturedPlane("TestTexture.png", 0.1);
    }

    MapEngine.prototype.start = function()
    {
        var renderer = this.renderer;
        var scene = this.scene;
        var camera = this.camera;

        this.testPlane.load(function(texturedPlane) {
            scene.add(texturedPlane);
        });

        //This is the main loop.
        var renderCallback = function() {
            renderer.render(scene, camera);

            requestAnimationFrame(renderCallback);
        };

        var camera = this.camera;
        document.onkeydown = function(key) {
            if(key.key == "ArrowRight") {
                camera.position.x = camera.position.x - 1;
            }
            else if(key.key == "ArrowLeft") {
                camera.position.x = camera.position.x + 1;
            }
            else if(key.key == "ArrowDown") {
                camera.position.y = camera.position.y - 1;
            }
            else if(key.key == "ArrowUp") {
                camera.position.y = camera.position.y + 1;
            }

        };

        requestAnimationFrame(renderCallback);
    };

    return {
        MapEngine: MapEngine
    };
});