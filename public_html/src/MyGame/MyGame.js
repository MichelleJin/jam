/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
 Renderable, TextureRenderable, FontRenderable, SpriteRenderable, LightRenderable, IllumRenderable,
 GameObject, TiledGameObject, ParallaxGameObject, Hero, Minion, Dye, Light */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame() {
    this.kMinionSprite = "assets/minion_sprite.png";
    this.kProjectileTexture = "assets/particle.png";
    this.kStatus = "Status: ";

    // The camera to view the scene
    this.mCamera = null;
    this.mMsg = null;

    this.mHero = null;
    this.mPath = null;
//    this.mDyePackSet = null;
    this.mGhostSet = null;

    // Projectile.js has already been read in ...
    Projectile.kTexture = this.kProjectileTexture;
}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kMinionSprite);
    gEngine.Textures.loadTexture(this.kProjectileTexture);
};

MyGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kMinionSprite);
    gEngine.Textures.unloadTexture(this.kProjectileTexture);
};

MyGame.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(50, 35),  // position of the camera
        100,                      // width of camera
        [0, 0, 1000, 700],        // viewport (orgX, orgY, width, height)
        2
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    // sets the background to gray
    this.mCamera.setSpeed(1);

    gEngine.DefaultResources.setGlobalAmbientIntensity(3.6);

    this.mMsg = new FontRenderable(this.kStatus);
    this.mMsg.setColor([0, 0, 0, 1]);
    this.mMsg.getXform().setPosition(2, 2);
    this.mMsg.setTextHeight(3);

    this.mPath = new LineSet();
    this.mHero = new Hero(this.kMinionSprite, this.mPath, 5, 5);

    this.mGhostSet = new GhostSet(this.kMinionSprite);
    var g = new Ghost(this.kMinionSprite, 50, 35);
    this.mGhostSet.addToSet(g);
//    this.mDyePackSet = new DyePackSet(this.kMinionSprite);
//    var d = new DyePack(this.kMinionSprite, 50, 35);
//    this.mDyePackSet.addToSet(d);

};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    this.mMsg.draw(this.mCamera);

    this.mPath.draw(this.mCamera);
    //this.mDyePackSet.draw(this.mCamera);
    this.mGhostSet.draw(this.mCamera);
    this.mHero.draw(this.mCamera);

};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {

    this.mPath.update(this.mCamera);
    this.mHero.update(this.mGhostSet, this.mCamera);
    this.mGhostSet.update(this.mHero, this.mCamera);
//    this.mDyePackSet.update(this.mHero, this.mCamera);

    this.mMsg.setText("" + this.mCamera.getWCCenter()[0] + " " + this.mHero.getStatus());
    var c = this.mCamera.getWCCenter();
    var w = this.mCamera.getWCWidth();
    this.mMsg.getXform().setPosition(c[0] - w/2 + 2, this.mMsg.getXform().getYPos());
    this.mCamera.clampAtBoundary(this.mHero.getXform(), 1);

    this.mCamera.update();  // to ensure proper interpolated movement effects
};
