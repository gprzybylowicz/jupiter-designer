var extension = require("../extension");

function SubMenu() {
	this.WIDTH = 200;
}

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
	var startValueTitle = style.value || 0;
	style = extension.slider(title, style);
	return this._setup({view: "slider", title: title + startValueTitle}, style);

};

SubMenu.prototype._setup = function(defaultStyle, extraStyle) {
	extraStyle = extraStyle || {};
	defaultStyle.width = this.WIDTH;
	defaultStyle.id = extraStyle.id || webix.uid();
	return Object.assign(defaultStyle, extraStyle);
};

module.exports = SubMenu;