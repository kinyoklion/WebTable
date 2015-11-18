/**
 * Created by Ryan Lamb on 11/15/15.
 */

/* The following comment informs JSLint about the expect method of Jasmine. */ 
/*global expect*/

describe("Resource", function() {
    var Resource;
    var fromJSON;
    var testResource;

    beforeEach(function(done) {
        require(['MapData/resource'], function(resource) {
            Resource = resource.Resource;
            fromJSON = resource.fromJSON;
            testResource = new Resource(10, "test", true);
            done();
        });
    });

    it("should use values from construction", function() {
        expect(testResource.id).toBe(10);
        expect(testResource.value).toBe("test");
        expect(testResource.isReference).toBe(true);
    });

    it("should not allow setting of the id", function() {
        expect(function() {
            testResource.id = 11;
        }).toThrow(new Error("id cannot be changed"));
    });

    it("should not allow setting of the value", function() {
        expect(function() {
            testResource.value = "test";
        }).toThrow(new Error("value cannot be changed"));
    });

    it("should not allow setting of isReference", function() {
        expect(function() {
            testResource.isReference = false;
        }).toThrow(new Error("isReference cannot be changed"));
    });

    it("should stringify", function() {
        var stringResource = JSON.stringify(testResource);
        var jsonObject = JSON.parse(stringResource);
        var newResource = fromJSON(jsonObject);

        expect(newResource.id).toBe(10);
        expect(newResource.value).toBe("test");
        expect(newResource.isReference).toBe(true);
    })

    it("should have no references at construction", function() {
        expect(testResource.hasReferences()).toBe(false);
    });

    it("should have references when one is added", function() {
        testResource.addReference();
        expect(testResource.hasReferences()).toBe(true);
    });

    it("should not have references when one is added and removed", function() {
        testResource.addReference();
        testResource.removeReference();
        expect(testResource.hasReferences()).toBe(false);
    });

    it("should not allow references to be removed when there are not any", function() {
        expect(function () {
            testResource.removeReference();
        }).toThrow(new Error("Reference count imbalance. Removing reference from object with no references."));
    });
});