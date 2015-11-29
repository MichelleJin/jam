/**
 * Created by Alanx on 11/29/15.
 */
/* File: Background.js
 *
 */

/*jslint node: true, vars: true */
/*global gEngine: false, GameObject: false, SpriteAnimateRenderable: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Background(kTexture, atX, atY) {
    this.kDelta = 0.2;
    this.mBackground = new TextureRenderable(kTexture);
    this.mBackground.getXform().setPosition(atX, atY);
    this.mBackground.getXform().setSize(1,1);
    this.mBackground.setElementUVCoordinate(0, 1, 0, 1); // (left,right,bottom,top)(ratio 8:1)
    GameObject.call(this, this.mBackground);
}
gEngine.Core.inheritPrototype(Background, GameObject);

Minion.prototype.update = function (aCamera) {

};

Minion.prototype.draw = function (aCamera) {
    this.mBackground.draw(aCamera);
};