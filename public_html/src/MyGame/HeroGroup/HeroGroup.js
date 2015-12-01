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