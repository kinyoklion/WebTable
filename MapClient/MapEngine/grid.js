/**
 * Created by Ryan Lamb on 10/2/16.
 *
 * Object which renders a basic grid.
 */

define(['three'], function(THREE) {

    /**
     * Create a new grid.
     * @param size The size of the grid.
     * @param divisions The number of divisions the grid should have.
     * @constructor
     */
   function Grid(size, divisions) {
       this._threejsObject = new THREE.GridHelper(size, divisions);
       this.position = this._threejsObject.position;
       this.rotation = this._threejsObject.rotation;
   }

   return {
       Grid: Grid
   };
});