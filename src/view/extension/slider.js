module.exports = function(title, style) {
	style = style || {};

	var step = style.step || 1;
	var min = style.min || 0;
	var max = style.max || 100;

	style.step = 1;
	style.title = title + " " + style.value;
	style.max = (max - min) / step;
	style.value = (style.value - min) / step;

	var update = function(slider, invokeOnChanged) {
		var value = ((slider.getValue() * step) + min).toFixed(step < 1 ? 2 : 0);
		slider.define("title", title + " " + value);
		slider.refresh();

		if (slider.onChanged && invokeOnChanged) {
			slider.onChanged(parseFloat(value));
		}
	};

	style.setValue = function(value) {
		$$(style.id).config.value = (value / step);
		update($$(style.id), false);
	};

	style.on = {
		onChange: function(){
			update(this, true);
		},
		onSliderDrag: function() {
			update(this, true);
		}
	};

	return style;
};