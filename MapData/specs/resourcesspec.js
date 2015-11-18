/**
 * Created by Ryan Lamb on 11/15/15.
 */

/* The following comment informs JSLint about the expect method of Jasmine. */ 
/*global expect*/

describe("Resources", function() {

    var Resources;
    var fromJSON;
    var testResources;
    var ChangeType;

    beforeEach(function(done) {
        require(['MapData/resources', "MapData/observable"], function(resources, observable) {
            Resources = resources.Resources;
            fromJSON = resources.fromJSON;
            testResources = new Resources();
            ChangeType = observable.ChangeType;
            done();
        });
    });

    it("should allow a resource to be added", function() {
        var resourceId = testResources.addResource("test", false);
        expect(resourceId).not.toBe(undefined);
    });

    it("should have the same id when adding a resource twice", function() {
        var firstId = testResources.addResource("test", false);
        var secondId = testResources.addResource("test", false);
        expect(firstId).toBe(secondId);
    });

    it("should have different resource IDs for different resources", function () {
        var firstId = testResources.addResource("test", false);
        var secondId = testResources.addResource("test2", false);
        expect(firstId).not.toBe(secondId);
    });

    it("should return the correct resource when requested by ID", function() {
        var resourceId1 = testResources.addResource("test1", false);
        var resourceId2 = testResources.addResource("test2", false);

        var resource1 = testResources.getResource(resourceId1);
        var resource2 = testResources.getResource(resourceId2);
        expect(resource1.value).toBe("test1");
        expect(resource2.value).toBe("test2");
    });

    it("should remove unused resources", function() {
        var resourceId1 = testResources.addResource("test1", false);
        var resourceId2 = testResources.addResource("test2", false);
        var resource1 = testResources.getResource(resourceId1);
        resource1.addReference();
        testResources.removeUnusedResources();

        var resource2 = testResources.getResource(resourceId2);
        expect(resource2).toBe(undefined);
    });
    
    it("should notify when resources are added", function() {
        var observerCalled = false;
        
        testResources.observe(function(sender, path, value, change) {
           observerCalled = true; 
           expect(path).toBe("resourceList");
           expect(value.value).toBe("test");
           expect(value.isReference).toBe(true);
           expect(change).toBe(ChangeType.ADDED);
        });
        
        testResources.addResource("test", true);
        
        expect(observerCalled).toBe(true);
    });
    
    it("should notify when resources are removed", function() {
        var observerCalled = false;
        
        var resourceId = testResources.addResource("test", true);
        
        testResources.observe(function(sender, path, value, change) {
           observerCalled = true; 
           expect(path).toBe("resourceList");
           expect(value).toBe(resourceId);
           expect(change).toBe(ChangeType.REMOVED);
        });
        
        testResources.removeUnusedResources();
        
        expect(observerCalled).toBe(true);
    });


    it("should stringify", function() {
        var resourceId1 = testResources.addResource("test1", false);
        var resourceId2 = testResources.addResource("test2", false);
        testResources.getResource(resourceId1).addReference();

        var json = JSON.stringify(testResources);
        var parsed = JSON.parse(json);

        var newResources = fromJSON(parsed);

        var resource1 = newResources.getResource(resourceId1);
        var resource2 = newResources.getResource(resourceId2);
        expect(resource1.value).toBe("test1");
        expect(resource2.value).toBe("test2");
    });
});