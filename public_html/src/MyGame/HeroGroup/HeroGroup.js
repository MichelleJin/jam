/**
 * Created by MetaBlue on 11/29/15.
 */

/*jslint node: true, vars: true */
/*global gEngine, GameObject, SpriteRenderable, vec2 */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

HeroGroup.eHeroGroupState = Object.freeze({
    eNormal: 0,
    eInvicible: 1
});

function HeroGroup(heroTexture, healthBarTexture, atX, atY) {
    this.mShip = new TextureRenderable(heroTexture);
    this.mShip.getXform().setPosition(atX, atY);
    this.mShip.getXform().setSize(18, 10);
    this.mShip.getXform().setZPos(5);
    GameObject.call(this, this.mShip);

    //Hero.call(this, heroTexture, atX, atY);
    this.kDelta = 0.6;
    this.kStartHealth = 5;

    this.mHealthBar = new HealthBar(healthBarTexture);

    this.mHit = 0;
    this.mNumDestroy = 0;

    // Projectiles that the hero can shoot
    this.mProjectiles = new ProjectileSet();

    // state for behavior
    this.mCurrentState = HeroGroup.eHeroGroupState.eNormal;
    this.mCurrentTick = 0;

    this.mHeroGroupState = new HeroGroupState(this.getXform().getXPos(), this.getXform().getYPos());
    this.setHealth(this.kStartHealth);
}
gEngine.Core.inheritPrototype(HeroGroup, GameObject);

HeroGroup.prototype.draw = function(aCamera) {
    GameObject.prototype.draw.call(this, aCamera);
    this.mProjectiles.draw(aCamera);
    this.mHealthBar.draw(aCamera);
};

// hero hit once by enemy/projectile
HeroGroup.prototype.hitOnce = function () {
    if (this.mCurrentState != HeroGroup.eHeroGroupState.eInvicible) {
        this.mCurrentState = HeroGroup.eHeroGroupState.eInvicible;
        this.setHealth(this.getHealth() - 1);
        this.mCurrentTick = 0;
    }
};

//<<<<<<< HEAD
//HeroGroup.prototype.hitOnce = function() {
 //   this.setHealth(this.getHealth() - 1);
//};

//=======
//>>>>>>> 48be6bc8b9a038d5defa79edf53ea7ec13c1f22b
HeroGroup.prototype.getStatus = function(){
    return  "Hero Hit: " + this.mHit +
        "  Num Destroy: " + this.mNumDestroy +
        "  Projectile: " + this.mProjectiles.size();
};

// returns percent of health left
//
//HeroGroup.prototype.setHealth = function (number) { this.mHealth = number; };
//HeroGroup.prototype.getHealth = function () { return this.mHealth; };

//HeroGroup.prototype.getHealthRatio = function () {
 //   return this.getHealth()/this.kStartHealth; };
//=======
HeroGroup.prototype.getHealthRatio = function () { return this.getHealth()/this.kStartHealth; };
//>>>>>>> 48be6bc8b9a038d5defa79edf53ea7ec13c1f22b

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