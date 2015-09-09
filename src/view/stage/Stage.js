var util = require("../../util");
var service = require("../../service");
var StageBackground = require("./StageBackground.js");
var Marker = require("../Marker.js");
var projectModel = require("../../model").projectModel;

function Stage(rect) {
	PIXI.Container.call(this);
	util.bind(this);

	this.rect = rect;
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

	this.marker = this.addChild(new Marker(this.onMarkerDrag));
	projectModel.on("markerPosition/changed", this.onMarkerPositionChanged);

	this.onMarkerPositionChanged();
}

util.inherit(Stage, PIXI.Container);

Stage.prototype.onMarkerDrag = function(position) {
	projectModel.markerPositionInStageCoordinates = position;
};

Stage.prototype.onMarkerPositionChanged = function() {
	this.marker.position = projectModel.markerPositionInStageCoordinates;
};

module.exports = Stage;