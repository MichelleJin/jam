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
    this.kHeroSprite = "assets/Greenship.png"; //currently wrong size need sprite sheet
    this.kMinionSprite = "assets/minion_sprite.png";
    this.kProjectileTexture = "assets/Bullet.png";
    this.kGhostTexture = "assets/Ghost.png"
    this.kGoalStar = "assets/GoalStar.png";

    this.kHealthBarTexture = "assets/HealthBar.png"; // need to make a sprite sheet

    this.kStarsBG = "assets/starsBG16384by2048.png";
    this.kStatus = "Status: ";
    this.kSpaceInvaderSprite = "assets/space_invader_sprite_sheet.png";
    this.kSpaceInvader0 = "assets/space_invaders_sprite0fixed.png";

    // The camera to view the scene
    this.mCamera = null;
    this.mMiniCamera = null;
    this.mMsg = null;
    this.mNextScene = 0;

    // Alternating background images in a set
    this.mBackground = null;

    this.mGhostSet = null;
    this.mChasePackSet = null;
    this.mSpaceInvader = null;

    // Projectile.js has already been read in ...
    Projectile.kTexture = this.kProjectileTexture;
}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kMinionSprite);
    gEngine.Textures.loadTexture(this.kHeroSprite);
    gEngine.Textures.loadTexture(this.kGhostTexture);
    gEngine.Textures.loadTexture(this.kProjectileTexture);
    gEngine.Textures.loadTexture(this.kHealthBarTexture);
    gEngine.Textures.loadTexture(this.kStarsBG);
   // gEngine.Textures.loadTexture(this.kSpaceInvaderSprite);
    gEngine.Textures.loadTexture(this.kSpaceInvader0);
    gEngine.Textures.loadTexture(this.kGoalStar);
};

MyGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kMinionSprite);
    gEngine.Textures.unloadTexture(this.kHeroSprite);
    gEngine.Textures.unloadTexture(this.kGhostTexture);
    gEngine.Textures.unloadTexture(this.kProjectileTexture);
    gEngine.Textures.unloadTexture(this.kHealthBarTexture);
    gEngine.Textures.unloadTexture(this.kStarsBG);
    //gEngine.Textures.unloadTexture(this.kSpaceInvaderSprite);
    gEngine.Textures.unloadTexture(this.kSpaceInvader0);
    gEngine.Textures.unloadTexture(this.kGoalStar);
    
    switch (this.mNextScene) {
        case 0: 
            var nextLevel = new LoseScene();  // next level to be loaded           
            break;        
        case 1: 
            var nextLevel = new WinScene();
            break;        
    }
    
    gEngine.Core.startScene(nextLevel);
    
    
};

MyGame.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(50, 35),  // position of the camera
        100,                      // width of camera
        [0, 70, 1000, 700]        // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    // sets the background to gray
    this.mCamera.setSpeed(0.1);
    
    this.mMiniCamera = new Camera(
        vec2.fromValues(500, 35),  // position of the camera
        1000,                      // width of camera
        [0, 0, 1000, 70]       // viewport (orgX, orgY, width, height)
       
    );
    this.mMiniCamera.setBackgroundColor([0.4, 0.4, 0.4, 1]);

    gEngine.DefaultResources.setGlobalAmbientIntensity(3.6);

    this.mMsg = new FontRenderable(this.kStatus);
    this.mMsg.setColor([1, 1, 1, 1]);
    this.mMsg.getXform().setPosition(2, 2);
    this.mMsg.setTextHeight(2);
    
    var Star = new TextureRenderable(this.kGoalStar);
    Star.setColor([1, 1, 1, 0]);
    Star.getXform().setPosition(950, 35);
    Star.getXform().setSize(10, 10);
    Star.getXform().setZPos(10);    
    this.mStar = new GameObject(Star);

    // Being used to debug background scrolling
    this.mMsg2 = new FontRenderable(this.kStatus);
    this.mMsg2.setColor([1, 1, 1, 1]);
    this.mMsg2.getXform().setPosition(2, 4);
    this.mMsg2.setTextHeight(2);

    this.mGhostSet = new GhostSet(this.kGhostTexture);
    this.mChasePackSet = new ChasePackSet(this.kMinionSprite);
    // herosprite, healthbar, texture, x, y
    this.mHeroGroup = new HeroGroup(this.kHeroSprite, this.kHealthBarTexture, 50, 35);
    //this.mHeroGroup = new HeroGroup(this.kMinionSprite, this.kHealthBarTexture, 10, 10);

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
    this.mChasePackSet.draw(this.mCamera);
    this.mStar.draw(this.mCamera);
    
    this.mMiniCamera.setupViewProjection();
    this.mSpaceInvader.draw(this.mMiniCamera);
    this.mGhostSet.draw(this.mMiniCamera);
    this.mHeroGroup.draw(this.mMiniCamera);
    this.mChasePackSet.draw(this.mMiniCamera);
    this.mStar.draw(this.mMiniCamera);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
    this.mBackground.update(this.mCamera);
    this.mSpaceInvader.update(this.mCamera);

    this.mChasePackSet.update(this.mHeroGroup, this.mCamera);
    this.mGhostSet.update(this.mHeroGroup, this.mCamera);
    this.mHeroGroup.update(this.mGhostSet, this.mChasePackSet, this.mCamera);

    this.mMsg.setText("" + this.mCamera.getWCCenter()[0].toPrecision(4) + " " + this.mHeroGroup.getStatus());
    var c = this.mCamera.getWCCenter();
    var w = this.mCamera.getWCWidth();
    this.mMsg.getXform().setPosition(c[0] - w/2 + 2, this.mMsg.getXform().getYPos());

    this.mCamera.clampHeroAtBoundary(this.mHeroGroup, 1);
    this.mCamera.update();  // to ensure proper interpolated movement effects
    this.mMiniCamera.update();

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
    
    if (this.mHeroGroup.getHealth() === 0) {
        this.mNextScene = 0;
        gEngine.GameLoop.stop();
    }
    
    
    var h = [];
    if (this.mStar.pixelTouches(this.mHeroGroup, h)) {
        this.mNextScene = 1;
        gEngine.GameLoop.stop();
    }
};
