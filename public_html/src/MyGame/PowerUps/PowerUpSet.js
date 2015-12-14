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
    var rand = Math.random();
    if (rand < 0.33) {
        var p = new ShotGunPowerUp(PowerUp.kShotGunTexture, pos[0], pos[1]);
    } else if (0.33 <= rand <= 0.66) {
        // power up 2
    } else {
        // power up 3
    }

    var p = new ShotGunPowerUp(PowerUp.kShotGunTexture, pos[0], pos[1]);
    this.addToSet(p);
};

