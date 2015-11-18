/**
 * Created by Ryan Lamb on 11/18/15.
 */

/* The following comment informs JSLint about the expect method of Jasmine. */ 
/*global expect*/

describe("Layers", function() {

    var Layers;
    var fromJSON;
    var ChangeType;
    
    var testLayers;

    beforeEach(function(done) {
        require(['MapData/layers', 'MapData/observable'], function(layers, observable) {
            Layers = layers.Layers;
            fromJSON = layers.fromJSON;
            ChangeType = observable.ChangeType;
            testLayers = new Layers();
            done();
        });
    });
});