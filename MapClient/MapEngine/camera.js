/**
 * Created by Ryan Lamb on 9/24/16.
 *
 * Class which represents a camera.
 * Currently this is a thin wrapper around the threejs camera.
 */

define(['three'], function(THREE) {
    function Camera(type) {

        var pixelW = window.innerWidth;
        var pixelH = window.innerHeight;
        var aspectRatio = pixelW / pixelH;

        var size = 100;
        var worldSpaceWidth = size * aspectRatio;
        var worldSpaceHeight = size;

        if(type == CameraType.Orthographic) {
            this._threejsCamera = new THREE.OrthographicCamera(worldSpaceWidth / -2,
                worldSpaceWidth / 2, worldSpaceHeight / 2, worldSpaceHeight / -2, 1, 100);
        }
        else {
            //Not implemented.
        }

        //For now expose the threejs position. Should be independent.
        this.position = this._threejsCamera.position;
    }

    var CameraType = Object.freeze({Orthographic: 0, Perspective: 1});

    return {
        Camera: Camera,
        CameraType: CameraType
    }
});