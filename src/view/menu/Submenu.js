function SubMenu() {
	this.WIDTH = 200;
}

SubMenu.prototype.button = function(label, style) {
	return this._merge({view: "button", value: label, width: this.WIDTH}, style);
};

SubMenu.prototype.counter = function(label, style) {
	return this._merge({view: "counter", label: label, width: this.WIDTH}, style);
};

SubMenu.prototype.section = function(label) {
	return {view: "template", template: label, width: this.WIDTH, type: "section"};
	//return {view: "label", label: label, width: this.WIDTH, height: 30, align: "center"};
};

SubMenu.prototype.title = function(label) {
	//return {view: "template", template: label, width: this.WIDTH, type: "section"};
	return {view: "label", label: label, width: this.WIDTH, height: 30, align: "center"};
};

SubMenu.prototype.checkbox = function(label, style) {
	return this._merge({view: "checkbox", label: label}, style);
};

SubMenu.prototype.slider = function(title, style) {
	style = style || {};
	style.on = style.on || {};

	var step = style.step || 1;
	var min = style.min || 0;
	var max = style.max || 100;
	style.step = 1;
	style.min = 0;
	style.max = (max - min) / step;
	style.value = style.value / step;

	var onChange = style.on.onChange || function() {
		};
	var onSliderDrag = style.on.onSliderDrag || function() {
		};

	var update = function() {
		var value = ((this.getValue() * step) + min).toFixed(step < 1 ? 1 : 0);
		this.define("title", title + " " + value);
		this.value = value;
		this.refresh();

	};

	style.on = {
		onChange: function() {
			update.call(this);
			onChange.call(this);
		},
		onSliderDrag: function() {
			update.call(this);
			onSliderDrag.call(this);
		}
	};

	return this._merge({view: "slider", width: this.WIDTH, title: webix.template(title + " #value#")}, style);

};

SubMenu.prototype._merge = function(defaultStyle, extraStyle) {
	return Object.assign(defaultStyle, extraStyle || {});
};
module.exports = SubMenu;