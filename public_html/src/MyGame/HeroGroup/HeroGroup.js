/**
 * Created by MetaBlue on 11/29/15.
 */

/*jslint node: true, vars: true */
/*global gEngine, GameObject, SpriteRenderable, vec2 */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function HeroGroup(heroTexture, healthBarTexture, atX, atY) {
    this.mShip = new TextureRenderable(heroTexture);
    this.mShip.getXform().setPosition(atX, atY);
    this.mShip.getXform().setSize(20, 20);
    this.mShip.getXform().setZPos(5);
    GameObject.call(this, this.mShip);

    //Hero.call(this, heroTexture, atX, atY);
    this.kDelta = 0.6;
    this.kStartHealth = 10;

    this.mHealthBar = new HealthBar(healthBarTexture);

    this.mHit = 0;
    this.mNumDestroy = 0;

    // Projectiles that the hero can shoot
    this.mProjectiles = new ProjectileSet();


    this.mHeroGroupState = new HeroGroupState(this.getXform().getXPos(), this.getXform().getYPos());
    this.setHealth(this.kStartHealth);
}
gEngine.Core.inheritPrototype(HeroGroup, GameObject);

HeroGroup.prototype.draw = function(aCamera) {
    GameObject.prototype.draw.call(this, aCamera);
    this.mProjectiles.draw(aCamera);
    this.mHealthBar.draw(aCamera);
};

HeroGroup.prototype.update = function(enemySet, enemySet2, enemySet3, aCamera) {
    this._moveByKeys(); // for now
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
        this.mProjectiles.newAt(this.getXform().getPosition());
    }

    // update Projectile
    var num = this.mProjectiles.update(enemySet, enemySet2, enemySet3, aCamera);
    this.mNumDestroy += num;

    // update hero path
    this.shiftX(aCamera.getSpeed());
    this.mHealthBar.update(this);

    this.mHeroGroupState.update();
    this.getXform().setXPos(this.getX());
    this.getXform().setYPos(this.getY());
};

HeroGroup.prototype.hitOnce = function() {
    this.setHealth(this.getHealth() - 1);
};

HeroGroup.prototype.getStatus = function(){
    return  "Hero Hit: " + this.mHit +
        "  Num Destroy: " + this.mNumDestroy +
        "  Projectile: " + this.mProjectiles.size();
};

// returns percent of health left
HeroGroup.prototype.setHealth = function (number) { this.mHealth = number; };
HeroGroup.prototype.getHealth = function () { return this.mHealth; };

HeroGroup.prototype.getHealthRatio = function () {
    return this.getHealth()/this.kStartHealth; };

HeroGroup.prototype.getX = function () { return this.mHeroGroupState.getX(); };
HeroGroup.prototype.setX = function (xPos) { this.mHeroGroupState.setX(xPos); };
HeroGroup.prototype.getY = function () { return this.mHeroGroupState.getY(); };
HeroGroup.prototype.setY = function (yPos) { this.mHeroGroupState.setY(yPos); };
HeroGroup.prototype.shiftX = function ( shift ) { this.mHeroGroupState.shiftX( shift ); };
HeroGroup.prototype.shiftY = function ( shift ) { this.mHeroGroupState.shiftY( shift ); };

HeroGroup.prototype._moveByKeys = function() {
    if (gEngine.Input.isKeyPressed( gEngine.Input.keys.W ))
        this.shiftY( this.kDelta );
    if (gEngine.Input.isKeyPressed( gEngine.Input.keys.A ))
        this.shiftX( -this.kDelta );
    if (gEngine.Input.isKeyPressed( gEngine.Input.keys.S ))
        this.shiftY( -this.kDelta );
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
        this.shiftX( this.kDelta );
    }
};