///*
// * To change this license header, choose License Headers in Project Properties.
// * To change this template file, choose Tools | Templates
// * and open the template in the editor.
// */
//
//
//"use strict";  // Operate in Strict mode such that variables must be declared before used!
//
//function ParticleObject(spriteTexture) {
//    this.mAllParticles = new ParticleGameObjectSet();
//}
//gEngine.Core.inheritPrototype(ParticleObject, ParticleGameObjectSet);
//
//MyGame.prototype._createParticle = function(atX, atY) {
//    var life = 30 + Math.random() * 200;
//    var p = new ParticleGameObject(this.kParticleTexture, atX, atY, life);
//    p.getRenderable().setColor([1, 0, 0, 1]);
//
//    // size of the particle
//    var r = 5.5 + Math.random() * 0.5;
//    p.getXform().setSize(r, r);
//
//    // final color
//    var fr = 0.1 + Math.random();
//    var fg = 0.4 + 0.1 * Math.random();
//    var fb = 0.3 + 0.1 * Math.random();
//    p.setFinalColor([fr, fg, fb, 0.6]);
//
//    // velocity on the particle
//    var fx = 10 - 20 * Math.random();
//    var fy = 10 * Math.random();
//    p.getPhysicsComponent().setVelocity([fx, fy]);
//
//    // size delta
//    p.setSizeDelta(0.98);
//
//    return p;
//};