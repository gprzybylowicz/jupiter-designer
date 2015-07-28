function ProjectModel() {
	this.emitter = new jupiter.Emitter();
}

ProjectModel.prototype.hasActiveBehaviour = function(behaviour) {
	var behavious = this.emitter.behaviours.getAll();

	for (var i = 0; i < behavious.length; ++i) {
		if (behavious[i].getName() === behaviour.getName()) {
			return true;
		}
	}

	return false;
};

module.exports = ProjectModel;