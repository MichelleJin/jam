/*
 * File: MyGame.js
 * This is the logic of our game.
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
 Renderable, TextureRenderable, FontRenderable, SpriteRenderable, LightRenderable, IllumRenderable,
 GameObject, TiledGameObject, ParallaxGameObject, Hero, Minion, Dye, Light */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";
var WIN_SCENE = 0;
var LOSE_SCENE = 1;
var START_SCENE = 2;
var GAME_SCENE = 3;

function StartScene() {
    var canvas = document.getElementById('GLCanvas');
    this.kCanvasWidth = canvas.width;
    this.kCanvasHeight = canvas.height;
    this.kMiniMapHeight = 70;

    this.kStarsBG = "assets/bg_blend.jpg";
    this.kStatus = "Status: ";
    this.kLogo = "assets/spaceshooterlogo.png";

    // The camera to view the scene
    this.mCamera = null;
    this.mMsg = null;

    // Alternating background images in a set
    this.mBackground = null;

    // Projectile.js has already been read in ...
    Projectile.kTexture = this.kProjectileTexture;
}
gEngine.Core.inheritPrototype(StartScene, Scene);

StartScene.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kStarsBG);
    gEngine.Textures.loadTexture(this.kLogo);
};

StartScene.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kStarsBG);
    gEngine.Textures.unloadTexture(this.kLogo);

    switch (this.mNextScene) {
        case GAME_SCENE:
            var nextLevel = new MyGame();
            break;
        case LOSE_SCENE:
            var nextLevel = new LoseScene();  // next level to be loaded
            break;
        case WIN_SCENE:
            var nextLevel = new WinScene();
            break;
    }

    gEngine.Core.startScene(nextLevel);
};

StartScene.prototype.initialize = function () {
    // Initialize the cameras.
    this.mCamera = new Camera(
        vec2.fromValues(50, 35),  // position of the camera
        100,                      // width of camera
        [0, this.kMiniMapHeight, this.kCanvasWidth, this.kCanvasHeight - this.kMiniMapHeight]        // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    this.mCamera.setSpeed(0.1);

    gEngine.DefaultResources.setGlobalAmbientIntensity(3.6);


    // Initialize the background.
    this.mBackground = new Background(this.kStarsBG, this.mCamera);

    this.mLogoRend = new TextureRenderable(this.kLogo);
    this.mLogo = new GameObject(this.mLogoRend);

};


StartScene.prototype.update = function () {

    // Updates background.
    this.mBackground.update(this.mCamera);
    this.mLogo.update(this.mCamera);

    // Updates cameras.
    this.mCamera.update();  // to ensure proper interpolated movement effects

    // User press spacebar to start the game.
    //TODO: change
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
        this.mNextScene = GAME_SCENE;
        gEngine.GameLoop.stop();
    }

};



StartScene.prototype.draw = function () {
    // Clear the entire canvas to light gray.
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]);

    // Draw on all camera.
    this.drawCamera(this.mCamera);

};

// draw delegates the drawing on each camera to this function.
StartScene.prototype.drawCamera = function (camera) {
    camera.setupViewProjection();

    this.mBackground.draw(camera);
    this.mMsg.draw(camera);
    this.mLogo.draw(camera);
};