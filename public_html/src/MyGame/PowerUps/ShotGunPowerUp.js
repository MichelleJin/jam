/*jslint node: true, vars: true */
/*global gEngine, GameObjectSet */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function ShotGunPowerUp(spriteTexture, atX, atY) {
    var rend = new LightRenderable(spriteTexture);
    rend.getXform().setZPos(5);
    rend.setElementPixelPositions(0, 256, 0, 64);
    rend.getXform().setSize(12, 3);
    rend.getXform().setPosition(atX, atY);
    PowerUp.call(this);
    GameObject.call(this, rend);
    this.setPowerUp(HeroGroup.eHeroShotType.eShotGun);
}
gEngine.Core.inheritPrototype(ShotGunPowerUp, PowerUp);

ShotGunPowerUp.prototype.update = function (aCamera, hero) {
    var speed = 0;
    var pos = this.getXform().getPosition();
    this.getXform().setXPos(pos[0] + aCamera.getSpeed() + speed);
    this.getXform().setYPos(pos[1]);
    var temppos = [0, 0];
    if (this.pixelTouches(hero, temppos)) {
        this.setExpired();
    }
};