function FileService() {

}

FileService.prototype.saveAsJson = function(name, data) {
	this.saveAs(name + ".json", data);
};

FileService.prototype.saveAs = function(name, data) {
	console.log("save as ", name, "data ", data);
	var blob = new Blob([JSON.stringify(data)], {type: "application/json"});
	saveAs(blob, name);
};

module.exports = FileService;