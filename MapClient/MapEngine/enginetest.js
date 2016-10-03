/**
 * Created by Ryan Lamb on 9/16/16.
 */

define(function (require) {
    var mapEngine = require('MapClient/MapEngine/mapengine');
    var mapData = require('MapData/mapdata');

    var engine = new mapEngine.MapEngine();
    engine.start();

    var version = undefined;

    var requestJson = function(requestUrl, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(e) {
            if(xhr.readyState == 4) {
                var response = xhr.responseText;
                callback(response);
            }

        };

        xhr.open('GET', requestUrl, true);
        xhr.send();
    };

    window.setInterval(function() {
        var baseUrl = "http://" + window.location.host;
        var getClientMapUrl = baseUrl + "/getClientMap";

        requestJson(getClientMapUrl, function(response) {
            var map = JSON.parse(response)["clientmap"];
            var mapRequestUrl = baseUrl + "/getMap/" + map;
            requestJson(mapRequestUrl, function(response) {
                var data = mapData.fromJSON(JSON.parse(response)["map"]);
                if(version === undefined || version !== data.version) {
                    version = data.version;
                    console.log("New map version: " + version);
                    engine.updateFromMap(data);
                }
            });
        });
    }, 1000);
});