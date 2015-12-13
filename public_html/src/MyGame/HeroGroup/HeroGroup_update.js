HeroGroup.prototype.update = function(enemySet, enemySet2, enemySet3, particleSet, func, aCamera, music) {
    this._updatePosition(aCamera);
    this._updateProjectile(enemySet, enemySet2, enemySet3, particleSet, func, aCamera);
    switch (this.mCurrentState) {
        case HeroGroup.eHeroGroupState.eNormal:
            this._serviceNormal(enemySet, enemySet2, enemySet3, aCamera, music);
            break;
        case HeroGroup.eHeroGroupState.eInvicible:
            //turn light on
            this._serviceInvulnerable();
            //turn light off
            break;
    }
};

// allows hero to fire projectiles
HeroGroup.prototype._serviceNormal = function (enemySet, enemySet2, enemySet3, aCamera, music) {
    // one projectile at a time
    //turn light off
    this.mBarrier.setLightTo(false);
    if (this.mProjectiles.size() < 1 && gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
        gEngine.AudioClips.playACue(music);
        if (this.mShotType === HeroGroup.eHeroShotType.eNormal)
            this.mProjectiles.newAt(this.getXform().getPosition());
        else if (this.mShotType === HeroGroup.eHeroShotType.eShotGun) {
            this.mProjectiles.newShootGunAt(this.getXform().getPosition());
        }
        else if (this.mShotType === HeroGroup.eHeroShotType.eBigShot) {

        }
    }
};

// updates projectile with enemy
HeroGroup.prototype._updateProjectile = function (enemySet, enemySet2, enemySet3, particleSet, func, aCamera) {
    var num = this.mProjectiles.update(enemySet, enemySet2, enemySet3, particleSet, func, aCamera);
    this.mNumDestroy += num;
};

// sets hero to invulnerable state
// hero cannot fire
HeroGroup.prototype._serviceInvulnerable = function () {
    this.mCurrentTick++;
    //turn light on
    //gEngine.AudioClips.playACue(music);
    this.mBarrier.setLightTo(true);
    var c = this.getColor();
    if (this.mCurrentTick < 15) c[3] += 0.1;
    if (this.mCurrentTick < 30 && this.mCurrentTick >= 15) c[3] -= 0.1;
    if (this.mCurrentTick < 45 && this.mCurrentTick >= 30) c[3] += 0.1;
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