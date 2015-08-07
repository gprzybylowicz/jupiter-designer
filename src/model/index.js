var ProjectModel = require("./ProjectModel.js");
var BackgroundModel = require("./BackgroundModel.js");
var ParticleModel = require("./ParticleModel.js");
var BehaviourModel = require("./BehaviourModel.js");
var PredefinedModel = require("./PredefinedModel.js");
var TexturesModel = require("./TexturesModel.js");

module.exports = {
	projectModel: new ProjectModel(),
	backgroundModel: new BackgroundModel(),
	particleModel: new ParticleModel(),
	behaviourModel: new BehaviourModel(),
	predefinedModel: new PredefinedModel(),
	texturesModel: new TexturesModel()
};