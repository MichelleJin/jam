/* File: DyePack.js
 *
 * Creates and initializes a simple DyePack
 */

/*jslint node: true, vars: true */
/*global gEngine, GameObjectSet */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function GhostSet(sprite) {
    GameObjectSet.call(this);
    this.kSpriteSheet = sprite;
}
gEngine.Core.inheritPrototype(GhostSet, GameObjectSet);


GhostSet.prototype.update = function(hero, aCamera) {
    var x, y, d;
    if (gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Left)) {
        x = aCamera.mouseWCX();
        y = aCamera.mouseWCY();
        d = new Ghost(this.kSpriteSheet, x, y);
        this.addToSet(d);
    }

    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Z)) {
        var c = aCamera.getWCCenter();
        this.spawnGhosts(5, c[0], c[1]);
    }

    // remove the expired ones
    var i, obj;
    for (i=0; i<this.size(); i++) {
        obj = this.getObjectAt(i);
        if (obj.hasExpired())
            this.removeFromSet(obj);
    }

    // update all objects
    for (i=0; i<this.size(); i++) {
        obj = this.getObjectAt(i);
        obj.update(hero);
    }
};

GhostSet.prototype.spawnGhosts = function (numGhosts, atX, atY) {
    /* spawn numGhosts width + padding apart,
      at position x y
       */
    //alert("inside spawn ghosts");
    var i;
    for (i = 0; i < numGhosts; i++) {
        var ghost = new Ghost(this.kSpriteSheet, atX, atY);
        ghost.getXform().setXPos(ghost.getXform().getXPos() + i * ghost.getXform().getWidth());
        this.addToSet(ghost);
    }
};