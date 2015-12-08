function Astroid(spriteTexture, normalMap, atX, atY) {
    var norm = new IllumRenderable(spriteTexture, normalMap);
    //var norm = new TextureRenderable(spriteTexture);
    norm.setElementPixelPositions(0, 512, 0, 512);

    norm.getXform().setPosition(50, 35);
    norm.getXform().setSize(25, 25);
    norm.getXform().setZPos(10);
    GameObject.call(this, norm);
}
gEngine.Core.inheritPrototype(Astroid, GameObject);


Astroid.prototype.update = function (aCamera) {
    this.getXform().setRotationInDegree(this.getXform().getRotationInDegree() + 1);
    this.getXform().setXPos(this.getXform().getXPos() + aCamera.getSpeed() + 0.1)
}