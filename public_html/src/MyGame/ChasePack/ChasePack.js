/* File: DyePack.js 
 *
 * Creates and initializes a simple DyePack
 */

/*jslint node: true, vars: true */
/*global gEngine, GameObject, SpriteRenderable, vec2 */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!


ChasePack.eChasePackState = Object.freeze({
    eNormalRegion: 1,
    eExcitedCWRotate: 10,
    eExcitedCCWRotate: 11,
    eChaseState: 12,
    eCoolDownEnlarge: 13,
    eCoolDownShrink: 14
});

function ChasePack(spriteTexture, x, y) {
    this.kRefWidth = 2;
    this.kRefHeight = 3.25;
    this.kReferenceSpeed = 50 / (5 * 60);
            // cover 100 units in 5 seconds
            
    this.kDetectThreshold = 20;
    this.kChaseThreshold = 2 * this.kDetectThreshold;
    
    this.mChasePack = new SpriteRenderable(spriteTexture);
    this.mChasePack.setColor([1, 1, 1, 0.1]);
    this.mChasePack.getXform().setPosition(x, y);
    this.mChasePack.getXform().setZPos(10);
    this.mChasePack.getXform().setSize(this.kRefWidth*2, this.kRefHeight*2);
    this.mChasePack.setElementPixelPositions(510, 595, 23, 153);
    GameObject.call(this, this.mChasePack);
    
    
    this.setSpeed(0.3);
    //this.getXform().incRotationByRad(Math.PI/2);
    this.mChasePack.getXform().incRotationByRad(Math.PI/2);
    var dir = vec2.fromValues(-1, 0);
    
    this.setCurrentFrontDir(dir);
    
    // to support the chasing states
    this.kScaleTime = 0.5 * 60 * (0.8 + 0.2 * Math.random());
    this.kScaleRate = 0.05;
    
    this.kRotateTime = 0.5 * 60 * (0.8 + 0.2 * Math.random());
    this.kRotateRate = 0.1;
    
    // state is goverened by time
    this.mStateTimeTick = 0;  // this is the time
    this.mChaseColor = [1, 0, 0, 0.5];
    this.mCurrentState = ChasePack.eChasePackState.eNormalRegion;
    
    // Expired to remove
    this.mExpired = false;
}
gEngine.Core.inheritPrototype(ChasePack, GameObject);

ChasePack.prototype.setExpired = function() {
    this.mExpired = true;
};
ChasePack.prototype.hasExpired = function() {
    return this.mExpired;
};


    
ChasePack.prototype._computeSpeed = function() {
    // var toNextPos = [];
    // vec2.subtract(toNextPos, this.mTargetPosition, this.getXform().getPosition());
    // DO NOT set this now! Move there gradually
    //      this.setCurrentFrontDir(toNextPos);
    // 
    this.setSpeed((0.8 + 0.4 * Math.random()) * this.kReferenceSpeed);
        // +-20% variation from covering 100 units in 5 seconds
};



