function PredefinedModel() {
	this.configs = {};
}

PredefinedModel.prototype.add = function(name, config) {
	this.configs[name] = config;
};

PredefinedModel.prototype.getByName = function(name) {
	return this.configs[name];
};

PredefinedModel.prototype.getAllConfigs = function() {
	return this.configs; //todo: concat?
};

PredefinedModel.prototype.getNames = function() {
	return Object.keys(this.configs);
};

PredefinedModel.prototype.getConfigUrls = function() {
	return [
		"assets/config/default.jup",
		"assets/config/firework.jup",
		"assets/config/green_chaos.jup",
		"assets/config/radial.jup",
		"assets/config/random_emit_test.jup",
		"assets/config/radial_test_2.jup",
	];
};

module.exports = PredefinedModel;