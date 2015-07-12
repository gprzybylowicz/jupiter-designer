module.exports = function(title, style) {
	style = style || {};

	var step = style.step || 1;
	var min = style.min || 0;
	var max = style.max || 100;

	style.step = 1;
	style.title = title + " " + style.value;
	style.max = (max - min) / step;
	style.value = (style.value - min) / step;

	var update = function(slider) {
		var value = ((slider.getValue() * step) + min).toFixed(step < 1 ? 1 : 0);
		slider.define("title", title + " " + value);
		slider.refresh();

		if (slider.onChanged) {
			slider.onChanged(value);
		}
	};

	style.on = {
		onChange: function() {
			update(this);
		},
		onSliderDrag: function() {
			update(this);
		}
	};

	return style;
};