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

    var canvas = document.getElementById('GLCanvas');
    this.kCanvasWidth = canvas.width;
    this.kCanvasHeight = canvas.height;
    this.kMiniMapHeight = 70;

    this.kHeroSprite = "assets/Greenship.png"; //currently wrong size need sprite sheet
    this.kMinionSprite = "assets/minion_sprite.png";
    this.kProjectileTexture = "assets/Bullet.png";
    this.kAstroidTexture = "assets/Astroid.png";
    this.kGhostTexture = "assets/Ghost.png";
    this.kGhostDeadTexture = "assets/Scared.png";

    this.kGoalStar = "assets/GoalStar.png";

    this.kHealthBarTexture = "assets/HealthBar.png"; // need to make a sprite sheet

    this.kStarsBG = "assets/bg_blend.jpg";

    //this.kSpaceInvaderSprite = "assets/space_invader_sprite_sheet.png";
    //this.kSpaceInvader0 = "assets/space_invaders_sprite0fixed.png";
    this.kGrenade = "assets/YellowCircle2.png";
    this.kParticleTexture = "assets/particle.png";

    this.kStatus = "Status: ";
    // The camera to view the scene
    this.mCamera = null;
    this.mMiniCamera = null;
    this.mMsg = null;
    this.mNextScene = 0;

    // Alternating background images in a set
    this.mBackground = null;

    this.mGhostSet = null;
    this.mChasePackSet = null;
    this.mAllParticles = new ParticleGameObjectSet();

    // ambient lighting tick
    this.mAmbientTick = 0;
    this.mRed = true;

    this.mAstroid = null;
    // Projectile.js has already been read in ...
    Projectile.kTexture = this.kProjectileTexture;
}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kAstroidTexture);
    gEngine.Textures.loadTexture(this.kMinionSprite);
    gEngine.Textures.loadTexture(this.kHeroSprite);

    gEngine.Textures.loadTexture(this.kGhostTexture);
    gEngine.Textures.loadTexture(this.kGhostDeadTexture);

    gEngine.Textures.loadTexture(this.kProjectileTexture);
    gEngine.Textures.loadTexture(this.kHealthBarTexture);
    gEngine.Textures.loadTexture(this.kStarsBG);
    gEngine.Textures.loadTexture(this.kGoalStar);
    gEngine.Textures.loadTexture(this.kGrenade);
    gEngine.Textures.loadTexture(this.kParticleTexture);
};

MyGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kAstroidTexture);
    gEngine.Textures.unloadTexture(this.kMinionSprite);
    gEngine.Textures.unloadTexture(this.kHeroSprite);

    gEngine.Textures.unloadTexture(this.kGhostTexture);
    gEngine.Textures.unloadTexture(this.kGhostDeadTexture);

    gEngine.Textures.unloadTexture(this.kProjectileTexture);
    gEngine.Textures.unloadTexture(this.kHealthBarTexture);
    gEngine.Textures.unloadTexture(this.kStarsBG);
    gEngine.Textures.unloadTexture(this.kGoalStar);
    gEngine.Textures.unloadTexture(this.kGrenade);
    gEngine.Textures.unloadTexture(this.kParticleTexture);
    
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
    this._initializeLights();   // defined in MyGame_Lights.js
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(50, 35),  // position of the camera
        100,                      // width of camera
        [0, this.kMiniMapHeight, this.kCanvasWidth, this.kCanvasHeight - this.kMiniMapHeight]        // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    // sets the background to gray
    //this.mCamera.setSpeed(0.1);
    this.mCamera.setSpeed(0);
    this.mMiniCamera = new Camera(
        vec2.fromValues(500, 35),  // position of the camera
        1000,                      // width of camera
        [0, 0, this.kCanvasWidth, this.kMiniMapHeight]       // viewport (orgX, orgY, width, height)
       
    );
    this.mMiniCamera.setBackgroundColor([0.0, 0.0, 0.0, 1]);

    gEngine.DefaultResources.setGlobalAmbientIntensity(3.6);

    this.mMsg = new FontRenderable(this.kStatus);
    this.mMsg.setColor([1, 1, 1, 1]);
    this.mMsg.getXform().setPosition(2, 10);
    this.mMsg.setTextHeight(2);
    
    var Star = new TextureRenderable(this.kGoalStar);
    Star.setColor([1, 1, 1, 0]);
    Star.getXform().setPosition(180, 35);
    Star.getXform().setSize(10, 10);
    Star.getXform().setZPos(10);    
    this.mStar = new GameObject(Star);

    // Being used to debug background scrolling
    this.mMsg2 = new FontRenderable(this.kStatus);
    this.mMsg2.setColor([1, 1, 1, 1]);
    this.mMsg2.getXform().setPosition(2, 4);
    this.mMsg2.setTextHeight(2);

    this.mGhostSet = new GhostSet(this.kGhostTexture, this.kGhostDeadTexture);
    this.mChasePackSet = new ChasePackSet(this.kMinionSprite);
    this.mGrenadeSet = new GrenadeSet(this.kGrenade);
    // herosprite, healthbar, texture, x, y
    this.mHeroGroup = new HeroGroup(this.kHeroSprite, this.kHealthBarTexture, 50, 35);

    // Create background set
    this.mBackground = new Background(this.kStarsBG, this.mCamera);

    this.mAstroid = new Astroid(this.kAstroidTexture, 50, 35);
    var i;
    for (i = 0; i < 4; i++) {
        this.mBackground.getRenderable().addLight(this.mGlobalLightSet.getLightAt(i));
    }
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

    // main map
    this.mGhostSet.draw(this.mCamera);
    this.mHeroGroup.draw(this.mCamera);
    this.mChasePackSet.draw(this.mCamera);
    this.mStar.draw(this.mCamera);
    this.mGrenadeSet.draw(this.mCamera);
    this.mAstroid.draw(this.mCamera);
    this.mAllParticles.draw(this.mCamera);


    // minimap
    this.mMiniCamera.setupViewProjection();
    this.mGhostSet.draw(this.mMiniCamera);
    this.mHeroGroup.draw(this.mMiniCamera);
    this.mChasePackSet.draw(this.mMiniCamera);
    this.mStar.draw(this.mMiniCamera);
    this.mGrenadeSet.draw(this.mMiniCamera);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
    this.mAstroid.update(this.mCamera);
    this.mBackground.update(this.mCamera);
    this.mAllParticles.update();
    // maybe have a class to update these
    this.mGrenadeSet.update(this.mHeroGroup, this.mCamera);
    this.mChasePackSet.update(this.mHeroGroup, this.mCamera);
    this.mGhostSet.update(this.mHeroGroup, this.mCamera);
    // should pass this an array of enemy
    this.mHeroGroup.update(this.mGhostSet, this.mChasePackSet, this.mGrenadeSet, this.mAllParticles, this.createParticle, this.mCamera);

    this.mMsg.setText("Camera CenterXPos:" + this.mCamera.getWCCenter()[0].toPrecision(4));
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
    
    if (this.mHeroGroup.getHealthRatio() === 0) {
        this.mNextScene = 0;
        gEngine.GameLoop.stop();
    }
    
    
    var h = [];
    if (this.mStar.pixelTouches(this.mHeroGroup, h)) {
        this.mNextScene = 1;
        gEngine.GameLoop.stop();
    }
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.One)) {
        if (this.mCamera.isMouseInViewport()) {
            var p = this.createParticle(this.mCamera.mouseWCX(), this.mCamera.mouseWCY());
            this.mAllParticles.addToSet(p);
        }
    }

    // ambient lighting  <-- move into MyGame_Lights_Update?
    var deltaColor = 0.05;
    var GlobalAmbientColor = gEngine.DefaultResources.getGlobalAmbientColor();
    if (this.mHeroGroup.getHealth() <= 2) {
        if (this.mRed) {
            this.mAmbientTick++;
            GlobalAmbientColor[0] += deltaColor;
            if(this.mAmbientTick > 60) {
                this.mRed = false;
                this.mAmbientTick = 0;
            }
        } else {
            this.mAmbientTick++;
            GlobalAmbientColor[0] -= deltaColor;
            if (this.mAmbientTick > 60) {
                this.mRed = true;
                this.mAmbientTick = 0;
            }
        }
    }
};


MyGame.prototype.createParticle = function(atX, atY) {
    var life = 30 + Math.random() * 50;
    var p = new ParticleGameObject("assets/particle.png", atX, atY, life);
    p.getRenderable().setColor([1, 0, 0, 1]);
    
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