var FileService = require("./FileService.js");
var EventEmitter = require("eventemitter3");

module.exports = {
	msg: new EventEmitter(),
	file: new FileService()
};