/**
 * Created by Ryan Lamb on 9/16/16.
 * MapEngine is the main entry point for the map rendering loop and logic.
 */

require.config({
    waitSeconds: 90,
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
    'MapClient/MapEngine/scene',
    'MapClient/MapEngine/grid'], function(renderer, camera, texturedplane, scene, grid){
    function MapEngine() {
        this.scene = new scene.Scene();
        this.camera = new camera.Camera(camera.CameraType.Orthographic);
        //Start the camera back some from 0.
        this.camera.position.z = 50;
        this.renderer = new renderer.MapRenderer(this.camera);
    }

    MapEngine.prototype.updateFromMap = function(map) {
        var scene = this.scene;
        scene.clear();

        var gridSize = map.settings.gridSize;
        var gridOffset = map.settings.gridOffset;

        var gridScale = 1000;
        var mapGrid = new grid.Grid(gridScale, gridScale / gridSize);
        mapGrid.rotation.x = Math.PI/2;
        mapGrid.position.z = 10;
        mapGrid.position.y = gridOffset.y;
        mapGrid.position.x = gridOffset.x;
        scene.add(mapGrid);

        var layerCount = map.layers.getLayerCount();
        for(var layerIndex = 0; layerIndex < layerCount; layerIndex++) {
            var layer = map.layers.getLayerByIndex(layerIndex);
            var objectCount = layer.getObjectCount();

            for(var objectIndex = 0; objectIndex < objectCount; objectIndex++) {
                var object = layer.getObjectByIndex(objectIndex);
                var resource = map.resources.getResource(object.resourceId);
                var resourcePath = "../../Resources/" + resource.value;

                var sceneObject = new texturedplane.TexturedPlane(resourcePath, 0.1);
                sceneObject.load(function(sceneObject) {
                    scene.add(sceneObject);
                });
            }
        }
    };

    MapEngine.prototype.start = function()
    {
        var renderer = this.renderer;
        var scene = this.scene;
        var camera = this.camera;

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