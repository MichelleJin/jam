/*jslint node: true, vars: true */
/*global gEngine, GameObjectSet */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!


function PowerUp() {
    this.mExpired = false;
    this.mPowerUp = null;
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
