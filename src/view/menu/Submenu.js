var extension = require("../extension");
var service = require("../../service");

function SubMenu() {
	this.WIDTH = 200;
	service.msg.on("menu/created", this.onMenuCreated.bind(this));
}

SubMenu.prototype.onMenuCreated = function() {
};

SubMenu.prototype.bind = function(id, propertyName, getTargetFunction) {
	getTargetFunction = getTargetFunction || this.getBehaviour;

	$$(id).onChanged = function(newValue) {
		//console.log("onChanged", id, newValue, getTargetFunction());
		getTargetFunction()[propertyName] = newValue;
	};

	service.msg.on("emitter/changed", function() {
		//console.log("emitter/change", id, getTargetFunction()[propertyName]);

		var setValue = $$(id).config.setValue || $$(id).setValue;
		setValue(getTargetFunction()[propertyName], getTargetFunction());
		$$(id).refresh();
	});
};

SubMenu.prototype.onActive = function() {
	var rows = this.ui.rows;
	for (var i = 0; i < rows.length; i++) {
		$$(rows[i].id).refresh();
	}
};

SubMenu.prototype.getBehaviour = function() {
	throw new Error("Has to be overriden");
};

SubMenu.prototype.button = function(label, style) {
	return this._setup({view: "button", value: label}, style);
};

SubMenu.prototype.counter = function(label, style) {
	return this._setup({view: "counter", label: label}, style);
};

SubMenu.prototype.section = function(label) {
	return {view: "template", template: label, type: "section"};
	//return {view: "label", label: label, width: this.WIDTH, height: 30, align: "center"};
};

SubMenu.prototype.title = function(label) {
	//return {view: "template", template: label, width: this.WIDTH, type: "section"};
	return {view: "label", label: label, height: 30, align: "center"};
};

SubMenu.prototype.checkbox = function(label, style) {
	return this._setup({view: "checkbox", label: label}, style);
};

SubMenu.prototype.slider = function(title, style) {
	style = extension.slider(title, style);
	return this._setup({view: "slider"}, style);

};

SubMenu.prototype._setup = function(defaultStyle, extraStyle) {
	extraStyle = extraStyle || {};
	defaultStyle.width = this.WIDTH;
	defaultStyle.id = extraStyle.id || webix.uid();
	return Object.assign(defaultStyle, extraStyle);
};

module.exports = SubMenu;