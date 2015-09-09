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
		"assets/config/firework.jup"
	];
};

module.exports = PredefinedModel;