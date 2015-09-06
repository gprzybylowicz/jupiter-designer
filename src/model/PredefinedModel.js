var CONFIG = {
	default: require("../../assets/config/default.json"),
	snow: require("../../assets/config/snow.json"),
	snow2: require("../../assets/config/snow2.json"),
	test: require("../../assets/config/test.json")
};

function PredefinedModel() {

}

PredefinedModel.prototype.getByName = function(name) {
	return CONFIG[name];
};

PredefinedModel.prototype.getAllConfigs = function() {
	return CONFIG; //todo: concat?
};

PredefinedModel.prototype.getNames = function() {
	return Object.keys(CONFIG);
};

module.exports = PredefinedModel;