var util = require("../../util");
var service = require("../../service");
var StageBackground = require("./StageBackground.js");

function Stage(rect) {
	PIXI.Container.call(this);
	util.bind(this);

	this.hitArea = rect;
	this.interactive = true;
	this.hasFocus = false;

	this.mouseover = function() {
		service.msg.emit("stage/mouseOver");
	};

	this.mouseout = function() {
		service.msg.emit("stage/mouseOut");
	};

	var background = this.addChild(new StageBackground());
	background.x = rect.width / 2;
	background.y = rect.height / 2;
}

util.inherit(Stage, PIXI.Container);

module.exports = Stage;