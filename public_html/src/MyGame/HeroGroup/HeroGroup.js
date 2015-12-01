/**
 * Created by MetaBlue on 11/29/15.
 */
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

function HeroGroup(heroTexture, healthBarTexture, atX, atY) {
    Hero.call(this, heroTexture, atX, atY);
    this.mHeroGroupState = new HeroGroupState(this.getXform().getXPos(), this.getXform().getYPos());
    this.mHealthBar = new HealthBar(healthBarTexture);
}
gEngine.Core.inheritPrototype(HeroGroup, Hero);

HeroGroup.prototype.draw = function(aCamera) {
    Hero.prototype.draw.call(this, aCamera);
    this.mProjectiles.draw(aCamera);
    this.mHealthBar.draw(aCamera);
};

HeroGroup.prototype.update = function(enemySet, enemySet2, aCamera) {
    Hero.prototype.update.call(this, enemySet, enemySet2, aCamera);
    this.mHealthBar.update(this);
};

Hero.prototype.update = function(enemySet, aCamera) {
    this._moveByKeys(); // for now

    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
        this.mProjectiles.newAt(this.getXform().getPosition());
    }

    // update Projectile
    var num = this.mProjectiles.update(enemySet, aCamera);
    this.mNumDestroy += num;

    // update hero path
    this.shiftX(aCamera.getSpeed());
    this.mHealthBar.update(this);

    this.mHeroGroupState.update();
    this.getXform().setXPos(this.getX());
    this.getXform().setYPos(this.getY());
};

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