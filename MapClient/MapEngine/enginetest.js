/**
 * Created by Ryan Lamb on 9/16/16.
 */

define(function (require) {
    var mapEngine = require('MapClient/MapEngine/mapengine');
    var mapData = require('MapData/mapdata');

    var engine = new mapEngine.MapEngine();
    engine.start();

    var version = undefined;

    window.setInterval(function() {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(e) {
            if(xhr.readyState == 4) {
                var response = xhr.responseText;

                var data = mapData.fromJSON(JSON.parse(response)["map"]);
                if(version === undefined || version !== data.version) {
                    version = data.version;
                    console.log("New map version: " + version);
                    engine.updateFromMap(data);
                }
            }

        };
        xhr.open('GET', "http://localhost:8081/getMap/test", true);
        xhr.send();
    }, 1000);
});