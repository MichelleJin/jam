/*
 * File: BlueLevel.js 
 * This is the logic of our game. 
 * Yixuan Jin
 * CSS490C
 * MP3
 */
/*jslint node: true, vars: true */
/*global gEngine: false, Scene: false, MyGame: false, SceneFileParser: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function LoseScene() {
    var canvas = document.getElementById('GLCanvas');
    this.kCanvasWidth = canvas.width;
    this.kCanvasHeight = canvas.height;

    this.kYouLostLogo = "assets/gameoverlogo.png";
    this.kStarsBG = "assets/bg_blend.jpg";


    this.mCamera = null;
    this.mGameOverMsg = null;

}
gEngine.Core.inheritPrototype(LoseScene, Scene);

LoseScene.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kYouLostLogo);
    gEngine.Textures.loadTexture(this.kStarsBG);
};

LoseScene.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kYouLostLogo);
    gEngine.Textures.unloadTexture(this.kStarsBG);


    switch (this.mNextScene) {
        case GAME_SCENE:
            var nextLevel = new MyGame();
            break;
        case LOSE_SCENE:
            var nextLevel = new LoseScene();  // next level to be loaded
            break;
        case WIN_SCENE:
            var nextLevel = new LoseScene();
            break;
    }
};

LoseScene.prototype.initialize = function () {
    // Step A: Read in the camera
    this.mCamera = new Camera(
            vec2.fromValues(20, 60),   // position of the camera
            100,                        // width of camera
            [0, 0, this.kCanvasWidth, this.kCanvasHeight]
            );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1.0]);

    this.mBackground = new Background(this.kStarsBG, this.mCamera);

    this.kGameOverMsg = "Game over!";
    this.mGameOverMsg = new FontRenderable(this.kGameOverMsg);
    this.mGameOverMsg.setColor([1, 1, 1, 1]);
    this.mGameOverMsg.getXform().setPosition(-5, 40);
    this.mGameOverMsg.setTextHeight(10);

    this.mTimerCountMsg = new FontRenderable("20");
    this.mTimerCountMsg.setColor([1, 1, 1, 1]);
    this.mTimerCountMsg.getXform().setPosition(20, 60);
    this.mTimerCountMsg.setTextHeight(10);
    this.mTimerCountMsg.frameSkip = 0;
    this.mTimerCountMsg.countdownTimeLeft = 20;

    this.mYouLostLogoRender = new TextureRenderable(this.kYouLostLogo);
    this.mYouLostLogo = new GameObject(this.mYouLostLogoRender);
    this.mYouLostLogo.getXform().setSize(40,20);
};


LoseScene.prototype.draw = function () {
    // Clear the entire canvas to light gray.
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]);

    // Draw on all camera.
    this.drawCamera(this.mCamera);

};

LoseScene.prototype.drawCamera = function (camera) {
    camera.setupViewProjection();

    this.mBackground.draw(camera);
    this.mGameOverMsg.draw(camera);
    this.mTimerCountMsg.draw(camera);
    this.mYouLostLogo.draw(camera);
};

LoseScene.prototype.update = function () {

    this.mBackground.update(this.mCamera);
    this.mYouLostLogo.getXform().setPosition(this.mCamera.getWCCenter()[0],this.mCamera.getWCCenter()[1]+25);

    if(this.mTimerCountMsg.frameSkip > 40)
    {
        this.mTimerCountMsg.frameSkip = 0;
        this.mTimerCountMsg.countdownTimeLeft--;
        this.mTimerCountMsg.mText = this.mTimerCountMsg.countdownTimeLeft.toString();

    }
    this.mTimerCountMsg.frameSkip++;

    // If countdown is 0, player gives up. Start the Start Scene.
    if (this.mTimerCountMsg.countdownTimeLeft == 0) {
        this.mNextScene = START_SCENE;
        gEngine.GameLoop.stop();
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q)) {
        gEngine.GameLoop.stop();
    }

};
