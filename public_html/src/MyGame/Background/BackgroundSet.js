"use strict";  // Operate in Strict mode such that variables must be declared before used!

function BackgroundSet() {
    GameObjectSet.call(this);
    this.currentBGIndex = 0;
}
gEngine.Core.inheritPrototype(BackgroundSet, GameObjectSet);

BackgroundSet.prototype.update = function (aCamera) {

    var cameraXPos = aCamera.getWCCenter()[0];
    var nextBGIndex = (this.currentBGIndex + 1)%this.mSet.length;
    if (cameraXPos >= this.mSet[this.currentBGIndex].getXform().getXPos())
    {
        var currentBGxForm = this.mSet[this.currentBGIndex].getXform();
        var nextXPosition = currentBGxForm.getXPos() + currentBGxForm.getWidth();
        this.mSet[nextBGIndex].getXform().setPosition(nextXPosition, currentBGxForm.getYPos());
        this.currentBGIndex = (this.currentBGIndex + 1)%this.mSet.length;
    }
   // window.alert("happens");
};

BackgroundSet.prototype.draw = function (aCamera) {
    this.mSet[this.currentBGIndex].draw(aCamera);
    this.mSet[(this.currentBGIndex + 1)%this.mSet.length].draw(aCamera);
};
