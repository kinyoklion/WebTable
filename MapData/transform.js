/**
 * Created by Ryan Lamb on 11/19/15.
 * A Transform represents an x,y,x location along with rotation and scale.
 */
 
 define(["MapData/observable"], function(observable) {
    
    /**
     * Construct a Transform object.
     * @param {object} [opt_json] Optional object containing a JSON serialized
     * form.
     */
    function Transform(opt_json) {
        var x = (opt_json === undefined) ? 0 : opt_json.x;
        var y = (opt_json === undefined) ? 0 : opt_json.y;
        var z = (opt_json === undefined) ? 0 : opt_json.z;
        var xAngle = (opt_json === undefined) ? 0 : opt_json.xAngle;
        var yAngle = (opt_json === undefined) ? 0 : opt_json.yAngle;
        var zAngle = (opt_json === undefined) ? 0 : opt_json.zAngle;
        var xScale = (opt_json === undefined) ? 1 : opt_json.xScale;
        var yScale = (opt_json === undefined) ? 1 : opt_json.yScale;
        var zScale = (opt_json === undefined) ? 1 : opt_json.zScale;
        
        observable.MakeObservable(this);
        
        this.createObservedProperty("x", x);
        this.createObservedProperty("y", y);
        this.createObservedProperty("z", z);
        this.createObservedProperty("xAngle", xAngle);
        this.createObservedProperty("yAngle", yAngle);
        this.createObservedProperty("zAngle", zAngle);
        this.createObservedProperty("xScale", xScale);
        this.createObservedProperty("yScale", yScale);
        this.createObservedProperty("zScale", zScale);
        
        this.toJSON = function() {
            return {
                x: this.x,
                y: this.y,
                z: this.z,
                xAngle: this.xAngle,
                yAngle: this.yAngle,
                zAngle: this.zAngle,
                xScale: this.xScale,
                yScale: this.yScale,
                zScale: this.zScale
            }  
        };
    }
    
    /**
     * Create a Transform from a JSON representation.
     * {object} jsonTransform A simplified transform read from JSON.
     * @returns {Transform} Transform constructed from the json object.
     */
    function fromJSON(jsonTransform) {
        return new Transform(jsonTransform);
    }
    
    return {
        Transform: Transform,
        fromJSON: fromJSON
    };
 });