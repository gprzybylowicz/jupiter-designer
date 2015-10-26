function EmissionModel() {

	this.emissions = {};

	for (var key in jupiter.EmissionTypes) {
		var name = jupiter.EmissionTypes[key];
		this.addEmission(new jupiter[name]);
	}

}

EmissionModel.prototype.addEmission = function(emission) {
	if (this.emissions[emission.getName()]) {
		this.emissions[emission.getName()] = null;
		delete this.emissions[emission.getName()];
	}

	this.emissions[emission.getName()] = emission;
};

EmissionModel.prototype.getEmissionByName = function(name) {
	if (!this.emissions[name]) {
		throw new Error("No behaviour by given name = " + name);
	}

	return this.emissions[name];
};

module.exports = EmissionModel;