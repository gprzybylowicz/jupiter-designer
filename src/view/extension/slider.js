var emptyFunction = function() {

};

module.exports = function(title, style) {
	style = style || {};
	style.on = style.on || {};

	var step = style.step || 1;
	var min = style.min || 0;
	var max = style.max || 100;

	style.step = 1;
	style.min = 0;
	style.max = (max - min) / step;
	style.value = style.value - min;

	var onChanged = style.onChanged || emptyFunction;

	var update = function() {
		var value = ((this.getValue() * step) + min).toFixed(step < 1 ? 1 : 0);
		this.define("title", title + " " + value);
		this.value = value;
		this.refresh();

	};

	style.update = update;

	style.on = {
		onChange: function() {
			update.call(this);
			onChanged.call(null, this);
		},
		onSliderDrag: function() {
			update.call(this);
			onChanged.call(null, this);
		}
	};

	return style;
};