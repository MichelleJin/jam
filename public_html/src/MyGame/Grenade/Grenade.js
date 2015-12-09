/* File: DyePack.js 
 *
 * Creates and initializes a simple DyePack
 */

/*jslint node: true, vars: true */
/*global gEngine, GameObject, SpriteRenderable, vec2 */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!




function Grenade(texture, x, y) {
    this.kRefWidth = 8;
    this.kRefHeight = 8;
    this.kReferenceSpeed = 50 / (5 * 60);
            // cover 100 units in 5 seconds
            
    this.kDetectThreshold = 20;
    this.kChaseThreshold = 2 * this.kDetectThreshold;
       
    
    this.mChipOne = new TextureRenderable(texture);
    this.mChipOne.setColor([1, 1, 1, 0]);
    this.mChipOne.getXform().setPosition(x, y);
    this.mChipOne.getXform().setZPos(10);
    this.mChipOne.getXform().setSize(this.kRefWidth, this.kRefHeight);
    GameObject.call(this, this.mChipOne);
    
    this.setSpeed(0.3);
 
    //this.mCurrentState = Grenade.eChasePackState.eNormalRegion;
    
    // Expired to remove
    this.mExpired = false;
    this.mHit = false;
}
gEngine.Core.inheritPrototype(Grenade, GameObject);

Grenade.prototype.setExpired = function() {
    this.mExpired = true;
};

Grenade.prototype.hasHit = function() {
    return this.mHit;
};

Grenade.prototype.setHit = function() {
    this.mHit = true;
};

Grenade.prototype.hasExpired = function() {
    return this.mExpired;
};


    
Grenade.prototype._computeSpeed = function() {
    // var toNextPos = [];
    // vec2.subtract(toNextPos, this.mTargetPosition, this.getXform().getPosition());
    // DO NOT set this now! Move there gradually
    //      this.setCurrentFrontDir(toNextPos);
    // 
    this.setSpeed((0.8 + 0.4 * Math.random()) * this.kReferenceSpeed);
        // +-20% variation from covering 100 units in 5 seconds
};



