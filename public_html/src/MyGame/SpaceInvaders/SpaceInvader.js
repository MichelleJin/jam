/* File: Hero.js
 *
 * Creates and initializes the Hero (Dye)
 * overrides the update function of GameObject to define
 * simple Dye behavior
 */

/*jslint node: true, vars: true */
/*global gEngine, GameObject, SpriteRenderable, vec2 */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function SpaceInvader(spriteTexture, atX, atY) {

    this.kDelta = 0.6;

    this.mSpaceInvader = new SpriteRenderable(spriteTexture);
    this.mSpaceInvader.setColor([1, 1, 1, 0]);
    this.mSpaceInvader.getXform().setPosition(atX, atY);
    //this.mSpaceInvader.getXform().setZPos(5);
    this.mSpaceInvader.getXform().setSize(9, 12);
    //this.mSpaceInvader.setElementPixelPositions(197, 287, 1, 67); // left, right, bottom, top
    this.mSpaceInvader.setElementUVCoordinate(0,1,0,1);
    GameObject.call(this, this.mSpaceInvader);

}
gEngine.Core.inheritPrototype(SpaceInvader, GameObject);

SpaceInvader.prototype.update = function (aCamera) {
    this.mSpaceInvader.getXform().setPosition(aCamera.getWCCenter()[0],aCamera.getWCCenter()[1]);
};

SpaceInvader.prototype.draw = function (aCamera) {
    this.mSpaceInvader.draw(aCamera);

};

