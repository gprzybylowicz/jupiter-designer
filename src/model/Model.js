var EventEmitter = require("eventemitter3");
var util = require("../util");

function Model() {
	EventEmitter.call(this);
	util.bind(this);
}

util.inherit(Model, EventEmitter);

Model.prototype.property = function(property, defaultValue) {
	var _value;
	Object.defineProperty(this, property, {
		get: function() {
			return _value;
		},
		set: function(value) {
			if (_value !== value) {
				var prev = _value;
				_value = value;
				this.emit(property + "/changed", value, prev);
			}
		}
	});

	if (defaultValue !== undefined) {
		this[property] = defaultValue;
	}
};

module.exports = Model;