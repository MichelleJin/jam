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

 var gLights = null;
function MyGame() {
    this.kBgClip = "assets/sounds/bgMusic.mp3";
    this.kCue = "assets/sounds/laser.wav";
    this.mDebugModeOn = false;

    var canvas = document.getElementById('GLCanvas');
    this.kCanvasWidth = canvas.width;
    this.kCanvasHeight = canvas.height;
    this.kMiniMapHeight = 70;
    // power_ups textures
    this.kShotGunTexture = "assets/power_ups/ShotGun.png";
    this.kBigShotTexture = "assets/power_ups/BFG.png";
    // hero textures
    this.kHeroSprite = "assets/Hero.png";
    this.kHealthBarTexture = "assets/HealthBar.png"; // need to make a sprite sheet
    this.kProjectileTexture = "assets/Projectile.png";
    // enemy textures
    this.kChaseTexture = "assets/Chase.png";
    this.kGhostTexture = "assets/Ghost.png";
    this.kGhostDeadTexture = "assets/Ghost_Dead.png";
    this.kGrenade = "assets/Granade.png";

    this.kAstroidTexture = "assets/Astroid.png";
    this.kAstroidNormalMap = "assets/NormalMap.png";

    this.kGoalStar = "assets/GoalStar.png";

    this.kStarsBG = "assets/bg_blend.jpg";

    this.kParticleTexture = "assets/particle.png";
    this.kBarrierBubble = "assets/PowerUpBarrier.png";

    this.kStatus = "Status: ";
    // The camera to view the scene
    this.mCamera = null;
    this.mMiniCamera = null;
    this.mNextScene = 0;

    // Alternating background images in a set
    this.mBackground = null;

    this.mGhostSet = null;
    this.mChasePackSet = null;
    this.mGrenadeSet = [];

    this.mAllParticles = new ParticleGameObjectSet();

    // ambient lighting tick
    this.mAmbientTick = 0;
    this.mRed = true;

    this.mAstroid = null;
    // Projectile.js has already been read in ...
    Projectile.kTexture = this.kProjectileTexture;
    PowerUpSet.kShotGunTexture = this.kShotGunTexture;
    PowerUpSet.kBigShotTexture = this.kBigShotTexture;
    PowerUpSet.kBubbleTexture = this.kBarrierBubble;
}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function () {
    gEngine.AudioClips.loadAudio(this.kBgClip);
    gEngine.AudioClips.loadAudio(this.kCue);

    gEngine.Textures.loadTexture(this.kBigShotTexture);
    gEngine.Textures.loadTexture(this.kShotGunTexture);
    
    gEngine.Textures.loadTexture(this.kAstroidTexture);
    gEngine.Textures.loadTexture(this.kAstroidNormalMap);

    gEngine.Textures.loadTexture(this.kChaseTexture);

    gEngine.Textures.loadTexture(this.kHeroSprite);
    gEngine.Textures.loadTexture(this.kHealthBarTexture);

    gEngine.Textures.loadTexture(this.kGhostTexture);
    gEngine.Textures.loadTexture(this.kGhostDeadTexture);

    gEngine.Textures.loadTexture(this.kProjectileTexture);
    gEngine.Textures.loadTexture(this.kStarsBG);
    gEngine.Textures.loadTexture(this.kGoalStar);
    gEngine.Textures.loadTexture(this.kGrenade);
    gEngine.Textures.loadTexture(this.kParticleTexture);
    gEngine.Textures.loadTexture(this.kBarrierBubble);
};

MyGame.prototype.unloadScene = function () {
    gEngine.AudioClips.stopBackgroundAudio();

    gEngine.AudioClips.unloadAudio(this.kBgClip);
    gEngine.AudioClips.unloadAudio(this.kCue);

    gEngine.Textures.unloadTexture(this.kBigShotTexture);
    gEngine.Textures.unloadTexture(this.kShotGunTexture);

    gEngine.Textures.unloadTexture(this.kAstroidTexture);
    gEngine.Textures.unloadTexture(this.kAstroidNormalMap);

    gEngine.Textures.unloadTexture(this.kChaseTexture);


    gEngine.Textures.unloadTexture(this.kHeroSprite);

    gEngine.Textures.unloadTexture(this.kGhostTexture);
    gEngine.Textures.unloadTexture(this.kGhostDeadTexture);

    gEngine.Textures.unloadTexture(this.kProjectileTexture);
    gEngine.Textures.unloadTexture(this.kHealthBarTexture);
    gEngine.Textures.unloadTexture(this.kStarsBG);
    gEngine.Textures.unloadTexture(this.kGoalStar);
    gEngine.Textures.unloadTexture(this.kGrenade);
    gEngine.Textures.unloadTexture(this.kParticleTexture);
    gEngine.Textures.unloadTexture(this.kBarrierBubble);
    
    switch (this.mNextScene) {
        case GAME_SCENE:
                var nextLevel = new MyGame();
            break;
        case LOSE_SCENE:
                var nextLevel = new LoseScene();
            break;
        case WIN_SCENE:
                var nextLevel = new WinScene();
            break;
        case START_SCENE:
                var nextLevel = new StartScene();
            break;
        case GAMEOVER_SCENE:
                var nextLevel = new GameOverScene();
    }
    
    gEngine.Core.startScene(nextLevel);
    
    
};

