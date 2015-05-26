var snow = require("../../assets/config/snow.json");

function PredefinedModel() {

}

PredefinedModel.prototype.getCurrent = function() {
	return snow;
};

module.exports = PredefinedModel;