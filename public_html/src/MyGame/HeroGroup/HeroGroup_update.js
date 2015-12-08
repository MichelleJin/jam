HeroGroup.prototype.update = function(enemySet, enemySet2, enemySet3, particleSet, func, aCamera) {
    this._updatePosition(aCamera);
    this._updateProjectile(enemySet, enemySet2, enemySet3, particleSet, func, aCamera);
    switch (this.mCurrentState) {
        case HeroGroup.eHeroGroupState.eNormal:
            this._serviceNormal(enemySet, enemySet2, enemySet3, aCamera);
            break;
        case HeroGroup.eHeroGroupState.eInvicible:
            this._serviceInvulnerable();
            break;
    }
};

HeroGroup.prototype._serviceNormal = function (enemySet, enemySet2, enemySet3, aCamera) {
    // can fire
    if (this.mProjectiles.size() < 1 && gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
        this.mProjectiles.newAt(this.getXform().getPosition());
    }
};

HeroGroup.prototype._updateProjectile = function (enemySet, enemySet2, enemySet3, particleSet, func, aCamera) {
    var num = this.mProjectiles.update(enemySet, enemySet2, enemySet3, particleSet, func, aCamera);
    this.mNumDestroy += num;
};

HeroGroup.prototype._serviceInvulnerable = function () {
    this.mCurrentTick++;
    var c = this.getColor();
    c[3] += 0.01;
    if (this.mCurrentTick > 60) {
        this.mCurrentState = HeroGroup.eHeroGroupState.eNormal;
        this.getColor()[3] = 0;
    }
};

// update hero path
HeroGroup.prototype._updatePosition = function (aCamera) {
    this._moveByKeys();
    // Adjust for camera movement
    this.shiftX(aCamera.getSpeed());
    // Manual movement
    this.mHeroGroupState.update();
    this.getXform().setXPos(this.getX());
    this.getXform().setYPos(this.getY());
    this.mHealthBar.update(this);
};