/* File: DyePack.js
 *
 * Creates and initializes a simple DyePack
 */

/*jslint node: true, vars: true */
/*global gEngine, GameObject, SpriteRenderable, vec2 */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!


Ghost.eGhostState = Object.freeze({
    eTopLeftRegion: 0,
    eTopRightRegion: 1,
    eBottomLeftRegion: 2,
    eBottomRightRegion: 3,
    eExcitedCWRotate: 10,
    eExcitedCCWRotate: 11,
    eChaseState: 12,
    eCoolDownEnlarge: 13,
    eCoolDownShrink: 14,
    eWaveMovement: 15,
    eRising: 16,
    eFalling: 17
});

function Ghost(spriteTexture, x, y) {
    this.kRefWidth = 2;
    this.kRefHeight = 3.25;

    this.mGhost = new SpriteRenderable(spriteTexture);
    this.mGhost.setColor([1, 1, 1, 0.1]);
    this.mGhost.getXform().setPosition(x, y);
    this.mGhost.getXform().setSize(this.kRefWidth, this.kRefHeight);
    this.mGhost.setElementPixelPositions(510, 595, 23, 153);
    GameObject.call(this, this.mGhost);
    this.setSpeed(5);
    this.mCurrentState = Ghost.eGhostState.eRising;

    // state is goverened by time
    this.mStateTimeTick = 0;  // this is the time
    // Expired to remove
    this.mExpired = false;
}
gEngine.Core.inheritPrototype(Ghost, GameObject);

Ghost.prototype.setExpired = function() {
    this.mExpired = true;
};
Ghost.prototype.hasExpired = function() {
    return this.mExpired;
};