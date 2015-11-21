/**
 * Created by Ryan Lamb on 11/19/15.
 */

/*global expect*/

define(function() {
    function handlePropertyChangedTest(object, property, testValue, changeType, parent, rootName, modificationFunction) {
        var observedCalled = false;
        
        var objectToObserve = (parent === undefined) ? object : parent;
        
        objectToObserve.observe(function(sender, path, value, change) {
            expect(value).toBe(testValue);
            expect(change).toBe(changeType);
            if(rootName !== undefined) {
                expect(path).toBe(rootName + "." + property);
            } else {
                expect(path).toBe(property);
            }
            
            observedCalled = true;
        });
        
        if(modificationFunction === undefined) {
            object[property] = testValue;
        } else {
            modificationFunction();
        }
        expect(observedCalled).toBe(true);
    }
    
    return {
        handlePropertyChangedTest:handlePropertyChangedTest
    };
});