var ProjectModel = require("./ProjectModel.js");
var BackgroundModel = require("./BackgroundModel.js");
var ParticleModel = require("./ParticleModel.js");
var BehaviourModel = require("./BehaviourModel.js");

module.exports = {
	projectModel: new ProjectModel(),
	backgroundModel: new BackgroundModel(),
	particleModel: new ParticleModel(),
	behaviourModel: new BehaviourModel()
};