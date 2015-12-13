/*
 * File: MyGame_lightControl: support UI manipulation of light parameters
 */

/*jslint node: true, vars: true */
/*global gEngine, MyGame */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!
// ambient lighting control
MyGame.prototype._updateLight = function () {
    var deltaColor = 0.05;
    var lightFour = this.mGlobalLightSet.getLightAt(4);
    var color = lightFour.getColor();
    var GlobalAmbientColor = gEngine.DefaultResources.getGlobalAmbientColor();
    if (this.mHeroGroup.getHealth() <= 2) {
        if (this.mRed) {
            this.mAmbientTick++;
            color[0] += deltaColor;
            
            //GlobalAmbientColor[0] += deltaColor;
            if(this.mAmbientTick > 60) {
                this.mRed = false;
                this.mAmbientTick = 0;
            }
        } else {
            this.mAmbientTick++;
            color[0] -= deltaColor;
           
            //GlobalAmbientColor[0] -= deltaColor;
            if (this.mAmbientTick > 60) {
                this.mRed = true;
                this.mAmbientTick = 0;
            }
        }
    }
    // return color to normal upon death
    if (this.mHeroGroup.getHealth() <= 0) {
        GlobalAmbientColor[0] = 0.3;
    }

    var lgt = this.mGlobalLightSet.getLightAt(2);
    var p = lgt.getPosition();
    var delta = 0.1;
    lgt.setXPos(this.mAstroid.getXform().getXPos());
    lgt.setYPos(this.mAstroid.getXform().getYPos() + 50);
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {
        lgt.setXPos(p[0] - delta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
        lgt.setXPos(p[0] + delta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Up)) {
        lgt.setYPos(p[1] + delta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Down)) {
        lgt.setYPos(p[1] - delta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Z)) {
        lgt.setZPos(p[2] + delta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.X)) {
        lgt.setZPos(p[2] - delta);
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.P)) {
        alert("yPos: " + lgt.getPosition()[1]);
    }
};