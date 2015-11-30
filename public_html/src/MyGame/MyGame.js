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
    this.kStarsBG = "assets/starsBG16384by2048.png";
    this.kStatus = "Status: ";
    this.kSpaceInvaderSprite = "assets/space_invader_sprite_sheet.png";
    this.kSpaceInvader0 = "assets/space_invaders_sprite0fixed.png";


    // The camera to view the scene
    this.mCamera = null;
    this.mMsg = null;

    // Alternating background images in a set
    this.mBackgroundSet = null;

    this.mHero = null;
    this.mPath = null;
    this.mGhostSet = null;
    this.mSpaceInvader = null;

    // Projectile.js has already been read in ...
    Projectile.kTexture = this.kProjectileTexture;
}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kMinionSprite);
    gEngine.Textures.loadTexture(this.kProjectileTexture);
    gEngine.Textures.loadTexture(this.kStarsBG);
   // gEngine.Textures.loadTexture(this.kSpaceInvaderSprite);
    gEngine.Textures.loadTexture(this.kSpaceInvader0);
};

MyGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kMinionSprite);
    gEngine.Textures.unloadTexture(this.kProjectileTexture);
    gEngine.Textures.unloadTexture(this.kStarsBG);
    gEngine.Textures.unloadTexture(this.kSpaceInvaderSprite);
    gEngine.Textures.unloadTexture(this.kSpaceInvader0);
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
    this.mMsg.setTextHeight(2);

    // Being used to debug background scrolling
    this.mMsg2 = new FontRenderable(this.kStatus);
    this.mMsg2.setColor([1, 1, 1, 1]);
    this.mMsg2.getXform().setPosition(2, 4);
    this.mMsg2.setTextHeight(2);

    this.mPath = new LineSet();
    this.mHero = new Hero(this.kMinionSprite, this.mPath, 5, 5);

    // Create background set
    var bg0 = new Background(this.kStarsBG, 300,35);
    bg0.getXform().setSize(600,75);
    var bg1 = new Background(this.kStarsBG, -300,35);
    bg1.getXform().setSize(600,75);
    this.mBackgroundSet = new BackgroundSet();
    this.mBackgroundSet.addToSet(bg0);
    this.mBackgroundSet.addToSet(bg1);

    this.mGhostSet = new GhostSet(this.kMinionSprite);
    var g = new Ghost(this.kMinionSprite, 50, 35);
    this.mGhostSet.addToSet(g);

    //this.mSpaceInvader = new SpaceInvader(this.kSpaceInvaderSprite, 100, 35);
    this.mSpaceInvader = new SpaceInvader(this.kSpaceInvader0, 100, 35);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    this.mCamera.setupViewProjection();
    gEngine.Core.clearCanvas([0.0, 0.0, 1, 1.0]); // clear to light gray

    this.mBackgroundSet.draw(this.mCamera);
    this.mMsg2.draw(this.mCamera);
    this.mSpaceInvader.draw(this.mCamera);

    this.mMsg.draw(this.mCamera);
    this.mPath.draw(this.mCamera);
    this.mGhostSet.draw(this.mCamera);
    this.mHero.draw(this.mCamera);

};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
    this.mBackgroundSet.update(this.mCamera);
    this.mSpaceInvader.update(this.mCamera);

    this.mPath.update(this.mCamera);
    this.mHero.update(this.mGhostSet, this.mCamera);

    this.mGhostSet.update(this.mHero, this.mCamera);

    this.mMsg.setText("" + this.mCamera.getWCCenter()[0] + " " + this.mHero.getStatus());
    var c = this.mCamera.getWCCenter();
    var w = this.mCamera.getWCWidth();
    this.mMsg.getXform().setPosition(c[0] - w/2 + 2, this.mMsg.getXform().getYPos());
    this.mCamera.clampAtBoundary(this.mHero.getXform(), 1);
    this.mCamera.update();  // to ensure proper interpolated movement effects

    // Second message being used to debug background alternation
    this.mMsg2.setText("hero: " + this.mHero.getXform().getXPos().toPrecision(3)
        + " bg[0] minX:" + this.mBackgroundSet.mSet[0].getBBox().minX()
        + " maxX " + this.mBackgroundSet.mSet[0].getBBox().maxX()
        + " bg[1] minX:" + this.mBackgroundSet.mSet[1].getBBox().minX()
        + " maxX " + this.mBackgroundSet.mSet[1].getBBox().maxX());
    this.mMsg2.getXform().setPosition(c[0] - w/2 + 2, this.mMsg.getXform().getYPos() + 2);

};
