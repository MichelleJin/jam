/*jslint node: true, vars: true */
/*global gEngine, GameObjectSet */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!


function PowerUp() {
    this.mExpired = false;
    this.mPowerUp = null;
    this.mCurrentLife = 180;
    this.mDeltaX = 0.1;
    this.mDeltaY = 0;
}
gEngine.Core.inheritPrototype(PowerUp, GameObject);

PowerUp.prototype.setExpired = function() {
    this.mExpired = true;
};
PowerUp.prototype.hasExpired = function() {
    return this.mExpired;
};

PowerUp.prototype.getPowerUp = function() {
    return this.mPowerUp;
};

PowerUp.prototype.setPowerUp = function(powerUp) {
    this.mPowerUp = powerUp;
};

PowerUp.prototype.update = function (aCamera) {
    //alert(this.mCurrentLife);
    this.mCurrentLife--;
    if (this.mCurrentLife === 0)
        this.setExpired();

    var pos = this.getXform().getPosition();
    //aCamera.intersectsBound()
    this.getXform().setXPos(pos[0] + aCamera.getSpeed() + this.mDeltaX);
    this.getXform().setYPos(pos[1]);
};
