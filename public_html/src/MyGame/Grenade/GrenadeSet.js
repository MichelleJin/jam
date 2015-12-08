/* File: DyePack.js 
 *
 * Creates and initializes a simple DyePack
 */

/*jslint node: true, vars: true */
/*global gEngine, GameObjectSet */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function GrenadeSet(texture, x, y) {
    GameObjectSet.call(this);
    this.kSpriteSheet = texture;
    var i, c;
    //x = 120;
    //y = 30;
    for(i=0; i<8; i++){        
        c = new Grenade(this.kSpriteSheet, x, y);        
        this.addToSet(c);
    }
}
gEngine.Core.inheritPrototype(GrenadeSet, GameObjectSet);


GrenadeSet.prototype.update = function(hero, aCamera) {
    var x, y, d;
    if (gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Left)) {
        x = aCamera.mouseWCX();
        y = aCamera.mouseWCY();
        d = new Grenade(this.kSpriteSheet, x, y);
        this.addToSet(d);
    }
    
    var index, size;
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Z)) {
        size = this.size();
        if (size >= 1) {
            index = Math.floor(Math.random() * size);
            if (index >= size)
                index = size - 1;
            this.removeFromSet(this.getObjectAt(index));
        }
    }
    
    // remove the expired ones
    var i, obj;
    for (i=0; i<this.size(); i++) {
        obj = this.getObjectAt(i);
        if (obj.hasHit())
            this.removeFromSet(obj);
    }
    
    // update all objects
    var i, obj;
    for (i=0; i<this.size(); i++) {
        obj = this.getObjectAt(i);
            if(obj.hasExpired()){
            obj.update(hero, aCamera, i);
        }
    }
};

