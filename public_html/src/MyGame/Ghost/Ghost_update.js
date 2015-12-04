/* File: DyePack.js
 *
 * Creates and initializes a simple DyePack
 */

/*jslint node: true, vars: true */
/*global gEngine, GameObject, SpriteRenderable, vec2, DyePack */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

Ghost.prototype.update = function(hero, aCamera) {
    switch (this.mCurrentState) {
        case Ghost.eGhostState.eWait:
            this._serviceWait(aCamera);
            break;
        case Ghost.eGhostState.eRising:
        case Ghost.eGhostState.eFalling:
            this._servicePatrolStates(hero);
            break;
        case Ghost.eGhostState.eDied:
            this._serviceDied();
            this._serviceFlee(hero, aCamera);
            break;
    }
};

Ghost.prototype._serviceDied = function () {
    //if (this.mAlive) {
    //    this.mAlive = false;
    //
    //    return;
    //}
};

Ghost.prototype._serviceFlee = function (hero, aCamera) {
    if (aCamera.collideWCBound(this.mDeadGhost.getXform(), 1.1) !== BoundingBox.eboundCollideStatus.eInside) {
        this.setExpired();
    }
    var fleeSpeed = 1;
    this.mDeadGhost.getXform().setXPos(this.mDeadGhost.getXform().getXPos() - fleeSpeed);
};

Ghost.prototype._distToCam = function (aCamera) {
    return this.getXform().getXPos() - aCamera.getWCCenter()[0];
};

Ghost.prototype._serviceWait = function (aCamera) {
    if (this._distToCam(aCamera) < aCamera.getWCWidth()/2) {
        this.mCurrentState = Ghost.eGhostState.eRising;
    }
};

Ghost.prototype._servicePatrolStates = function (hero) {
    // Check for collision
    var p = vec2.fromValues(0, 0);
    if (this.pixelTouches(hero, p)) {
        hero.hitOnce();
    }
    // Continue patrolling!
    if (this.mCurrentState === Ghost.eGhostState.eRising) this._serviceRising();
    else this._serviceFalling();

};

Ghost.prototype._serviceRising = function () {
    // Continue patrolling!
    var deltaY = 0.1;
    var x = this.getXform().getXPos();
    var y = this.getXform().getYPos();
    this.getXform().setPosition(x, y + deltaY);
    this.mStateTimeTick++;

    if (this.mStateTimeTick > 60) {
        this.mStateTimeTick = 0;
        this.mCurrentState = Ghost.eGhostState.eFalling;
    }
};

Ghost.prototype._serviceFalling = function () {
    // Continue patrolling!
    var deltaY = -0.1;
    var x = this.getXform().getXPos();
    var y = this.getXform().getYPos();
    this.getXform().setPosition(x, y + deltaY);
    this.mStateTimeTick++;

    if (this.mStateTimeTick > 60) {
        this.mStateTimeTick = 0;
        this.mCurrentState = Ghost.eGhostState.eRising;
    }
};

//Ghost.prototype._serviceEnlarge = function() {
//    // 1. check for state transition
//    if (this.mStateTimeTick > this.kScaleTime) {
//        // done with current state, transition to next
//        // make sure state variables are properly initialized
//        this.mStateTimeTick = 0;
//        this.mCurrentState = DyePack.eDyePackState.eCoolDownShrink;
//    } else {
//        // continue ...
//        this.mStateTimeTick++;
//        var xf = this.getXform();
//        xf.incSizeBy(this.kScaleRate);
//    }
//};
//
//Ghost.prototype._serviceShrink = function() {
//    // 1. check for state transition
//    if (this.mStateTimeTick > this.kScaleTime) {
//        // done with current state, transition to next
//        // make sure state variables are properly initialized
//        this.mStateTimeTick = 0;
//        this._computeNextState();  // transition back into patrol
//    } else {
//        // continue ...
//        this.mStateTimeTick++;
//        var xf = this.getXform();
//        xf.incSizeBy(-this.kScaleRate);
//    }
//};
//
//Ghost.prototype._serviceCWRotate = function() {
//    // 1. check for state transition
//    if (this.mStateTimeTick > this.kRotateTime) {
//        // done with current state, transition to next
//        // make sure state variables are properly initialized
//        this.mStateTimeTick = 0;
//        this.mCurrentState = DyePack.eDyePackState.eExcitedCCWRotate;
//    } else {
//        // continue ...
//        this.mStateTimeTick++;
//        var xf = this.getXform();
//        xf.incRotationByRad(this.kRotateRate);
//    }
//};
//
//Ghost.prototype._serviceCCWRotate = function() {
//    // 1. check for state transition
//    if (this.mStateTimeTick > this.kRotateTime) {
//        // done with current state, transition to next
//        // make sure state variables are properly initialized
//        this.mStateTimeTick = 0;
//        this.mGhostPack.setColor(this.mChaseColor);
//        this.mCurrentState = DyePack.eDyePackState.eChaseState;
//    } else {
//        // continue ...
//        this.mStateTimeTick++;
//        var xf = this.getXform();
//        xf.incRotationByRad(-this.kRotateRate);
//    }
//};