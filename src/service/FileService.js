function FileService() {

}

FileService.prototype.saveAsJson = function(name, data) {
	console.log("save as json", data);
	var blob = new Blob([JSON.stringify(data)], {type: "application/json"});
	saveAs(blob, name + ".json");
};

module.exports = FileService;