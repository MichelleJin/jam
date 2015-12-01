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
    this.mDebugModeOn = false;
    this.kMinionSprite = "assets/minion_sprite.png";
    this.kProjectileTexture = "assets/particle.png";

    //this.kHealthBarTexture = "assets/HealthBar.png"; // need to resize this
    this.kHealthBarTexture = "assets/minion_sprite.png";

    this.kStarsBG = "assets/starsBG16384by2048.png";
    this.kStatus = "Status: ";
    this.kSpaceInvaderSprite = "assets/space_invader_sprite_sheet.png";
    this.kSpaceInvader0 = "assets/space_invaders_sprite0fixed.png";


    // The camera to view the scene
    this.mCamera = null;
    this.mMsg = null;

    // Alternating background images in a set
    this.mBackground = null;

    this.mGhostSet = null;
    this.mSpaceInvader = null;

    // Projectile.js has already been read in ...
    Projectile.kTexture = this.kProjectileTexture;
}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kMinionSprite);
    gEngine.Textures.loadTexture(this.kProjectileTexture);
    //gEngine.Textures.loadTexture(this.kHealthBarTexture);
    gEngine.Textures.loadTexture(this.kStarsBG);
   // gEngine.Textures.loadTexture(this.kSpaceInvaderSprite);
    gEngine.Textures.loadTexture(this.kSpaceInvader0);
};

MyGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kMinionSprite);
    gEngine.Textures.unloadTexture(this.kProjectileTexture);
    //gEngine.Textures.unloadTexture(this.kHealthBarTexture);
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
    this.mCamera.setSpeed(0.1);

    gEngine.DefaultResources.setGlobalAmbientIntensity(3.6);

    this.mMsg = new FontRenderable(this.kStatus);
    this.mMsg.setColor([1, 1, 1, 1]);
    this.mMsg.getXform().setPosition(2, 2);
    this.mMsg.setTextHeight(2);


    // Being used to debug background scrolling
    this.mMsg2 = new FontRenderable(this.kStatus);
    this.mMsg2.setColor([1, 1, 1, 1]);
    this.mMsg2.getXform().setPosition(2, 4);
    this.mMsg2.setTextHeight(2);

    this.mGhostSet = new GhostSet(this.kMinionSprite);
    // herosprite, healthbar texture, x, y
    this.mHeroGroup = new HeroGroup(this.kMinionSprite, this.kMinionSprite, 10, 10);

    // Create background set
    this.mBackground = new Background(this.kStarsBG, this.mCamera);

    //this.mSpaceInvader = new SpaceInvader(this.kSpaceInvaderSprite, 100, 35);
    this.mSpaceInvader = new SpaceInvader(this.kSpaceInvader0, 100, 35);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    this.mCamera.setupViewProjection();
    gEngine.Core.clearCanvas([0.8, 0.8, 0.8, 1]); // clear to light gray
    if (this.mDebugModeOn) {
        this.mMsg.draw(this.mCamera);
        this.mMsg2.draw(this.mCamera);
    } else {
        this.mBackground.draw(this.mCamera);
    }
    this.mSpaceInvader.draw(this.mCamera);
    this.mGhostSet.draw(this.mCamera);
    this.mHeroGroup.draw(this.mCamera);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
    this.mBackground.update(this.mCamera);
    this.mSpaceInvader.update(this.mCamera);

    this.mGhostSet.update(this.mHeroGroup, this.mCamera);
    this.mHeroGroup.update(this.mGhostSet, this.mCamera);

    this.mMsg.setText("" + this.mCamera.getWCCenter()[0] + " " + this.mHeroGroup.getStatus());
    var c = this.mCamera.getWCCenter();
    var w = this.mCamera.getWCWidth();
    this.mMsg.getXform().setPosition(c[0] - w/2 + 2, this.mMsg.getXform().getYPos());
    this.mCamera.clampAtBoundary(this.mHeroGroup.getXform(), 1);
    this.mCamera.update();  // to ensure proper interpolated movement effects

     //Second message being used to debug background alternation
    //this.mMsg2.setText("hero: " + this.mHeroGroup.getXform().getXPos().toPrecision(3)
    //    + " bg[0] minX:" + this.mBackgroundSet.mSet[0].getBBox().minX()
    //    + " maxX " + this.mBackgroundSet.mSet[0].getBBox().maxX()
    //    + " bg[1] minX:" + this.mBackgroundSet.mSet[1].getBBox().minX()
    //    + " maxX " + this.mBackgroundSet.mSet[1].getBBox().maxX());
    //this.mMsg2.getXform().setPosition(c[0] - w/2 + 2, this.mMsg.getXform().getYPos() + 2);

    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.B)) {
        this.mDebugModeOn = !this.mDebugModeOn;
    }
};
