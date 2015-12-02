/* File: DyePack.js 
 *
 * Creates and initializes a simple DyePack
 */

/*jslint node: true, vars: true */
/*global gEngine, GameObject, SpriteRenderable, vec2, DyePack */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

Grenade.prototype.update = function(hero, aCamera, num) {
    switch (num) {
        case 0: 
            var dir = vec2.fromValues(-1, 0);  // next level to be loaded           
            break;        
        case 1: 
            var dir = vec2.fromValues(1, 0);
            break;
        case 2: 
            var dir = vec2.fromValues(0, 1);
            break;
        case 3: 
            var dir = vec2.fromValues(0, -1);
            break;
        case 4: 
            var dir = vec2.fromValues(-1, -1);  // next level to be loaded           
            break;        
        case 5: 
            var dir = vec2.fromValues(1, -1);
            break;
        case 6: 
            var dir = vec2.fromValues(1, 1);
            break;
        case 7: 
            var dir = vec2.fromValues(-1, 1);
            break;
    }
    
    
    //var dir = vec2.fromValues(-1, 0);
    this.setCurrentFrontDir(dir);
    GameObject.prototype.update.call(this);
    
    
    
    var p = vec2.fromValues(0, 0);
    if (this.pixelTouches(hero, p)) {
           hero.hitOnce();
           this.setHit();
        }
    
    
};

//ChasePack.prototype._distToHero = function(hero) {
//    var toHero = [];
//    vec2.subtract(toHero, hero.getXform().getPosition(), this.getXform().getPosition());
//    return vec2.length(toHero);
//};
//
//
//ChasePack.prototype._serviceNormalMove = function(hero, aCamera) {
//    //GameObject.prototype.update.call(this);
//    var cw = aCamera.getWCWidth();
//    var cc = aCamera.getWCCenter();
//    var deltaY = 0.15;
//    var x = this.getXform().getXPos();
//    var y = this.getXform().getYPos();
//    
//    if((cc[0]+cw/2) > x  && cc[0]-cw/2 < x){
//        this.getXform().setPosition(x-deltaY, y);
//    //this.mStateTimeTick++;
//    }
//    
//    var hp = hero.getXform().getPosition();
//    if (hp[0]+40 > this.getXform().getXPos() && hp[0]-5 < this.getXform().getXPos()){
//        this.mCurrentState = ChasePack.eChasePackState.eChaseState;
//        //this._serviceChase(hero);
//    }
//    
//       
//};
//
//
//ChasePack.prototype._serviceChase = function(hero) {    
//        var p = vec2.fromValues(0, 0);
//        if (this.pixelTouches(hero, p)) {
//           hero.hitOnce();
//           this.setExpired();
//        } else {
//            // Give chase!
//            
//            
//            this.mTargetPosition = hero.getXform().getPosition();
//            this.rotateObjPointTo(this.mTargetPosition, 0.5); // rotate rather quickly
//            GameObject.prototype.update.call(this);
//            
//            if(this.mTargetPosition[0]-10 > this.getXform().getXPos()){
//                this.mCurrentState = ChasePack.eChasePackState.eNormalRegion;
//                
//            }
//        }
//   
//};