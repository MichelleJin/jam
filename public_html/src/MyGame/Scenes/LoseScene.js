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
    // The camera to view the scene
    this.mFrameSkip = 0;
    this.mCamera = null;
    this.mMsg = null;

    this.mCountdownTimer = null;
    this.mCountdownTimeLeft = 10;

    this.kStatus = "Game over!";
    //this.kStatus = this.mCountdownTimeLeft.toString();
}
gEngine.Core.inheritPrototype(LoseScene, Scene);

LoseScene.prototype.loadScene = function () {
    // load the scene file
    //gEngine.TextFileLoader.loadTextFile(this.kSceneFile, gEngine.TextFileLoader.eTextFileType.eXMLFile);

};

LoseScene.prototype.unloadScene = function () {
    
    //gEngine.TextFileLoader.unloadTextFile(this.kSceneFile);
    var nextLevel = new MyGame();  // load the next level
    gEngine.Core.startScene(nextLevel);
};

LoseScene.prototype.initialize = function () {
    // Step A: Read in the camera
    this.mSecondCamera = new Camera(
            vec2.fromValues(20, 60),   // position of the camera
            100,                        // width of camera
            [0, 0, 1000, 770]                    
            );
    this.mSecondCamera.setBackgroundColor([0.8, 0.8, 0.8, 1.0]);
    
    this.mMsg = new FontRenderable(this.kStatus);
    this.mMsg.setColor([1, 1, 1, 1]);
    this.mMsg.getXform().setPosition(0, 60);
    this.mMsg.setTextHeight(10);

    this.mTimerCountMsg = new FontRenderable(this.kStatus);
    this.mTimerCountMsg.setColor([1, 1, 1, 1]);
    this.mTimerCountMsg.getXform().setPosition(20, 40);
    this.mTimerCountMsg.setTextHeight(10);

    //this.startCountdown();
    // now start the bg music ...
    //gEngine.AudioClips.playBackgroundAudio(this.kBgClip);
};
/*
LoseScene.prototype.startCountdown = function () {
    // create a timer that calls update timer
    var that = this;
    this.mCountdownTimer = setInterval(  function(){that.updateTimer(that);}, 100) ;


   // window.alert("startCountDown");
};
*/



LoseScene.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    // Step  B: Activate the drawing Camera
    this.mSecondCamera.setupViewProjection();
    this.mMsg.draw(this.mSecondCamera);
    this.mTimerCountMsg.draw(this.mSecondCamera);

    // Step  C: draw all the squares
    
};


LoseScene.prototype.update = function () {

    if(this.mFrameSkip > 40)
    {
        this.mFrameSkip = 0;
        this.mCountdownTimeLeft--;
        this.mMsg.mText = this.mCountdownTimeLeft.toString();
    }
    this.mFrameSkip++;

    // If countdown is 0, player gives up. Start the Start Scene.
    if (this.mCountdownTimeLeft  == 0) {
        this.mNextScene = START_SCENE;
        gEngine.GameLoop.stop();
    }

    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q)) {
        gEngine.GameLoop.stop();
    }
};

/*
LoseScene.prototype.updateTimer = function () {
    window.alert("updateTimer called");

    that.mCountdownTimeLeft--;
    //window.alert(this.mCountdownTimeLeft);
    this.kStatus = that.mCountdownTimeLeft.toString();
    if (that.mCountdownTimeLeft == 0) {
        clearTimeout(this.mCountdownTimer);
    }

};
 */