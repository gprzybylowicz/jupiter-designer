function SubMenu() {
	this.WIDTH = 200;
}

SubMenu.prototype.button = function(label, style) {
	style = style || {};
	return this._merge({view: "button", value: label, width: this.WIDTH}, style);
};

SubMenu.prototype._merge = function(defaultStyle, extraStyle) {
	return Object.assign(defaultStyle, extraStyle || {});
};
module.exports = SubMenu;