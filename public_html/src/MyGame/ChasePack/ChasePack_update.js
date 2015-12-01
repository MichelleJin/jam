/* File: DyePack.js 
 *
 * Creates and initializes a simple DyePack
 */

/*jslint node: true, vars: true */
/*global gEngine, GameObject, SpriteRenderable, vec2, DyePack */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

ChasePack.prototype.update = function(hero) {
    //this.hero = hero;
    switch (this.mCurrentState) {
        case ChasePack.eChasePackState.eNormalRegion:        
            this._serviceNormalMove(hero);
            break;        
        case ChasePack.eChasePackState.eChaseState: 
            this._serviceChase(hero);
            break;
        
    }
};

ChasePack.prototype._distToHero = function(hero) {
    var toHero = [];
    vec2.subtract(toHero, hero.getXform().getPosition(), this.getXform().getPosition());
    return vec2.length(toHero);
};


ChasePack.prototype._serviceNormalMove = function(hero) {
    //GameObject.prototype.update.call(this);
    var deltaY = 0.03;
    var x = this.getXform().getXPos();
    var y = this.getXform().getYPos();
    this.getXform().setPosition(x, y);
    this.mStateTimeTick++;
    
    if (this._distToHero(hero) < 40){
        this.mCurrentState = ChasePack.eChasePackState.eChaseState;
        //this._serviceChase(hero);
    }
    
       
};

//ChasePack.prototype._servicePatrolStates = function(hero) {
//    if (this._distToHero(hero) < this.kDetectThreshold) {
//        // transition to chase!
//        this.mCurrentState = ChasePack.eChasePackState.eExcitedCWRotate;
//        this.mStateTimeClick = 0;
//        this.mTargetPosition = hero.getXform().getPosition();
//    } else {
//       // Continue patrolling!
//       GameObject.prototype.update.call(this);
//       var toTarget = [];
//       vec2.subtract(toTarget, this.mTargetPosition, this.getXform().getPosition());
//       var d = vec2.length(toTarget);
//       if (d > 10) { 
//           this.rotateObjPointTo(this.mTargetPosition, 0.05); // rotate rather quickly
//       } else {
//           
//       }
//   }
//};

ChasePack.prototype._serviceEnlarge = function() {
    // 1. check for state transition
    if (this.mStateTimeTick > this.kScaleTime) {
        // done with current state, transition to next
        // make sure state variables are properly initialized
        this.mStateTimeTick = 0;
        this.mCurrentState = ChasePack.eChasePackState.eCoolDownShrink;
    } else {
        // continue ...
        this.mStateTimeTick++;
        var xf = this.getXform();
        xf.incSizeBy(this.kScaleRate);
    }
};

ChasePack.prototype._serviceShrink = function() {
    // 1. check for state transition
    if (this.mStateTimeTick > this.kScaleTime) {
        // done with current state, transition to next
        // make sure state variables are properly initialized
        this.mStateTimeTick = 0;
        this._computeNextState();  // transition back into patrol
    } else {
        // continue ...
        this.mStateTimeTick++;
        var xf = this.getXform();
        xf.incSizeBy(-this.kScaleRate);
    }
};

ChasePack.prototype._serviceCWRotate = function() {
    // 1. check for state transition
    if (this.mStateTimeTick > this.kRotateTime) {
        // done with current state, transition to next
        // make sure state variables are properly initialized
        this.mStateTimeTick = 0;
        this.mCurrentState = ChasePack.eChasePackState.eExcitedCCWRotate;
    } else {
        // continue ...
        this.mStateTimeTick++;
        var xf = this.getXform();
        xf.incRotationByRad(this.kRotateRate);
    }
};

ChasePack.prototype._serviceCCWRotate = function() {
    // 1. check for state transition
    if (this.mStateTimeTick > this.kRotateTime) {
        // done with current state, transition to next
        // make sure state variables are properly initialized
        this.mStateTimeTick = 0;
        this.mChasePack.setColor(this.mChaseColor);
        this.mCurrentState = ChasePack.eChasePackState.eChaseState;
    } else {
        // continue ...
        this.mStateTimeTick++;
        var xf = this.getXform();
        xf.incRotationByRad(-this.kRotateRate);
    }
};

ChasePack.prototype._serviceChase = function(hero) {    
        var p = vec2.fromValues(0, 0);
        if (this.pixelTouches(hero, p)) {
           hero.hitOnce();
           this.setExpired();
        } else {
            // Give chase!
            
            this.mTargetPosition = hero.getXform().getPosition();
            this.rotateObjPointTo(this.mTargetPosition, 0.5); // rotate rather quickly
            GameObject.prototype.update.call(this);
        }
   
};