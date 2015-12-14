/* File: DyePack.js
 *
 * Creates and initializes a simple DyePack
 */

/*jslint node: true, vars: true */
/*global gEngine, GameObjectSet */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

PowerUpSet.kShotGunTexture = null;
PowerUpSet.kBigShotTexture = null;

function PowerUpSet() {
    GameObjectSet.call(this);
}
gEngine.Core.inheritPrototype(PowerUpSet, GameObjectSet);

PowerUpSet.prototype.update = function(aCamera, theHero) {
    // remove the expired ones
    var i, obj;
    for (i = 0; i < this.size(); i++) {
        obj = this.getObjectAt(i);
        if (obj.hasExpired()){
            this.removeFromSet(obj);
            theHero.setPowerUp(obj.getPowerUp());
        } else {
            obj.update(aCamera, theHero);
        }
    }
};

PowerUpSet.prototype.newAt = function(pos) {
     //only create 20% of of the time
    var rand = Math.random();
    if (rand > 0.2)
        return;
    rand = Math.random();
    if (rand < 0.33) {
        var p = new ShotGunPowerUp(PowerUpSet.kShotGunTexture, pos[0], pos[1]);
        this.addToSet(p);
    } else if (0.33 <= rand <= 0.66) {
        var p = new BigShotPowerUp(PowerUpSet.kBigShotTexture, pos[0], pos[1]);
        this.addToSet(p);
    } else {
        //add other powerup here
    }
};

