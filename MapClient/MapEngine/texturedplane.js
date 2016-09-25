/**
 * Created by Ryan Lamb on 9/24/16.
 * Object which represents a textured plane.
 */

define(['three'], function(THREE) {
    function TexturedPlane(textureUrl, scale) {
        this.textureUrl = textureUrl;
        this.scale = scale;
    }

    TexturedPlane.prototype.load = function(loadComplete) {
        var texturedPlane = this;

        var textureLoader = new THREE.TextureLoader();
        textureLoader.load(texturedPlane.textureUrl, function(texture) {
            var image = texture.image;
            var scaledHeight = image.height * texturedPlane.scale;
            var scaledWidth = image.width * texturedPlane.scale;
            var geometry = new THREE.PlaneGeometry(scaledWidth, scaledHeight, 1, 1);
            var material = new THREE.MeshBasicMaterial({map: texture});
            var plane = new THREE.Mesh(geometry, material);

            //This should be handled with inheritance. For now this is the only type,
            //so it is just done here.
            texturedPlane._threejsObject = plane;

            texturedPlane.position = plane.position;
            loadComplete(texturedPlane);
        });
    };

    return {
        TexturedPlane: TexturedPlane
    };
});