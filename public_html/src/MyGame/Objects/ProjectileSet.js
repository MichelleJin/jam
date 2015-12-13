/* File: DyePack.js 
 *
 * Creates and initializes a simple DyePack
 */

/*jslint node: true, vars: true */
/*global gEngine, GameObjectSet */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function ProjectileSet(lightsource) {
    this.mLight = lightsource;
    GameObjectSet.call(this);
}
gEngine.Core.inheritPrototype(ProjectileSet, GameObjectSet);

ProjectileSet.prototype.update = function(dyes, dyes2, dyes3, particle, func, aCamera) {
    // remove the expired ones
    var i, obj;
    var numHit = 0;
    for (i=0; i<this.size(); i++) {
        obj = this.getObjectAt(i);
        if (obj.hasExpired()){
            this.removeFromSet(obj);
            this.mLight.setLightTo(false);
        }
    }
    
    // update all objects
    for (i=0; i<this.size(); i++) {
        obj = this.getObjectAt(i);
        if (obj.update(dyes, dyes2, dyes3, particle, func, aCamera))
            numHit++;
    }
    
    
    
    return numHit;
};

ProjectileSet.prototype.newAt = function(pos) {
    var p = new Projectile(pos[0], pos[1], this.mLight);
    this.addToSet(p);
};

ProjectileSet.prototype.newBigShotAt = function(pos) {
    var p = new Projectile(pos[0], pos[1], this.mLight);
    p.getXform().setSize()
    this.addToSet(p);}