MyGame.prototype.initialize = function () {
    this._initializeLights();   // defined in MyGame_Lights.js
    // Step A: set up the cameras
    gLights = this.mGlobalLightSet;
    this.mCamera = new Camera(
        vec2.fromValues(50, 35),  // position of the camera
        100,                      // width of camera
        [0, this.kMiniMapHeight, this.kCanvasWidth, this.kCanvasHeight - this.kMiniMapHeight]        // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    // sets the background to gray

    //this.mCamera.setSpeed(0);
    this.mCamera.setSpeed(0.1);

    this.mMiniCamera = new Camera(
        vec2.fromValues(500, 35),  // position of the camera
        1000,                      // width of camera
        [0, 0, this.kCanvasWidth, this.kMiniMapHeight]       // viewport (orgX, orgY, width, height)
    );
    this.mMiniCamera.setBackgroundColor([0.0, 0.0, 0.0, 1]);

    gEngine.DefaultResources.setGlobalAmbientIntensity(2.6);
    
    var Star = new TextureRenderable(this.kGoalStar);
    Star.setColor([1, 1, 1, 0]);
    Star.getXform().setPosition(950, 35);
    Star.getXform().setSize(10, 10);
    Star.getXform().setZPos(10);    
    this.mStar = new GameObject(Star);
    var lightZero = this.mGlobalLightSet.getLightAt(0);
    lightZero.setXPos(this.mStar.getXform().getXPos());
    lightZero.setYPos(this.mStar.getXform().getYPos());
    
//    var bubble = new LightRenderable(this.kBarrierBubble);
//    bubble.setColor([1, 1, 1, 0]);
//    bubble.getXform().setPosition(100, 35);
//    bubble.getXform().setSize(5, 5);
//    bubble.addLight(this.mGlobalLightSet.getLightAt(3));
//    this.mBubble = new GameObject(bubble);
    

    this.mGhostSet = new GhostSet(this.kGhostTexture, this.kGhostDeadTexture);

    this.mChasePackSet = new ChasePackSet(this.kChaseTexture);
    
    var i;
    for(i=0; i<10; i++){
        this.mGrenadeSet[i] = new GrenadeSet(this.kGrenade, 100 + 900 * Math.random(), 20 + 40 * Math.random());
    }

    // herosprite, healthbar, texture, x, y
    var lightOne = this.mGlobalLightSet.getLightAt(1);
    var lightThree = this.mGlobalLightSet.getLightAt(3);
    this.mHeroGroup = new HeroGroup(this.kHeroSprite, this.kHealthBarTexture, 50, 35, lightOne, lightThree);

    // Create background set
    this.mBackground = new Background(this.kStarsBG, this.mCamera);

    this.mAstroid = new Astroid(this.kAstroidTexture, this.kAstroidNormalMap, 50, 35);
    var i;
    for (i = 0; i < 5; i++) {
        if (i != 2) {
            this.mBackground.getRenderable().addLight(this.mGlobalLightSet.getLightAt(i));
            
        }

    }
    

    gEngine.AudioClips.playBackgroundAudio(this.kBgClip);

    this.mAstroid.getRenderable().addLight(this.mGlobalLightSet.getLightAt(2));
    this.mPowerUpSet = new PowerUpSet();
    this.mShotGun = new ShotGunPowerUp(this.kShotGunTexture, 25, 35);
    this.mBigShot = new BigShotPowerUp(this.kBigShotTexture, 75, 35);
    this.mPowerUpSet.addToSet(this.mBigShot);
    this.mPowerUpSet.addToSet(this.mShotGun);

};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    this.mCamera.setupViewProjection();
    
    gEngine.Core.clearCanvas([0.8, 0.8, 0.8, 1]); // clear to light gray
    if (!this.mDebugModeOn) {
        this.mBackground.draw(this.mCamera);
    }

    // main map
    this.mGhostSet.draw(this.mCamera);
    this.mChasePackSet.draw(this.mCamera);
    this.mStar.draw(this.mCamera);
    for(var i=0; i<10; i++){
        this.mGrenadeSet[i].draw(this.mCamera);
    }
    //this.mBubble.draw(this.mCamera);
    this.mHeroGroup.draw(this.mCamera);
    this.mAllParticles.draw(this.mCamera);
    this.mAstroid.draw(this.mCamera);

    this.mPowerUpSet.draw(this.mCamera);   // MOVE SOMEWHERE ELSE LATER

    // minimap
    this.mMiniCamera.setupViewProjection();
    this.mGhostSet.draw(this.mMiniCamera);
    this.mHeroGroup.draw(this.mMiniCamera);
    this.mChasePackSet.draw(this.mMiniCamera);
    this.mStar.draw(this.mMiniCamera);
    for(var i=0; i<10; i++){
        this.mGrenadeSet[i].draw(this.mMiniCamera);
    }
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
    this.mAstroid.update(this.mCamera);
    this.mBackground.update(this.mCamera);
    this.mAllParticles.update();
    // maybe have a class to update these
    var i;
    for(i = 0; i < 10; i++){
        this.mGrenadeSet[i].update(this.mHeroGroup, this.mCamera);
    }
    var x = this.mHeroGroup.getX();
    var y = this.mHeroGroup.getY();
    var lightThree = this.mGlobalLightSet.getLightAt(3);
    lightThree.setXPos(x+8);
    lightThree.setYPos(y);
    
//    var b = [];
//    if (this.mBubble.pixelTouches(this.mHeroGroup, b)) {
//        this.mHeroGroup.mCurrentState = HeroGroup.eHeroGroupState.eBarrier;
//        this.mBubble.setVisibility(false);
//    }
    
    //this.mGrenadeSet.update(this.mHeroGroup, this.mCamera);
    this.mChasePackSet.update(this.mHeroGroup, this.mCamera);
    this.mGhostSet.update(this.mHeroGroup, this.mCamera);

    this.mHeroGroup.update(this.mGhostSet, this.mChasePackSet, this.mGrenadeSet, this.mAllParticles, this.createParticle, this.mCamera, this.kCue, this.mPowerUpSet);
    this._updateLight(); // after hero to maintain light state
    this.mPowerUpSet.update(this.mCamera, this.mHeroGroup);

    this.mCamera.clampHeroAtBoundary(this.mHeroGroup, 1);
    this.mCamera.update();  // to ensure proper interpolated movement effects
    this.mMiniCamera.update();

    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.B)) {
        this.mDebugModeOn = !this.mDebugModeOn;
    }
    
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.G)) {
        this.mHeroGroup.mShotType = HeroGroup.eHeroShotType.eShotGun;
    }
    
    if (this.mHeroGroup.getHealthRatio() === 0) {
        gEngine.DefaultResources.setGlobalAmbientIntensity(3.6);
        this.mNextScene = LOSE_SCENE;
        gEngine.GameLoop.stop();
    }

    var h = [];
    if (this.mStar.pixelTouches(this.mHeroGroup, h)) {
        gEngine.DefaultResources.setGlobalAmbientIntensity(3.6);
        gEngine.DefaultResources.setGlobalAmbientColor([0.3, 0.3, 0.3, 1]);
        this.mNextScene = WIN_SCENE;
        gEngine.GameLoop.stop();
    }
};


MyGame.prototype.createParticle = function(atX, atY) {
    var life = 30 + Math.random() * 50;
    var p = new ParticleGameObject("assets/particle.png", atX, atY, life);
    p.getRenderable().setColor([1, 0, 0, 1]);
    //p.getRenderable().getXform().setZPos(20);
    
    // size of the particle
    var r = 3.5 + Math.random() * 2.5;
    p.getXform().setSize(r, r);
    
    // final color
    var fr = 3.5 + Math.random();
    var fg = 0.4 + 0.1 * Math.random();
    var fb = 0.3 + 0.1 * Math.random();
    p.setFinalColor([fr, fg, fb, 0.6]);
    
    // velocity on the particle
    //var fx = 10 * Math.random()- 20 * Math.random();
    var fy = 5 + 10 * Math.random() ;
    var fx = - 30 - 10 * Math.random();
    //var fy = 0;
    p.getPhysicsComponent().setVelocity([fx, fy]);
    
    // size delta
    p.setSizeDelta(0.95);
    
    return p;
};