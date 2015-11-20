/**
 * Created by Ryan Lamb on 11/19/15.
 */

/*global expect*/

define(function() {
    function handlePropertyChangedTest(object, property, testValue, changeType) {
        var observedCalled = false;
        
        object.observe(function(sender, path, value, change) {
            expect(value).toBe(testValue);
            expect(change).toBe(changeType);
            expect(path).toBe(property);
            observedCalled = true;
        });
        
        object[property] = testValue;
        expect(observedCalled).toBe(true);
    }
    
    return {
        handlePropertyChangedTest:handlePropertyChangedTest
    };
});