/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


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

function WinScene() {
    
    

    // The camera to view the scene
    this.mSecondCamera = null;
    this.mMsg = null;
    this.mMsgTwo = null;
    this.kStatusOne = "Congratulations";
    this.kStatusTwo = "You Save the World!!";
}
gEngine.Core.inheritPrototype(WinScene, Scene);

WinScene.prototype.loadScene = function () {
    // load the scene file
    //gEngine.TextFileLoader.loadTextFile(this.kSceneFile, gEngine.TextFileLoader.eTextFileType.eXMLFile);

};

WinScene.prototype.unloadScene = function () {
    
    //gEngine.TextFileLoader.unloadTextFile(this.kSceneFile);
    

    var nextLevel = new MyGame();  // load the next level
    gEngine.Core.startScene(nextLevel);
};

WinScene.prototype.initialize = function () {
    

    // Step A: Read in the camera
    
    this.mSecondCamera = new Camera(
            vec2.fromValues(20, 60),   // position of the camera
            100,                        // width of camera
            [0, 0, 1000, 770]                    
            );
    this.mSecondCamera.setBackgroundColor([0.8, 0.8, 0.8, 1.0]);
    
    this.mMsg = new FontRenderable(this.kStatusOne);
    this.mMsg.setColor([1, 1, 1, 1]);
    this.mMsg.getXform().setPosition(-15, 70);
    this.mMsg.setTextHeight(7);
    // Step B: Read all the squares
    this.mMsgTwo = new FontRenderable(this.kStatusTwo);
    this.mMsgTwo.setColor([1, 1, 1, 1]);
    this.mMsgTwo.getXform().setPosition(-25, 50);
    this.mMsgTwo.setTextHeight(7);

    
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
WinScene.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    // Step  B: Activate the drawing Camera
    this.mSecondCamera.setupViewProjection();
    this.mMsg.draw(this.mSecondCamera);
    this.mMsgTwo.draw(this.mSecondCamera);

    // Step  C: draw all the squares
    
};

// The update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
WinScene.prototype.update = function () {
    // For this very simple game, let's move the first square
    
    
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.W)) {
        gEngine.GameLoop.stop();
    }
};