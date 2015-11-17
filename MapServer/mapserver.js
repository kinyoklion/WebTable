/**
 * Created by Ryan Lamb on 11/14/15.
 * This script will serve as the main entry point for the map server.
 */

var requirejs = require('requirejs');

requirejs.config({
    nodeRequire: require
});

requirejs(['../MapData/mapdata'],
    function   (mapdata) {
        var mapInstance = new mapdata.MapData();
        console.log(mapInstance);
    });