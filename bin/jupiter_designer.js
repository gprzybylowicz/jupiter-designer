/**
 * @license
 * Compiled 2016-01-04T09:13:52.028Z
 *
 * jupiter.js is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license.php
 *
 *
 * The MIT License
 * 
 * Copyright (c) 2015-2016 Grzegorz Przybyłowicz
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 * 
 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var MainView = require("./view").MainView;
var texturesModel = require("./model").texturesModel;
var predefinedModel = require("./model").predefinedModel;

window.addEventListener("load", function() {

	//todo: extract
	PIXI.loader.use(function(resource, next) {
		if ((/\.(jup)$/i).test(resource.name)) {
			var start = resource.name.lastIndexOf("/") + 1;
			var end = resource.name.lastIndexOf(".");
			predefinedModel.add(resource.name.substring(start, end), JSON.parse(resource.data));
		}

		next();
	});
	PIXI.loader.add("assets/spritesheet.json");
	PIXI.loader.add(texturesModel.getTextureUrls());
	PIXI.loader.add(predefinedModel.getConfigUrls());
	PIXI.loader.once("complete", onLoaded);
	PIXI.loader.load();


	console.log(jupiter);
	function onLoaded() {
		texturesModel.setDefaultTexture();
		var mainView = new MainView();
	}
});




},{"./model":17,"./view":28}],2:[function(require,module,exports){
'use strict';

//
// We store our EE objects in a plain object whose properties are event names.
// If `Object.create(null)` is not supported we prefix the event names with a
// `~` to make sure that the built-in object properties are not overridden or
// used as an attack vector.
// We also assume that `Object.create(null)` is available when the event name
// is an ES6 Symbol.
//
var prefix = typeof Object.create !== 'function' ? '~' : false;

/**
 * Representation of a single EventEmitter function.
 *
 * @param {Function} fn Event handler to be called.
 * @param {Mixed} context Context for function execution.
 * @param {Boolean} once Only emit once
 * @api private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Minimal EventEmitter interface that is molded against the Node.js
 * EventEmitter interface.
 *
 * @constructor
 * @api public
 */
function EventEmitter() { /* Nothing to set */ }

/**
 * Holds the assigned EventEmitters by name.
 *
 * @type {Object}
 * @private
 */
EventEmitter.prototype._events = undefined;

/**
 * Return a list of assigned event listeners.
 *
 * @param {String} event The events that should be listed.
 * @param {Boolean} exists We only need to know if there are listeners.
 * @returns {Array|Boolean}
 * @api public
 */
EventEmitter.prototype.listeners = function listeners(event, exists) {
  var evt = prefix ? prefix + event : event
    , available = this._events && this._events[evt];

  if (exists) return !!available;
  if (!available) return [];
  if (available.fn) return [available.fn];

  for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
    ee[i] = available[i].fn;
  }

  return ee;
};

/**
 * Emit an event to all registered event listeners.
 *
 * @param {String} event The name of the event.
 * @returns {Boolean} Indication if we've emitted an event.
 * @api public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events || !this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if ('function' === typeof listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Register a new EventListener for the given event.
 *
 * @param {String} event Name of the event.
 * @param {Functon} fn Callback function.
 * @param {Mixed} context The context of the function.
 * @api public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  var listener = new EE(fn, context || this)
    , evt = prefix ? prefix + event : event;

  if (!this._events) this._events = prefix ? {} : Object.create(null);
  if (!this._events[evt]) this._events[evt] = listener;
  else {
    if (!this._events[evt].fn) this._events[evt].push(listener);
    else this._events[evt] = [
      this._events[evt], listener
    ];
  }

  return this;
};

/**
 * Add an EventListener that's only called once.
 *
 * @param {String} event Name of the event.
 * @param {Function} fn Callback function.
 * @param {Mixed} context The context of the function.
 * @api public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  var listener = new EE(fn, context || this, true)
    , evt = prefix ? prefix + event : event;

  if (!this._events) this._events = prefix ? {} : Object.create(null);
  if (!this._events[evt]) this._events[evt] = listener;
  else {
    if (!this._events[evt].fn) this._events[evt].push(listener);
    else this._events[evt] = [
      this._events[evt], listener
    ];
  }

  return this;
};

/**
 * Remove event listeners.
 *
 * @param {String} event The event we want to remove.
 * @param {Function} fn The listener that we need to find.
 * @param {Mixed} context Only remove listeners matching this context.
 * @param {Boolean} once Only remove once listeners.
 * @api public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events || !this._events[evt]) return this;

  var listeners = this._events[evt]
    , events = [];

  if (fn) {
    if (listeners.fn) {
      if (
           listeners.fn !== fn
        || (once && !listeners.once)
        || (context && listeners.context !== context)
      ) {
        events.push(listeners);
      }
    } else {
      for (var i = 0, length = listeners.length; i < length; i++) {
        if (
             listeners[i].fn !== fn
          || (once && !listeners[i].once)
          || (context && listeners[i].context !== context)
        ) {
          events.push(listeners[i]);
        }
      }
    }
  }

  //
  // Reset the array, or remove it completely if we have no more listeners.
  //
  if (events.length) {
    this._events[evt] = events.length === 1 ? events[0] : events;
  } else {
    delete this._events[evt];
  }

  return this;
};

/**
 * Remove all listeners or only the listeners for the specified event.
 *
 * @param {String} event The event want to remove all listeners for.
 * @api public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  if (!this._events) return this;

  if (event) delete this._events[prefix ? prefix + event : event];
  else this._events = prefix ? {} : Object.create(null);

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// This function doesn't apply anymore.
//
EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
  return this;
};

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
  module.exports = EventEmitter;
}

},{}],3:[function(require,module,exports){
var backgroundModel = require("../model").backgroundModel;
var service = require("../service");

function BackgroundMenuController() {
	service.msg.on("background/changeLocked", this.onChangeLocked);
	service.msg.on("background/changeColor", this.onChangeColor);
	service.msg.on("background/loadTexture", this.onLoadTexture);
	service.msg.on("background/removeTexture", this.onRemoveTexture);
}

BackgroundMenuController.prototype.onChangeLocked = function() {
	backgroundModel.isLocked = !backgroundModel.isLocked;
};

BackgroundMenuController.prototype.onChangeColor = function(value) {
	backgroundModel.color = value;
};

BackgroundMenuController.prototype.onLoadTexture = function() {
	var reader = new FileReader();
	reader.onload = function() {
		backgroundModel.texture = PIXI.Texture.fromImage(reader.result);
		document.getElementById("load-background").value = null;
	}.bind(this);

	reader.readAsDataURL(document.getElementById("load-background").files[0]);
};

BackgroundMenuController.prototype.onRemoveTexture = function() {
	backgroundModel.texture = null;
};
module.exports = BackgroundMenuController;
},{"../model":17,"../service":19}],4:[function(require,module,exports){
var projectModel = require("../model").projectModel;
var service = require("../service");
var util = require("../util");

function BehaviourController() {
	util.bind(this);
	service.msg.on("behaviour/setEnable", this.onSetEnable);
}

BehaviourController.prototype.onSetEnable = function(enable, behaviour) {
	if (enable) {
		this.enableBehaviour(behaviour);
	}
	else {
		this.disableBehaviour(behaviour);
	}
};

BehaviourController.prototype.enableBehaviour = function(behaviour) {
	if (!projectModel.hasActiveBehaviour(behaviour)) {
		projectModel.emitter.behaviours.add(behaviour);
	}
};

BehaviourController.prototype.disableBehaviour = function(behaviour) {
	var behaviours = projectModel.emitter.behaviours.getAll();
	projectModel.emitter.behaviours.clear();

	for (var i = 0; i < behaviours.length; ++i) {
		if (behaviours[i].getName() !== behaviour.getName()) {
			projectModel.emitter.behaviours.add(behaviours[i]);
		}
	}

};

module.exports = BehaviourController;

},{"../model":17,"../service":19,"../util":21}],5:[function(require,module,exports){
var projectModel = require("../model").projectModel;
var emissionModel = require("../model").emissionModel;
var service = require("../service");
var util = require("../util");

function EmissionController() {
	util.bind(this);
	service.msg.on("emission/change", this.onEmissionChanged);

	this.setEmissionByName(jupiter.EmissionTypes.DEFAULT);
}

EmissionController.prototype.onEmissionChanged = function(name) {
	if (projectModel.emitter.emitController.getName() !== name) {
		this.setEmissionByName(name);
	}
};

EmissionController.prototype.setEmissionByName = function(name) {
	var newController = emissionModel.getEmissionByName(name);
	projectModel.emitter.emitController = newController;
	projectModel.emitter.reset();
};

module.exports = EmissionController;

},{"../model":17,"../service":19,"../util":21}],6:[function(require,module,exports){
var file = require("../service").file;
var service = require("../service");
var projectModel = require("../model").projectModel;
var predefinedModel = require("../model").predefinedModel;
var behaviourModel = require("../model").behaviourModel;
var emissionModel = require("../model").emissionModel;
var texturesModel = require("../model").texturesModel;
var backgroundModel = require("../model").backgroundModel;

function ProjectMenuController() {
	service.msg.on("project/save", this.onSaveProject, this);
	service.msg.on("project/load", this.onLoadProject, this);
	service.msg.on("project/exportConfig", this.onExportConfig, this);
	service.msg.on("project/loadConfig", this.onLoadConfig, this);
	service.msg.on("project/loadPredefined", this.onLoadPredefined, this);

	projectModel.on("emitterConfig/changed", this.onEmitterConfigChanged, this);
	projectModel.on("emitterConfig/changed", this.refreshEmitController, this);
}

ProjectMenuController.prototype.onLoadProject = function() {
	var reader = new FileReader();
	reader.onload = function() {
		var data = JSON.parse(reader.result);
		this.loadProject(data);

	}.bind(this);

	reader.readAsText(document.getElementById("load-project").files[0]);
};

ProjectMenuController.prototype.loadProject = function(data) {
	projectModel.deserialize(data.project);
	texturesModel.deserialize(data.texture);
	backgroundModel.deserialize(data.background);

	service.msg.emit("project/loaded");
};

ProjectMenuController.prototype.onSaveProject = function() {
	var data = {};
	data.project = projectModel.serialize();
	data.texture = texturesModel.serialize();
	data.background = backgroundModel.serialize();

	file.saveAs("project.jup", data);
};

ProjectMenuController.prototype.onExportConfig = function() {
	file.saveAsJson("particle_config", projectModel.emitter.getParser().write());
};

ProjectMenuController.prototype.onLoadConfig = function() {
	var reader = new FileReader();
	reader.onload = function() {
		projectModel.setEmitterConfig(JSON.parse(reader.result));
	}.bind(this);

	reader.readAsText(document.getElementById("load-config").files[0]);
};

ProjectMenuController.prototype.reset = function() {
	this.onLoadPredefined("radial");
};

ProjectMenuController.prototype.onLoadPredefined = function(name) {
	this.loadProject(predefinedModel.getByName(name));
};
ProjectMenuController.prototype.onEmitterConfigChanged = function() {
	this.refreshBehaviours();
	this.refreshEmitController();
	service.msg.emit("emitter/changed");
};

ProjectMenuController.prototype.refreshBehaviours = function() {
	var behaviours = projectModel.emitter.behaviours.getAll();
	for (var i = 0; i < behaviours.length; i++) {
		behaviourModel.addBehaviour(behaviours[i]);
	}
};

ProjectMenuController.prototype.refreshEmitController = function() {
	emissionModel.addEmission(projectModel.emitter.emitController);
};

module.exports = ProjectMenuController;
},{"../model":17,"../service":19}],7:[function(require,module,exports){
var service = require("../service");
var texturesModel = require("../model").texturesModel;

function TextureMenuController() {
	service.msg.on("texture/change", this.onTextureChange);
	service.msg.on("texture/upload", this.onUploadTexture);
}

TextureMenuController.prototype.exportParticleTexture = function() {

};

TextureMenuController.prototype.onTextureChange = function(name) {
	texturesModel.setTextureByName(name);
};

TextureMenuController.prototype.onUploadTexture = function() {
	var reader = new FileReader();
	reader.onload = function() {
		texturesModel.setTexture(PIXI.Texture.fromImage(reader.result));
		document.getElementById("load-texture").value = null;

	}.bind(this);

	reader.readAsDataURL(document.getElementById("load-texture").files[0]);
};

module.exports = TextureMenuController;
},{"../model":17,"../service":19}],8:[function(require,module,exports){
var ProjectMenuController = require("./ProjectMenuController.js");
var TextureMenuController = require("./TextureMenuController.js");
var BackgroundMenuController = require("./BackgroundMenuController.js");
var BehaviourController = require("./BehaviourController.js");
var EmissionController = require("./EmissionController.js");

module.exports = {
	projectMenuController: new ProjectMenuController(),
	textureMenuController: new TextureMenuController(),
	backgroundMenuController: new BackgroundMenuController(),
	behaviourController: new BehaviourController(),
	emissionController: new EmissionController()
};
},{"./BackgroundMenuController.js":3,"./BehaviourController.js":4,"./EmissionController.js":5,"./ProjectMenuController.js":6,"./TextureMenuController.js":7}],9:[function(require,module,exports){
var Model = require("./Model.js");
var util = require("../util");

function BackgroundModel() {
	Model.call(this);

	this.property("color", 0x0000);
	this.property("isLocked", true);
	this.property("texture", null);
	this.property("imagePosition", new PIXI.Point(0, 0));
}

util.inherit(BackgroundModel, Model);

BackgroundModel.prototype.serialize = function() {
	var data = {};
	data.color = this.color;
	data.isLocked = this.isLocked;
	data.imagePosition = {x: this.imagePosition.x, y: this.imagePosition.y};
	if (this.texture) {
		data.textureUrl = this.texture.baseTexture.imageUrl;
	}

	return data;
};

BackgroundModel.prototype.deserialize = function(data) {
	this.color = data.color || 0x0000;
	this.isLocked = data.isLocked || true;
	this.imagePosition = new PIXI.Point(data.imagePosition.x, data.imagePosition.y);

	if (data.textureUrl) {
		this.texture = PIXI.Texture.fromImage(data.textureUrl);
	}
};

module.exports = BackgroundModel;
},{"../util":21,"./Model.js":12}],10:[function(require,module,exports){
function BehaviourModel() {

	this.behaviours = {};
	this.addBehaviour(new jupiter.LifeBehaviour());
	this.addBehaviour(new jupiter.PositionBehaviour());
	this.addBehaviour(new jupiter.ColorBehaviour());
	this.addBehaviour(new jupiter.SizeBehaviour());
	this.addBehaviour(new jupiter.AngularVelocityBehaviour());
	this.addBehaviour(new jupiter.EmitDirectionBehaviour());
	this.addBehaviour(new jupiter.RotationBehaviour());
}

BehaviourModel.prototype.addBehaviour = function(behaviour) {
	if (this.behaviours[behaviour.getName()]) {
		this.behaviours[behaviour.getName()] = null;
		delete this.behaviours[behaviour.getName()];
	}

	this.behaviours[behaviour.getName()] = behaviour;
};

BehaviourModel.prototype.getBehaviourByName = function(name) {
	if (!this.behaviours[name]) {
		throw new Error("No behaviour by given name = " + name);
	}

	return this.behaviours[name];
};

module.exports = BehaviourModel;
},{}],11:[function(require,module,exports){
function EmissionModel() {

	this.emissions = {};

	for (var key in jupiter.EmissionTypes) {
		var name = jupiter.EmissionTypes[key];
		this.addEmission(new jupiter[name]);
	}

}

EmissionModel.prototype.addEmission = function(emission) {
	if (this.emissions[emission.getName()]) {
		this.emissions[emission.getName()] = null;
		delete this.emissions[emission.getName()];
	}

	this.emissions[emission.getName()] = emission;
};

EmissionModel.prototype.getEmissionByName = function(name) {
	if (!this.emissions[name]) {
		throw new Error("No behaviour by given name = " + name);
	}

	return this.emissions[name];
};

module.exports = EmissionModel;
},{}],12:[function(require,module,exports){
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
},{"../util":21,"eventemitter3":2}],13:[function(require,module,exports){
function ParticleModel(){
	this.texture = null;
	this.name = null;
	this.predefined = false;
}


module.exports = ParticleModel;
},{}],14:[function(require,module,exports){
function PredefinedModel() {
	this.configs = {};
}

PredefinedModel.prototype.add = function(name, config) {
	this.configs[name] = config;
};

PredefinedModel.prototype.getByName = function(name) {
	return this.configs[name];
};

PredefinedModel.prototype.getAllConfigs = function() {
	return this.configs; //todo: concat?
};

PredefinedModel.prototype.getNames = function() {
	return Object.keys(this.configs);
};

PredefinedModel.prototype.getConfigUrls = function() {
	return [
		"assets/config/default.jup",
		"assets/config/firework.jup",
		"assets/config/green_chaos.jup",
		"assets/config/radial.jup",
		"assets/config/random_emit_test.jup",
		"assets/config/radial_test_2.jup",
	];
};

module.exports = PredefinedModel;
},{}],15:[function(require,module,exports){
var Model = require("./Model.js");
var util = require("../util");

function ProjectModel() {
	Model.call(this);

	this.stageSize = new PIXI.Point(600, 600);
	this.emitter = new jupiter.Emitter();
	this.property("markerPosition", new PIXI.Point(0.5, 0.5));
}

util.inherit(ProjectModel, Model);

ProjectModel.prototype.hasActiveBehaviour = function(behaviour) {
	var behavious = this.emitter.behaviours.getAll();

	for (var i = 0; i < behavious.length; ++i) {
		if (behavious[i].getName() === behaviour.getName()) {
			return true;
		}
	}

	return false;
};

ProjectModel.prototype.serialize = function() {
	var data = {};
	data.emitterConfig = this.emitter.getParser().write();
	data.markerPosition = {x: this.markerPosition.x, y: this.markerPosition.y};

	return data;
};

ProjectModel.prototype.deserialize = function(data) {
	this.markerPosition = new PIXI.Point(data.markerPosition.x, data.markerPosition.y);
	this.setEmitterConfig(data.emitterConfig);
};

ProjectModel.prototype.setEmitterConfig = function(config) {
	this.emitter.getParser().read(config);
	this.emit("emitterConfig/changed");
};

Object.defineProperty(ProjectModel.prototype, "markerPositionInStageCoordinates", {
	get: function() {
		return new PIXI.Point(this.markerPosition.x * this.stageSize.x, this.markerPosition.y * this.stageSize.y);
	},
	set: function(value) {
		this.markerPosition = new PIXI.Point(value.x / this.stageSize.x, value.y / this.stageSize.y);
	}
});
module.exports = ProjectModel;
},{"../util":21,"./Model.js":12}],16:[function(require,module,exports){
var Model = require("./Model.js");
var util = require("../util");

var PREDEFINED_TEXTURES = [
	{name: "flare_blue", url: "assets/flare_blue.png"},
	{name: "cloud", url: "assets/cloud.png"},
	{name: "cloud2", url: "assets/cloud2.png"},
	{name: "flare", url: "assets/flare.png"},
	{name: "sparkle", url: "assets/sparkle.png"},
	{name: "circle", url: "assets/circle.png"}
];

function TexturesModel() {
	Model.call(this);

	this.textures = PREDEFINED_TEXTURES.concat();
	this.currentTextureName = null;
	this.property("currentTexture", null);
}

util.inherit(TexturesModel, Model);

TexturesModel.prototype.setDefaultTexture = function() {
	this.setTextureByName("circle");
};

TexturesModel.prototype.setTextureByName = function(name) {
	var url;
	for (var i = 0; i < this.textures.length; i++) {
		if (this.textures[i].name === name) {
			url = this.textures[i].url;
		}
	}
	this.currentTextureName = name;
	this.currentTexture = PIXI.Texture.fromFrame(url);
};

TexturesModel.prototype.setTexture = function(texture) {
	this.currentTextureName = null;
	this.currentTexture = texture;
};

TexturesModel.prototype.getCurrentTexture = function() {
	return this.currentTexture;
};

TexturesModel.prototype.getTextures = function() {
	return this.textures;
};

TexturesModel.prototype.getTextureUrls = function() {
	return this.getTextures().map(function(texture) {
		return texture.url;
	});
};

TexturesModel.prototype.serialize = function() {
	return {name: this.currentTextureName, url: this.currentTexture.baseTexture.imageUrl};
};

TexturesModel.prototype.deserialize = function(data) {
	if (data.name) {
		this.setTextureByName(data.name);
	}
	else {
		this.setTexture(PIXI.Texture.fromImage(data.url));
	}
};

module.exports = TexturesModel;
},{"../util":21,"./Model.js":12}],17:[function(require,module,exports){
var ProjectModel = require("./ProjectModel.js");
var BackgroundModel = require("./BackgroundModel.js");
var ParticleModel = require("./ParticleModel.js");
var BehaviourModel = require("./BehaviourModel.js");
var PredefinedModel = require("./PredefinedModel.js");
var TexturesModel = require("./TexturesModel.js");
var EmissionModel = require("./EmissionModel.js");

module.exports = {
	projectModel: new ProjectModel(),
	particleModel: new ParticleModel(),
	behaviourModel: new BehaviourModel(),
	predefinedModel: new PredefinedModel(),
	texturesModel: new TexturesModel(),
	backgroundModel: new BackgroundModel(),
	emissionModel: new EmissionModel()
};
},{"./BackgroundModel.js":9,"./BehaviourModel.js":10,"./EmissionModel.js":11,"./ParticleModel.js":13,"./PredefinedModel.js":14,"./ProjectModel.js":15,"./TexturesModel.js":16}],18:[function(require,module,exports){
function FileService() {

}

FileService.prototype.saveAsJson = function(name, data) {
	this.saveAs(name + ".json", data);
};

FileService.prototype.saveAs = function(name, data) {
	console.log("save as ", name, "data ", data);
	var blob = new Blob([JSON.stringify(data)], {type: "application/json"});
	saveAs(blob, name);
};

module.exports = FileService;
},{}],19:[function(require,module,exports){
var FileService = require("./FileService.js");
var EventEmitter = require("eventemitter3");

module.exports = {
	msg: new EventEmitter(),
	file: new FileService()
};
},{"./FileService.js":18,"eventemitter3":2}],20:[function(require,module,exports){
module.exports = function(scope) {
	for (var i in scope) {
		if (typeof scope[i] === "function") {
			scope[i] = scope[i].bind(scope);
		}
	}
};
},{}],21:[function(require,module,exports){
module.exports = {
	inherit: require("./inherit.js"),
	bind: require("./bind.js")
};
},{"./bind.js":20,"./inherit.js":22}],22:[function(require,module,exports){
module.exports = function(childClass, baseClass) {
	childClass.prototype = Object.create(baseClass.prototype);
	childClass.prototype.constructor = childClass;
};
},{}],23:[function(require,module,exports){
var Menu = require("./menu/Menu.js");
var ParticleView = require("./ParticleView.js");
var Stage = require("./stage/Stage.js");
var backgroundModel = require("../model").backgroundModel;
var service = require("../service");

function MainView() {
	this.renderer = this.createRenderer();
	this.stage = this.createStage();
	this.stats = this.createStats();
	this.particleView = this.createParticleView();
	this.menu = this.createMenu();

	service.msg.emit("project/loadPredefined", "default");
	this.draw();
}

MainView.prototype.createStage = function() {
	//todo: size from 
	return new Stage(new PIXI.Rectangle(0, 0, 600, 600));
};

MainView.prototype.createRenderer = function() {
	//todo: autodetect renderer
	//todo: dynamic size of renderer
	var renderer = new PIXI.WebGLRenderer(600, 600);
	document.getElementById("stage").appendChild(renderer.view);

	backgroundModel.on("color/changed", function(value) {
		renderer.backgroundColor = value;
	});
	return renderer;
};

MainView.prototype.createStats = function() {
	var stats = new Stats();
	stats.domElement.style.position = "absolute";
	stats.domElement.style.left = "0px";
	stats.domElement.style.top = "0px";
	document.body.appendChild(stats.domElement);
	return stats;
};

MainView.prototype.createMenu = function() {
	return new Menu();
};

MainView.prototype.createParticleView = function() {
	return this.stage.addChild(new ParticleView());
};

MainView.prototype.draw = function() {
	PIXI.ticker.shared.add(function() {
		this.stats.begin();
		this.renderer.render(this.stage);
		this.stats.end();
	}, this);
};

module.exports = MainView;
},{"../model":17,"../service":19,"./ParticleView.js":25,"./menu/Menu.js":36,"./stage/Stage.js":46}],24:[function(require,module,exports){
var util = require("../util");
var service = require("../service");

function Marker(onDrag) {
	PIXI.Container.call(this);
	util.bind(this);

	this.onDrag = onDrag;
	this.interactive = true;
	this.buttonMode = true;
	this.dragging = false;
	this.image = this.createImage();

	this.mousedown = this.touchstart = this.onMouseDown;
	this.mouseup = this.mouseupoutside = this.touchend = this.touchendoutside = this.onMouseUp;
	this.mousemove = this.touchmove = this.onMouseMove;

	service.msg.on("stage/mouseOver", this.onMouseOverStage);
	service.msg.on("stage/mouseOut", this.onMouseOutStage);
}

util.inherit(Marker, PIXI.Container);

Marker.prototype.createImage = function() {
	var image = PIXI.Sprite.fromFrame("marker.png");
	image.anchor.set(0.5, 0.5);
	image.alpha = 0.7;

	return this.addChild(image);
};

Marker.prototype.onMouseDown = function() {
	this.dragging = true;
};

Marker.prototype.onMouseUp = function() {
	this.dragging = false;
};

Marker.prototype.onMouseMove = function(event) {
	if (this.dragging) {
		var newPosition = event.data.getLocalPosition(this.parent);
		this.onDrag(newPosition);
	}
};

Marker.prototype.onMouseOverStage = function() {
	this.image.alpha = 0.5;
};

Marker.prototype.onMouseOutStage = function() {
	this.image.alpha = 0.2;
};

module.exports = Marker;
},{"../service":19,"../util":21}],25:[function(require,module,exports){
var util = require("../util");
var service = require("../service");
var projectModel = require("../model").projectModel;
var texturesModel = require("../model").texturesModel;

function ParticleView() {
	PIXI.Container.call(this);
	util.bind(this);

	var renderer = new jupiter.Renderer(projectModel.emitter, texturesModel.getCurrentTexture());
	this.renderer = this.addChild(renderer);

	projectModel.on("markerPosition/changed", this.refreshRendererPosition);
	texturesModel.on("currentTexture/changed", this.onTextureChanged);
	service.msg.on("project/loaded", this.onProjectLoaded);
	projectModel.emitter.on("emitter/complete", this.onComplete);

	this.refreshRendererPosition();
}

util.inherit(ParticleView, PIXI.Container);

ParticleView.prototype.refreshRendererPosition = function() {
	this.renderer.position = projectModel.markerPositionInStageCoordinates;
};

ParticleView.prototype.onTextureChanged = function() {
	this.renderer.texture = texturesModel.getCurrentTexture();
};

ParticleView.prototype.onProjectLoaded = function() {
	projectModel.emitter.reset();
};

ParticleView.prototype.onComplete = function() {
	projectModel.emitter.resetAndPlay();
};

module.exports = ParticleView;


},{"../model":17,"../service":19,"../util":21}],26:[function(require,module,exports){
module.exports = {
	slider: require("./slider.js")
};
},{"./slider.js":27}],27:[function(require,module,exports){
module.exports = function(title, style) {
	style = style || {};

	var step = style.step || 1;
	var min = style.min || 0;
	var max = style.max || 100;

	style.step = 1;
	style.title = title + " " + style.value;
	style.min = min / step;
	style.max = max / step;
	style.value = (style.value - min) / step;

	var update = function(slider, invokeOnChanged) {
		var value = ((slider.getValue() * step)).toFixed(step < 1 ? 2 : 0);
		slider.define("title", title + " " + value);
		slider.refresh();

		if (slider.onChanged && invokeOnChanged) {
			slider.onChanged(parseFloat(value));
		}
	};

	style.setValue = function(value) {
		$$(style.id).config.value = ((value) / step);
		update($$(style.id), false);
	};

	style.on = {
		onChange: function() {
			update(this, true);
		},
		onSliderDrag: function() {
			update(this, true);
		}
	};

	return style;
};
},{}],28:[function(require,module,exports){
module.exports = {
	menu: require("./menu"),
	MainView: require("./MainView.js")
};
},{"./MainView.js":23,"./menu":45}],29:[function(require,module,exports){
var SubMenu = require("./SubMenu.js");
var inherit = require("../../util").inherit;
var bind = require("../../util").bind;
var behaviourModel = require("../../model").behaviourModel;
var projectModel = require("../../model").projectModel;
var service = require("../../service");

function AngularVelocityMenu() {
	SubMenu.call(this);
	bind(this);

	this.ui = {
		rows: [
			this.checkbox("Enabled: ", {id: "angular_velocity_enable", value: 0}),
			this.rangedSlider("degrees", "Degrees/sec:"),
			this.rangedSlider("degrees_variance", "Degrees variance/sec:"),
			this.rangedSlider("max_radius", "Max radius:"),
			this.rangedSlider("max_radius_variance", "Max radius variance:"),
			this.rangedSlider("min_radius", "Min radius:"),
			this.rangedSlider("min_radius_variance", "Min radius variance:")
		]
	};
}

inherit(AngularVelocityMenu, SubMenu);

AngularVelocityMenu.prototype.rangedSlider = function(id, label) {
	var slider = this.slider(label, {
		id: id,
		labelWidth: 30,
		min: -1000,
		max: 1000,
		step: 0.01,
		value: 0
	});

	return slider;
};

AngularVelocityMenu.prototype.onMenuCreated = function() {
	this.bind("degrees", "degrees");
	this.bind("degrees_variance", "degreesVariance");

	this.bind("max_radius", "maxRadius");
	this.bind("max_radius_variance", "maxRadiusVariance");

	this.bind("min_radius", "minRadius");
	this.bind("min_radius_variance", "minRadiusVariance");

	$$("angular_velocity_enable").attachEvent("onChange", this.onEnableChanged);
	service.msg.on("emitter/changed", this.onEmitterChanged);
};

AngularVelocityMenu.prototype.onEnableChanged = function(value) {
	service.msg.emit("behaviour/setEnable", value, this.getBehaviour());
};

AngularVelocityMenu.prototype.onEmitterChanged = function() {
	$$("angular_velocity_enable").setValue(projectModel.hasActiveBehaviour(this.getBehaviour()));
};

AngularVelocityMenu.prototype.getBehaviour = function() {
	return behaviourModel.getBehaviourByName("AngularVelocityBehaviour");
};

module.exports = AngularVelocityMenu;



},{"../../model":17,"../../service":19,"../../util":21,"./SubMenu.js":43}],30:[function(require,module,exports){
var SubMenu = require("./SubMenu.js");
var util = require("../../util");
var service = require("../../service");
var backgroundModel = require("../../model").backgroundModel;

function BackgroundMenu() {
	SubMenu.call(this);
	util.bind(this);

	this.ui = {
		rows: [
			this.checkbox("Locked: ", {id: "lock_enable", value: backgroundModel.isLocked}),
			this.button("Load image", {click: this.onLoadImage}),
			this.button("Remove background", {click: this.onRemoveBackground}),
			{view: "colorpicker", id: "background_color", label: "Color", name: "color", value: "#00000"}
		]
	};
}

util.inherit(BackgroundMenu, SubMenu);

BackgroundMenu.prototype.onMenuCreated = function() {
	$$("background_color").attachEvent("onChange", this.onColorChanged);
	$$("lock_enable").attachEvent("onChange", this.onLockChanged);

	//todo: refactor

	document.getElementById("load-background").onchange = function() {
		service.msg.emit("background/loadTexture");
	};
};

BackgroundMenu.prototype.onColorChanged = function() {
	var value = $$("background_color").getValue().replace("#", "0x");
	service.msg.emit("background/changeColor", value);
};

BackgroundMenu.prototype.onLoadImage = function() {
	document.getElementById("load-background").click();
};

BackgroundMenu.prototype.onRemoveBackground = function() {
	service.msg.emit("background/removeTexture");
};

BackgroundMenu.prototype.onLockChanged = function() {
	service.msg.emit("background/changeLocked");
};
module.exports = BackgroundMenu;
},{"../../model":17,"../../service":19,"../../util":21,"./SubMenu.js":43}],31:[function(require,module,exports){
var SubMenu = require("./SubMenu.js");
var util = require("../../util");
var behaviourModel = require("../../model").behaviourModel;
var projectModel = require("../../model").projectModel;
var service = require("../../service");

function ColorMenu() {
	SubMenu.call(this);
	util.bind(this);

	this.ui = {
		rows: [
			this.checkbox("Enabled:", {id: "color_enable", value: 0}),
			this.section("Start:"),
			{view: "template", content: "start_color", autoheight: true},
			this.section("End:"),
			{view: "template", content: "end_color", autoheight: true},
			this.section("Start variance:"),
			this.colorSlider("start_variance_r", "R:"),
			this.colorSlider("start_variance_g", "G:"),
			this.colorSlider("start_variance_b", "B:"),
			this.slider("", {id: "start_variance_alpha", label: "A:", labelWidth: 30, min: 0, max: 1, step: 0.01, value: 0}),
			this.section("End variance:"),
			this.colorSlider("end_variance_r", "R:"),
			this.colorSlider("end_variance_g", "G:"),
			this.colorSlider("end_variance_b", "B:"),
			this.slider("", {id: "end_variance_alpha", label: "A:", labelWidth: 30, min: 0, max: 1, step: 0.01, value: 0})

		]
	};

	var startColor = $("#start_color_input");
	var startColorInfo = $("#start_color_info");
	startColor.spectrum(this.getColorPickerConfig());

	this.getStartColor = function() {
		return startColor;
	};
	this.getStartColorInfo = function() {
		return startColorInfo;
	};

	var endColor = $("#end_color_input");
	var endColorInfo = $("#end_color_info");
	endColor.spectrum(this.getColorPickerConfig());

	this.getEndColor = function() {
		return endColor;
	};

	this.getEndColorInfo = function() {
		return endColorInfo;
	};
}

util.inherit(ColorMenu, SubMenu);

ColorMenu.prototype.getColorPickerConfig = function() {
	return {
		color: "#ffffff",
		showInput: true,
		showAlpha: true,
		preferredFormat: "hex",
		clickoutFiresChange: true,
	};
};

ColorMenu.prototype.colorSlider = function(id, label) {
	return this.slider.call(this, "", {
		id: id, label: label, labelWidth: 30, min: 0, max: 255, step: 1, value: 0
	});
};

ColorMenu.prototype.onMenuCreated = function() {
	this.bind("start_variance_r", "r", this.getStartVariance);
	this.bind("start_variance_g", "g", this.getStartVariance);
	this.bind("start_variance_b", "b", this.getStartVariance);
	this.bind("start_variance_alpha", "alpha", this.getStartVariance);

	this.bind("end_variance_r", "r", this.getEndVariance);
	this.bind("end_variance_g", "g", this.getEndVariance);
	this.bind("end_variance_b", "b", this.getEndVariance);
	this.bind("end_variance_alpha", "alpha", this.getEndVariance);

	$$("color_enable").attachEvent("onChange", this.onEnableChanged);
	service.msg.on("emitter/changed", this.onEmitterChanged);

	this.getStartColor().on("move.spectrum", this.onStartColorChanged);
	this.getStartColor().on("hide.spectrum", this.onStartColorChanged);
	this.getEndColor().on("move.spectrum", this.onEndColorChanged);
	this.getEndColor().on("hide.spectrum", this.onEndColorChanged);

};

ColorMenu.prototype.onStartColorChanged = function() {
	var color = this.getStartColor().spectrum("get").toRgb();
	this.getBehaviour().start.set(color.r, color.g, color.b, color.a);
};

ColorMenu.prototype.onEndColorChanged = function() {
	var color = this.getEndColor().spectrum("get").toRgb();
	this.getBehaviour().end.set(color.r, color.g, color.b, color.a);
};

ColorMenu.prototype.onEnableChanged = function(value) {
	service.msg.emit("behaviour/setEnable", value, this.getBehaviour());
};

ColorMenu.prototype.onEmitterChanged = function() {
	$$("color_enable").setValue(projectModel.hasActiveBehaviour(this.getBehaviour()));

	this.getStartColor().spectrum("set", "#" + this.getBehaviour().start.hex.toString(16));
	this.getEndColor().spectrum("set", "#" + this.getBehaviour().end.hex.toString(16));

	this.refreshColorInfo();
};

ColorMenu.prototype.refreshColorInfo = function() {
	this.getStartColorInfo().text(this.getStartColor().spectrum("get").toRgbString());
	this.getEndColorInfo().text(this.getEndColor().spectrum("get").toRgbString());
};

ColorMenu.prototype.getStartVariance = function() {
	return this.getBehaviour().startVariance;
};

ColorMenu.prototype.getEndVariance = function() {
	return this.getBehaviour().endVariance;
};

ColorMenu.prototype.getBehaviour = function() {
	return behaviourModel.getBehaviourByName(jupiter.BehaviourNames.COLOR_BEHAVIOUR);
};

module.exports = ColorMenu;



},{"../../model":17,"../../service":19,"../../util":21,"./SubMenu.js":43}],32:[function(require,module,exports){
var SubMenu = require("./SubMenu.js");
var util = require("../../util");
var service = require("../../service");
var emissionModel = require("../../model").emissionModel;

function DefaultEmissionMenu() {
	SubMenu.call(this);
	util.bind(this);

	this.ui = {
		id: "default_emit_controller_menu",
		rows: [
			this.counter("Emit/sec:", {
				id: "emit_per_second",
				step: 0.1, value: 0, min: 0, max: 200, align: "center", format: webix.i18n.numberFormat
			})
		]
	};
}

util.inherit(DefaultEmissionMenu, SubMenu);

DefaultEmissionMenu.prototype.onActive = function() {
	this.onEmitterChanged();

	$$("emit_per_second").attachEvent("onChange", this.onEmitPerSecondChanged);
};

DefaultEmissionMenu.prototype.onDestroy = function() {
	$$("emit_per_second").detachEvent("onChange", this.onEmitPerSecondChanged);
};

DefaultEmissionMenu.prototype.onEmitPerSecondChanged = function(value) {
	this.getController().emitPerSecond = value;
};

DefaultEmissionMenu.prototype.onEmitterChanged = function() {
	$$("emit_per_second").setValue(this.getController().emitPerSecond);
};

DefaultEmissionMenu.prototype.getController = function() {
	return emissionModel.getEmissionByName(jupiter.EmissionTypes.DEFAULT);
};

module.exports = DefaultEmissionMenu;
},{"../../model":17,"../../service":19,"../../util":21,"./SubMenu.js":43}],33:[function(require,module,exports){
var SubMenu = require("./SubMenu.js");
var util = require("../../util");
var service = require("../../service");
var behaviourModel = require("../../model").behaviourModel;
var projectModel = require("../../model").projectModel;

function EmitDirectionMenu() {
	SubMenu.call(this);
	util.bind(this);

	this.ui = {
		rows: [
			this.checkbox("Enabled: ", {id: "emit_angle_enable", value: 0}),
			this.slider("Angle:", {
				id: "emit_angle", min: 0, max: 360, step: 1, value: 0
			}),
			this.slider("Variance:", {
				id: "emit_angle_variance", min: 0, max: 360, step: 1, value: 0
			})
		]
	};
}

util.inherit(EmitDirectionMenu, SubMenu);

EmitDirectionMenu.prototype.onMenuCreated = function() {
	this.bind("emit_angle", "angleInDegrees");
	this.bind("emit_angle_variance", "varianceInDegrees");

	$$("emit_angle_enable").attachEvent("onChange", this.onEnableChanged);
	service.msg.on("emitter/changed", this.onEmitterChanged);

};

EmitDirectionMenu.prototype.onEnableChanged = function(value) {
	service.msg.emit("behaviour/setEnable", value, this.getBehaviour());
};

EmitDirectionMenu.prototype.onEmitterChanged = function() {
	$$("emit_angle_enable").setValue(projectModel.hasActiveBehaviour(this.getBehaviour()));
};

EmitDirectionMenu.prototype.getBehaviour = function() {
	return behaviourModel.getBehaviourByName(jupiter.BehaviourNames.EMIT_DIRECTION);
};

module.exports = EmitDirectionMenu;
},{"../../model":17,"../../service":19,"../../util":21,"./SubMenu.js":43}],34:[function(require,module,exports){
var SubMenu = require("./SubMenu.js");
var LifeMenu = require("./LifeMenu.js");
var EmitDirectionMenu = require("./EmitDirectionMenu.js");
var DefaultEmissionMenu = require("./DefaultEmissionMenu.js");
var RandomEmissionMenu = require("./RandomEmissionMenu.js");
var StandardEmissionMenu = require("./StandardEmissionMenu.js");
var util = require("../../util");
var service = require("../../service");
var projectModel = require("../../model").projectModel;

function GeneralMenu() {
	SubMenu.call(this);
	util.bind(this);

	this.lifeMenu = new LifeMenu();
	this.emitDirectionMenu = new EmitDirectionMenu();
	this.emissionMenus = this.getEmissionMenus();
	this.currentControllerMenu = null;

	this.ui = {
		rows: [
			this.section("Emission type:"),
			this.getEmissionMenu(),
			this.section("Duration:"),
			{id: "duration", view: "text", value: -1, label: "Duration", labelAlign: "left"},
			this.section("Life:"),
			this.lifeMenu.ui,
			this.section("Emission direction:"),
			this.emitDirectionMenu.ui
		]
	};
}

util.inherit(GeneralMenu, SubMenu);

GeneralMenu.prototype.getEmissionMenus = function() {
	return [
		{name: jupiter.EmissionTypes.DEFAULT, menu: new DefaultEmissionMenu()},
		{name: jupiter.EmissionTypes.RANDOM, menu: new RandomEmissionMenu()},
		{name: jupiter.EmissionTypes.UNIFORM, menu: new StandardEmissionMenu()}
	];
};

GeneralMenu.prototype.getEmissionNames = function() {
	return this.getEmissionMenus().map(function(menu) {
		return menu.name;
	});
};

GeneralMenu.prototype.getEmitControllerMenuByName = function(name) {
	var index = this.getEmissionNames().indexOf(name);
	return this.getEmissionMenus()[index].menu;
};

GeneralMenu.prototype.getEmissionMenu = function() {
	return {
		view: "menu",
		id: "emission_menu",
		subMenuPos: "right",
		layout: "y",
		height: 30,

		data: [{
			id: "emission_menu_item",
			value: "Select emit settings",
			submenu: this.getEmissionNames(true),
			config: {
				width: 200,
				on: {onItemClick: this.setEmissionMenu}
			}
		}],
		type: {subsign: true, height: 50,}
	};
};

GeneralMenu.prototype.onActive = function() {
	SubMenu.prototype.onActive.call(this);
	this.lifeMenu.onActive();
	this.emitDirectionMenu.onActive();
};

GeneralMenu.prototype.onMenuCreated = function() {
	this.setEmissionMenu(this.getEmissionNames()[0]);

	$$("duration").attachEvent("onChange", this.onDurationChanged);
	service.msg.on("emitter/changed", this.onEmitterChanged);
};

GeneralMenu.prototype.setEmissionMenu = function(name) {
	if (this.currentControllerMenu) {
		this.currentControllerMenu.onDestroy();
		$$(this.ui.id).removeView(this.currentControllerMenu.ui.id);
	}

	this.currentControllerMenu = this.getEmitControllerMenuByName(name);
	$$(this.ui.id).addView(this.currentControllerMenu.ui, 2);
	this.currentControllerMenu.onActive();
	$$("emission_menu").getMenuItem("emission_menu_item").value = name;
	$$("emission_menu").refresh();
	this.onActive();

	service.msg.emit("emission/change", name);

};

GeneralMenu.prototype.onDurationChanged = function(value) {
	value = parseFloat(value);
	if (!isNaN(value)) {
		projectModel.emitter.duration.maxTime = value;
	}

	$$("duration").setValue(projectModel.emitter.duration.maxTime);
};

GeneralMenu.prototype.onEmitterChanged = function() {
	$$("duration").setValue(projectModel.emitter.duration.maxTime);
	this.setEmissionMenu(projectModel.emitter.emitController.getName());
};

module.exports = GeneralMenu;
},{"../../model":17,"../../service":19,"../../util":21,"./DefaultEmissionMenu.js":32,"./EmitDirectionMenu.js":33,"./LifeMenu.js":35,"./RandomEmissionMenu.js":39,"./StandardEmissionMenu.js":42,"./SubMenu.js":43}],35:[function(require,module,exports){
var SubMenu = require("./SubMenu.js");
var util = require("../../util");
var service = require("../../service");
var behaviourModel = require("../../model").behaviourModel;

function LifeMenu() {
	SubMenu.call(this);

	this.ui = {
		rows: [
			this.slider("Life time:", {
				id: "life_slider_time", min: 0, max: 10, step: 0.1, value: 5
			}),
			this.slider("Life variance:", {
				id: "life_slider_variance", min: 0, max: 10, step: 0.1, value: 0
			})
		]
	};
}

util.inherit(LifeMenu, SubMenu);

LifeMenu.prototype.onMenuCreated = function() {
	this.bind("life_slider_time", "maxLifeTime");
	this.bind("life_slider_variance", "timeVariance");

	service.msg.emit("behaviour/setEnable", true, this.getBehaviour());

};

LifeMenu.prototype.getBehaviour = function() {
	return behaviourModel.getBehaviourByName(jupiter.BehaviourNames.LIFE_BEHAVIOUR);
};

module.exports = LifeMenu;
},{"../../model":17,"../../service":19,"../../util":21,"./SubMenu.js":43}],36:[function(require,module,exports){
var ProjectMenu = require("./ProjectMenu.js");
var TextureMenu = require("./TextureMenu.js");
var BackgroundMenu = require("./BackgroundMenu.js");
var ColorMenu = require("./ColorMenu.js");
var AngularVelocityMenu = require("./AngularVelocityMenu.js");
var PositionMenu = require("./PositionMenu.js");
var SizeMenu = require("./SizeMenu.js");
var RotationMenu = require("./RotationMenu.js");
var GeneralMenu = require("./GeneralMenu.js");
var service = require("../../service");

function Menu() {

	var subMenus = [
		{value: "Project", view: new ProjectMenu()},
		{value: "Texture", view: new TextureMenu()},
		{value: "Background", view: new BackgroundMenu()},
		{$template: "Separator"},
		{value: "General", view: new GeneralMenu()},
		{value: "Color", view: new ColorMenu()},
		{value: "Position", view: new PositionMenu()},
		{value: "Angular Velocity", view: new AngularVelocityMenu()},
		{value: "Size", view: new SizeMenu()},
		{value: "Rotation", view: new RotationMenu()}
	];

	var menu = {
		view: "menu", id: "m1",
		layout: "y", width: 200,
		height: window.innerHeight,
		select: true,
		data: subMenus,
		on: {
			onMenuItemClick: this.onMenuItemClick.bind(this)
		}
	};

	var uiColumns = [menu];
	for (var i = 0; i < subMenus.length; i++) {
		var subMenu = subMenus[i];
		if (subMenu.view) {
			subMenu.view.ui.id = "submenu" + i;
			subMenu.view.ui.batch = i.toString();
			uiColumns.push(subMenu.view.ui);
		}
	}

	uiColumns.push({body: {content: "stage"}});

	this.ui = webix.ui({
		type: "space",
		visibleBatch: "1",
		cols: uiColumns
	});

	webix.event(window, "resize", function() {
		$$("m1").define("height", window.innerHeight);
	}.bind(this));

	service.msg.emit("menu/created");
}

Menu.prototype.onMenuItemClick = function(id) {
	var item = $$("m1").getMenuItem(id);
	this.ui.showBatch(item.view.ui.batch);
	item.view.onActive();
};
module.exports = Menu;
},{"../../service":19,"./AngularVelocityMenu.js":29,"./BackgroundMenu.js":30,"./ColorMenu.js":31,"./GeneralMenu.js":34,"./PositionMenu.js":37,"./ProjectMenu.js":38,"./RotationMenu.js":40,"./SizeMenu.js":41,"./TextureMenu.js":44}],37:[function(require,module,exports){
var SubMenu = require("./SubMenu.js");
var inherit = require("../../util").inherit;
var bind = require("../../util").bind;
var behaviourModel = require("../../model").behaviourModel;
var projectModel = require("../../model").projectModel;
var service = require("../../service");

function PositionMenu() {
	SubMenu.call(this);
	bind(this);

	this.ui = {
		rows: [
			this.checkbox("Enabled: ", {id: "position_enable", value: 0}),
			this.section("Position: "),
			this.positionSlider("position_x", "X: "),
			this.positionSlider("position_y", "Y: "),
			this.varianceSlider("position_variance_x", "Variance X: "),
			this.varianceSlider("position_variance_y", "Variance Y: "),
			this.section("Velocity: "),
			this.positionSlider("velocity_x", "X: "),
			this.positionSlider("velocity_y", "Y: "),
			this.varianceSlider("velocity_variance_x", "Variance X: "),
			this.varianceSlider("velocity_variance_y", "Variance Y: "),
			this.section("Acceleration/Gravity:"),
			this.positionSlider("acceleration_x", "X: "),
			this.positionSlider("acceleration_y", "Y: "),
			this.varianceSlider("acceleration_variance_x", "Variance X: "),
			this.varianceSlider("acceleration_variance_y", "Variance Y: ")

		]
	};
}

inherit(PositionMenu, SubMenu);

PositionMenu.prototype.positionSlider = function(id, label) {
	var slider = this.slider(label, {
		id: id,
		labelWidth: 30,
		min: -500,
		max: 500,
		step: 1,
		value: 0
	});

	return slider;
};

PositionMenu.prototype.varianceSlider = function(id, label) {
	var slider = this.slider(label, {
		id: id,
		labelWidth: 30,
		min: 0,
		max: 500,
		step: 1,
		value: 0
	});

	return slider;
};

PositionMenu.prototype.onMenuCreated = function() {
	this.bind("position_x", "x", this.getPosition);
	this.bind("position_y", "y", this.getPosition);
	this.bind("position_variance_x", "x", this.getPositionVariance);
	this.bind("position_variance_y", "y", this.getPositionVariance);

	this.bind("velocity_x", "x", this.getVelocity);
	this.bind("velocity_y", "y", this.getVelocity);
	this.bind("velocity_variance_x", "x", this.getVelocityVariance);
	this.bind("velocity_variance_y", "y", this.getVelocityVariance);

	this.bind("acceleration_x", "x", this.getAcceleration);
	this.bind("acceleration_y", "y", this.getAcceleration);
	this.bind("acceleration_variance_x", "x", this.getAccelerationVariance);
	this.bind("acceleration_variance_y", "y", this.getAccelerationVariance);

	$$("position_enable").attachEvent("onChange", this.onEnableChanged);
	service.msg.on("emitter/changed", this.onEmitterChanged);
};

PositionMenu.prototype.onEnableChanged = function(value) {
	service.msg.emit("behaviour/setEnable", value, this.getBehaviour());
};

PositionMenu.prototype.onEmitterChanged = function() {
	$$("position_enable").setValue(projectModel.hasActiveBehaviour(this.getBehaviour()));
};

PositionMenu.prototype.getPosition = function() {
	return this.getBehaviour().position;
};

PositionMenu.prototype.getPositionVariance = function() {
	return this.getBehaviour().positionVariance;
};

PositionMenu.prototype.getVelocity = function() {
	return this.getBehaviour().velocity;
};

PositionMenu.prototype.getVelocityVariance = function() {
	return this.getBehaviour().velocityVariance;
};

PositionMenu.prototype.getAcceleration = function() {
	return this.getBehaviour().acceleration;
};

PositionMenu.prototype.getAccelerationVariance = function() {
	return this.getBehaviour().accelerationVariance;
};

PositionMenu.prototype.getBehaviour = function() {
	return behaviourModel.getBehaviourByName(jupiter.BehaviourNames.POSITION_BEHAVIOUR);
};

module.exports = PositionMenu;



},{"../../model":17,"../../service":19,"../../util":21,"./SubMenu.js":43}],38:[function(require,module,exports){
var controller = require("../../controller").projectMenuController;
var util = require("../../util");
var service = require("../../service");
var predefinedModel = require("../../model").predefinedModel;

function ProjectMenu() {
	util.bind(this);

	this.ui = {
		rows: [
			{view: "button", value: "Save Project", width: 200, click: this.onSaveProject},
			{view: "button", value: "Load Project", width: 200, click: this.onLoadProject},
			{view: "button", value: "Export config", width: 200, click: this.onExportConfig},
			{view: "button", value: "Load config", width: 200, click: this.onLoadConfig},
			{view: "button", value: "Load predefined", width: 200, click: this.onLoadPredefined},
			{view: "button", value: "Reset", width: 200}
		]
	};

	//todo: refactor
	document.getElementById("load-config").onchange = function() {
		service.msg.emit("project/loadConfig");
	};

	document.getElementById("load-project").onchange = function() {
		service.msg.emit("project/load");
	};
}

ProjectMenu.prototype.onLoadConfig = function() {
	document.getElementById("load-config").click();
};

ProjectMenu.prototype.onLoadProject = function() {
	document.getElementById("load-project").click();
};

ProjectMenu.prototype.onSaveProject = function() {
	service.msg.emit("project/save");
};

ProjectMenu.prototype.onExportConfig = function() {
	service.msg.emit("project/exportConfig");
};

ProjectMenu.prototype.onLoadPredefined = function() {
	var data = predefinedModel.getNames().map(function(name) {
		return {view: "text", value: name};
	});

	webix.ui({
		view: "window",
		modal: true,
		head: {view: "button", label: "close", align: "right", click: ("$$('choose_predefined_window').close();")},
		position: "center",
		id: "choose_predefined_window",
		body: {
			view: "menu",
			id: "choose_predefined_menu",
			select: true,
			data: data,
			layout: "y",
			scroll: "y",
			height: 300,
			on: {
				onMenuItemClick: this.onPredefinedClick
			}
		}
	}).show();
};

ProjectMenu.prototype.onPredefinedClick = function(id) {
	service.msg.emit("project/loadPredefined", $$("choose_predefined_menu").getMenuItem(id).value);
	$$("choose_predefined_window").hide();
	$$("choose_predefined_window").close();
};

module.exports = ProjectMenu;
},{"../../controller":8,"../../model":17,"../../service":19,"../../util":21}],39:[function(require,module,exports){
var SubMenu = require("./SubMenu.js");
var util = require("../../util");
var service = require("../../service");
var projectModel = require("../../model").projectModel;
var emissionModel = require("../../model").emissionModel;

function RandomEmissionMenu() {
	SubMenu.call(this);
	util.bind(this);

	this.ui = {
		id: "random_emit_controller_menu",
		rows: [
			this.counter("Emission rate:", {
				id: "emission_rate",
				step: 1, value: 0, min: 0, max: 2000, align: "center", format: webix.i18n.numberFormat
			}),
			this.counter("Max particles:", {
				id: "emission_max_particles",
				step: 1, value: 0, min: 0, max: 2000, align: "center", format: webix.i18n.numberFormat
			})
		]
	};
}

util.inherit(RandomEmissionMenu, SubMenu);

RandomEmissionMenu.prototype.onActive = function() {
	this.onEmitterChanged();

	$$("emission_rate").attachEvent("onChange", this.onEmissionRateChanged);
	$$("emission_max_particles").attachEvent("onChange", this.onMaxParticlesChanged);

};

RandomEmissionMenu.prototype.onDestroy = function() {
	$$("emission_rate").detachEvent("onChange", this.onEmissionRateChanged);
	$$("emission_max_particles").detachEvent("onChange", this.onMaxParticlesChanged);
	service.msg.off("emitter/changed", this.onEmitterChanged);
};

RandomEmissionMenu.prototype.onEmissionRateChanged = function(value) {
	this.getController().emissionRate = value;
};

RandomEmissionMenu.prototype.onMaxParticlesChanged = function(value) {
	this.getController().maxParticles = value;
};

RandomEmissionMenu.prototype.onEmitterChanged = function() {
	$$("emission_rate").setValue(this.getController().emissionRate);
	$$("emission_max_particles").setValue(this.getController().maxParticles);
};

RandomEmissionMenu.prototype.getController = function() {
	return emissionModel.getEmissionByName(jupiter.EmissionTypes.RANDOM);
};

module.exports = RandomEmissionMenu;
},{"../../model":17,"../../service":19,"../../util":21,"./SubMenu.js":43}],40:[function(require,module,exports){
var SubMenu = require("./SubMenu.js");
var util = require("../../util");
var behaviourModel = require("../../model").behaviourModel;
var projectModel = require("../../model").projectModel;
var service = require("../../service");

function RotationMenu() {
	SubMenu.call(this);
	util.bind(this);

	this.ui = {
		rows: [
			this.checkbox("Enabled: ", {id: "rotation_enable", value: 0}),
			this.rangedSlider("rotation", "Rotation/sec: "),
			this.rangedSlider("variance", "Variance: ")
		]
	};
}

util.inherit(RotationMenu, SubMenu);

RotationMenu.prototype.rangedSlider = function(id, label) {
	var slider = this.slider(label, {
		id: id,
		labelWidth: 30,
		min: -360,
		max: 360,
		step: 0.01,
		value: 0
	});

	return slider;
};

RotationMenu.prototype.onMenuCreated = function() {
	this.bind("rotation", "rotationInDegrees", this.getBehaviour);
	this.bind("variance", "varianceInDegrees", this.getBehaviour);

	$$("rotation_enable").attachEvent("onChange", this.onEnableChanged);
	service.msg.on("emitter/changed", this.onEmitterChanged);
};

RotationMenu.prototype.onEnableChanged = function(value) {
	service.msg.emit("behaviour/setEnable", value, this.getBehaviour());
};

RotationMenu.prototype.onEmitterChanged = function() {
	$$("rotation_enable").setValue(projectModel.hasActiveBehaviour(this.getBehaviour()));
};

RotationMenu.prototype.getBehaviour = function() {
	return behaviourModel.getBehaviourByName(jupiter.BehaviourNames.ROTATION_BEHAVIOUR);
};

module.exports = RotationMenu;



},{"../../model":17,"../../service":19,"../../util":21,"./SubMenu.js":43}],41:[function(require,module,exports){
var SubMenu = require("./SubMenu.js");
var util = require("../../util");
var behaviourModel = require("../../model").behaviourModel;
var projectModel = require("../../model").projectModel;
var service = require("../../service");

function SizeMenu() {
	SubMenu.call(this);
	util.bind(this);

	this.ui = {
		rows: [
			this.checkbox("Enabled: ", {id: "size_enable", value: 0}),
			this.section("Start size: "),
			this.positionSlider("start_size_x", "X: "),
			this.positionSlider("start_size_y", "Y: "),
			this.varianceSlider("start_size_variance", "Variance: "),

			this.section("End size: "),
			this.positionSlider("end_size_x", "X: "),
			this.positionSlider("end_size_y", "Y: "),
			this.varianceSlider("end_size_variance", "Variance: ")
		]
	};
}

util.inherit(SizeMenu, SubMenu);

SizeMenu.prototype.positionSlider = function(id, label) {
	var slider = this.slider(label, {
		id: id,
		labelWidth: 30,
		min: 0,
		max: 10,
		value: 1,
		step: 0.1
	});

	return slider;
};

SizeMenu.prototype.varianceSlider = function(id, label) {
	var slider = this.slider(label, {
		id: id,
		labelWidth: 30,
		min: 0,
		max: 10,
		value: 0,
		step: 0.1
	});

	return slider;
};

SizeMenu.prototype.onMenuCreated = function() {
	this.bind("start_size_x", "x", this.getSizeStart);
	this.bind("start_size_y", "y", this.getSizeStart);
	this.bind("end_size_x", "x", this.getSizeEnd);
	this.bind("end_size_y", "y", this.getSizeEnd);
	this.bind("start_size_variance", "startVariance");
	this.bind("end_size_variance", "endVariance");

	$$("size_enable").attachEvent("onChange", this.onEnableChanged);
	service.msg.on("emitter/changed", this.onEmitterChanged);
};

SizeMenu.prototype.onEnableChanged = function(value) {
	service.msg.emit("behaviour/setEnable", value, this.getBehaviour());
};

SizeMenu.prototype.onEmitterChanged = function() {
	$$("size_enable").setValue(projectModel.hasActiveBehaviour(this.getBehaviour()));
};

SizeMenu.prototype.getSizeStart = function() {
	return this.getBehaviour().sizeStart;
};

SizeMenu.prototype.getSizeEnd = function() {
	return this.getBehaviour().sizeEnd;
};

SizeMenu.prototype.getBehaviour = function() {
	return behaviourModel.getBehaviourByName(jupiter.BehaviourNames.SIZE_BEHAVIOUR);
};

module.exports = SizeMenu;



},{"../../model":17,"../../service":19,"../../util":21,"./SubMenu.js":43}],42:[function(require,module,exports){
var SubMenu = require("./SubMenu.js");
var util = require("../../util");
var service = require("../../service");
var projectModel = require("../../model").projectModel;
var emissionModel = require("../../model").emissionModel;

function StandardEmissionMenu() {
	SubMenu.call(this);
	util.bind(this);

	this.ui = {
		id: "standard_emit_controller_menu",
		rows: [
			this.counter("Emission rate:", {
				id: "standard_emit_emission_rate",
				step: 1, value: 0, min: 0, max: 2000, align: "center", format: webix.i18n.numberFormat
			}),
			this.counter("Max particles:", {
				id: "standerd_emission_max_particles",
				step: 1, value: 0, min: 0, max: 2000, align: "center", format: webix.i18n.numberFormat
			})
		]
	};
}

util.inherit(StandardEmissionMenu, SubMenu);

StandardEmissionMenu.prototype.onActive = function() {
	this.onEmitterChanged();

	$$("standard_emit_emission_rate").attachEvent("onChange", this.onEmissionRateChanged);
	$$("standerd_emission_max_particles").attachEvent("onChange", this.onMaxParticlesChanged);
	service.msg.on("emitter/changed", this.onEmitterChanged);
};

StandardEmissionMenu.prototype.onDestroy = function() {
	$$("standard_emit_emission_rate").detachEvent("onChange", this.onEmissionRateChanged);
	$$("standerd_emission_max_particles").detachEvent("onChange", this.onMaxParticlesChanged);
	service.msg.off("emitter/changed", this.onEmitterChanged);
};

StandardEmissionMenu.prototype.onEmissionRateChanged = function(value) {
	this.getController().emissionRate = value;
};

StandardEmissionMenu.prototype.onMaxParticlesChanged = function(value) {
	this.getController().maxParticles = value;
};

StandardEmissionMenu.prototype.onEmitterChanged = function() {
	$$("standard_emit_emission_rate").setValue(this.getController().emissionRate);
	$$("standerd_emission_max_particles").setValue(this.getController().maxParticles);
};

StandardEmissionMenu.prototype.getController = function() {
	return emissionModel.getEmissionByName(jupiter.EmissionTypes.UNIFORM);
};

module.exports = StandardEmissionMenu;
},{"../../model":17,"../../service":19,"../../util":21,"./SubMenu.js":43}],43:[function(require,module,exports){
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
		if($$(rows[i].id).refresh){
			$$(rows[i].id).refresh();

		}
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
},{"../../service":19,"../extension":26}],44:[function(require,module,exports){
var SubMenu = require("./SubMenu.js");
var util = require("../../util");
var service = require("../../service");

var controller = require("../../controller").textureMenuController;
var texturesModel = require("../../model").texturesModel;

function TextureMenu() {
	SubMenu.call(this);
	util.bind(this);

	this.ui = {
		rows: [
			//this.button("Export texture"),
			this.button("Upload texture", {click: this.onUploadTexture}),
			this.button("Show all", {click: this.onShowAll}),
			this.texturePreview()
		]
	};

	//todo: refactor
	document.getElementById("load-texture").onchange = function() {
		service.msg.emit("texture/upload");
	};
}

util.inherit(TextureMenu, SubMenu);

module.exports = TextureMenu;

TextureMenu.prototype.onUploadTexture = function() {
	document.getElementById("load-texture").click();
};

TextureMenu.prototype.texturePreview = function() {
	return {
		view: "carousel",
		id: "carousel",
		width: 100, height: 100,
		cols: this.getTexturesPreviewData(),
		navigation: {
			items: false
		}
	};

};

TextureMenu.prototype.onMenuCreated = function() {
	$$("carousel").attachEvent("onShow", function(name) {
		service.msg.emit("texture/change", name);
	});
};

TextureMenu.prototype.onShowAll = function() {
	this.texturesWindow = webix.ui({
		view: "window",
		body: {
			rows: [
				{
					view: "dataview",
					yCount: 2,
					xCount: 2,
					select: true,
					scroll: true,
					type: {
						width: 100,
						height: 100
					},
					template: imageTemplate,
					data: this.getTexturesViewData(),
					click: this.onMenuItemClick.bind(this)

				}
			]

		},
		head: false,
		top: 100,
		left: 100,
		width: 600,
		height: 500
	});

	this.texturesWindow.show();
};

TextureMenu.prototype.onMenuItemClick = function(name) {
	this.texturesWindow.hide();
	$$("carousel").setActive(name);
};

TextureMenu.prototype.getTexturesPreviewData = function() {
	return texturesModel.getTextures().map(function(texture) {
		return {id: texture.name, css: "image", template: imageTemplate, data: {src: texture.url}};
	});
};

TextureMenu.prototype.getTexturesViewData = function() {
	return texturesModel.getTextures().map(function(texture) {
		return {id: texture.name, src: texture.url, title: texture.name};
	});
};

function imageTemplate(obj) {
	return "<div class='texture-preview'><img src='" + obj.src + "' class='texture-preview-content' ondragstart='return false'/></div>";
}




},{"../../controller":8,"../../model":17,"../../service":19,"../../util":21,"./SubMenu.js":43}],45:[function(require,module,exports){
module.exports = {
	Menu: require("./Menu.js"),
	ProjectMenu: require("./ProjectMenu.js")
};
},{"./Menu.js":36,"./ProjectMenu.js":38}],46:[function(require,module,exports){
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
},{"../../model":17,"../../service":19,"../../util":21,"../Marker.js":24,"./StageBackground.js":47}],47:[function(require,module,exports){
var util = require("../../util");
var service = require("../../service");
var backgroundModel = require("../../model").backgroundModel;

function StageBackground() {
	PIXI.Container.call(this);
	util.bind(this);

	backgroundModel.on("isLocked/changed", this.onIsLockedChanged);
	backgroundModel.on("texture/changed", this.onTextureChanged);
	backgroundModel.on("imagePosition/changed", this.onPositionChanged);

	this.mousedown = this.touchstart = this.onMouseDown;
	this.mouseup = this.mouseupoutside = this.touchend = this.touchendoutside = this.onMouseUp;
	this.mousemove = this.touchmove = this.onMouseMove;

	this.onIsLockedChanged();
}

util.inherit(StageBackground, PIXI.Container);

StageBackground.prototype.onIsLockedChanged = function() {
	this.interactive = !backgroundModel.isLocked;
	this.buttonMode = !backgroundModel.isLocked;
};

StageBackground.prototype.onTextureChanged = function() {
	if (!backgroundModel.texture && this.image) {
		this.removeChild(this.image);
		this.image = null;
	}
	else {
		this.image = this.image || this.createImage();
		this.image.texture = backgroundModel.texture;
		this.onPositionChanged();
	}
};

StageBackground.prototype.onPositionChanged = function() {
	if (this.image) {
		this.image.x = backgroundModel.imagePosition.x;
		this.image.y = backgroundModel.imagePosition.y;
	}
};

StageBackground.prototype.createImage = function() {
	var image = new PIXI.Sprite(PIXI.Texture.EMPTY);
	image.anchor.set(0.5, 0.5);
	return this.addChild(image);
};

StageBackground.prototype.onMouseDown = function() {
	this.dragging = true;
};

StageBackground.prototype.onMouseUp = function() {
	this.dragging = false;
};

StageBackground.prototype.onMouseMove = function(event) {
	if (this.dragging) {
		var newPosition = event.data.getLocalPosition(this);
		backgroundModel.imagePosition = newPosition.clone();
	}
};

module.exports = StageBackground;
},{"../../model":17,"../../service":19,"../../util":21}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZXZlbnRlbWl0dGVyMy9pbmRleC5qcyIsInNyYy9jb250cm9sbGVyL0JhY2tncm91bmRNZW51Q29udHJvbGxlci5qcyIsInNyYy9jb250cm9sbGVyL0JlaGF2aW91ckNvbnRyb2xsZXIuanMiLCJzcmMvY29udHJvbGxlci9FbWlzc2lvbkNvbnRyb2xsZXIuanMiLCJzcmMvY29udHJvbGxlci9Qcm9qZWN0TWVudUNvbnRyb2xsZXIuanMiLCJzcmMvY29udHJvbGxlci9UZXh0dXJlTWVudUNvbnRyb2xsZXIuanMiLCJzcmMvY29udHJvbGxlci9pbmRleC5qcyIsInNyYy9tb2RlbC9CYWNrZ3JvdW5kTW9kZWwuanMiLCJzcmMvbW9kZWwvQmVoYXZpb3VyTW9kZWwuanMiLCJzcmMvbW9kZWwvRW1pc3Npb25Nb2RlbC5qcyIsInNyYy9tb2RlbC9Nb2RlbC5qcyIsInNyYy9tb2RlbC9QYXJ0aWNsZU1vZGVsLmpzIiwic3JjL21vZGVsL1ByZWRlZmluZWRNb2RlbC5qcyIsInNyYy9tb2RlbC9Qcm9qZWN0TW9kZWwuanMiLCJzcmMvbW9kZWwvVGV4dHVyZXNNb2RlbC5qcyIsInNyYy9tb2RlbC9pbmRleC5qcyIsInNyYy9zZXJ2aWNlL0ZpbGVTZXJ2aWNlLmpzIiwic3JjL3NlcnZpY2UvaW5kZXguanMiLCJzcmMvdXRpbC9iaW5kLmpzIiwic3JjL3V0aWwvaW5kZXguanMiLCJzcmMvdXRpbC9pbmhlcml0LmpzIiwic3JjL3ZpZXcvTWFpblZpZXcuanMiLCJzcmMvdmlldy9NYXJrZXIuanMiLCJzcmMvdmlldy9QYXJ0aWNsZVZpZXcuanMiLCJzcmMvdmlldy9leHRlbnNpb24vaW5kZXguanMiLCJzcmMvdmlldy9leHRlbnNpb24vc2xpZGVyLmpzIiwic3JjL3ZpZXcvaW5kZXguanMiLCJzcmMvdmlldy9tZW51L0FuZ3VsYXJWZWxvY2l0eU1lbnUuanMiLCJzcmMvdmlldy9tZW51L0JhY2tncm91bmRNZW51LmpzIiwic3JjL3ZpZXcvbWVudS9Db2xvck1lbnUuanMiLCJzcmMvdmlldy9tZW51L0RlZmF1bHRFbWlzc2lvbk1lbnUuanMiLCJzcmMvdmlldy9tZW51L0VtaXREaXJlY3Rpb25NZW51LmpzIiwic3JjL3ZpZXcvbWVudS9HZW5lcmFsTWVudS5qcyIsInNyYy92aWV3L21lbnUvTGlmZU1lbnUuanMiLCJzcmMvdmlldy9tZW51L01lbnUuanMiLCJzcmMvdmlldy9tZW51L1Bvc2l0aW9uTWVudS5qcyIsInNyYy92aWV3L21lbnUvUHJvamVjdE1lbnUuanMiLCJzcmMvdmlldy9tZW51L1JhbmRvbUVtaXNzaW9uTWVudS5qcyIsInNyYy92aWV3L21lbnUvUm90YXRpb25NZW51LmpzIiwic3JjL3ZpZXcvbWVudS9TaXplTWVudS5qcyIsInNyYy92aWV3L21lbnUvU3RhbmRhcmRFbWlzc2lvbk1lbnUuanMiLCJzcmMvdmlldy9tZW51L1N1Yk1lbnUuanMiLCJzcmMvdmlldy9tZW51L1RleHR1cmVNZW51LmpzIiwic3JjL3ZpZXcvbWVudS9pbmRleC5qcyIsInNyYy92aWV3L3N0YWdlL1N0YWdlLmpzIiwic3JjL3ZpZXcvc3RhZ2UvU3RhZ2VCYWNrZ3JvdW5kLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0dBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBNYWluVmlldyA9IHJlcXVpcmUoXCIuL3ZpZXdcIikuTWFpblZpZXc7XG52YXIgdGV4dHVyZXNNb2RlbCA9IHJlcXVpcmUoXCIuL21vZGVsXCIpLnRleHR1cmVzTW9kZWw7XG52YXIgcHJlZGVmaW5lZE1vZGVsID0gcmVxdWlyZShcIi4vbW9kZWxcIikucHJlZGVmaW5lZE1vZGVsO1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuY3Rpb24oKSB7XG5cblx0Ly90b2RvOiBleHRyYWN0XG5cdFBJWEkubG9hZGVyLnVzZShmdW5jdGlvbihyZXNvdXJjZSwgbmV4dCkge1xuXHRcdGlmICgoL1xcLihqdXApJC9pKS50ZXN0KHJlc291cmNlLm5hbWUpKSB7XG5cdFx0XHR2YXIgc3RhcnQgPSByZXNvdXJjZS5uYW1lLmxhc3RJbmRleE9mKFwiL1wiKSArIDE7XG5cdFx0XHR2YXIgZW5kID0gcmVzb3VyY2UubmFtZS5sYXN0SW5kZXhPZihcIi5cIik7XG5cdFx0XHRwcmVkZWZpbmVkTW9kZWwuYWRkKHJlc291cmNlLm5hbWUuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpLCBKU09OLnBhcnNlKHJlc291cmNlLmRhdGEpKTtcblx0XHR9XG5cblx0XHRuZXh0KCk7XG5cdH0pO1xuXHRQSVhJLmxvYWRlci5hZGQoXCJhc3NldHMvc3ByaXRlc2hlZXQuanNvblwiKTtcblx0UElYSS5sb2FkZXIuYWRkKHRleHR1cmVzTW9kZWwuZ2V0VGV4dHVyZVVybHMoKSk7XG5cdFBJWEkubG9hZGVyLmFkZChwcmVkZWZpbmVkTW9kZWwuZ2V0Q29uZmlnVXJscygpKTtcblx0UElYSS5sb2FkZXIub25jZShcImNvbXBsZXRlXCIsIG9uTG9hZGVkKTtcblx0UElYSS5sb2FkZXIubG9hZCgpO1xuXG5cblx0Y29uc29sZS5sb2coanVwaXRlcik7XG5cdGZ1bmN0aW9uIG9uTG9hZGVkKCkge1xuXHRcdHRleHR1cmVzTW9kZWwuc2V0RGVmYXVsdFRleHR1cmUoKTtcblx0XHR2YXIgbWFpblZpZXcgPSBuZXcgTWFpblZpZXcoKTtcblx0fVxufSk7XG5cblxuXG4iLCIndXNlIHN0cmljdCc7XG5cbi8vXG4vLyBXZSBzdG9yZSBvdXIgRUUgb2JqZWN0cyBpbiBhIHBsYWluIG9iamVjdCB3aG9zZSBwcm9wZXJ0aWVzIGFyZSBldmVudCBuYW1lcy5cbi8vIElmIGBPYmplY3QuY3JlYXRlKG51bGwpYCBpcyBub3Qgc3VwcG9ydGVkIHdlIHByZWZpeCB0aGUgZXZlbnQgbmFtZXMgd2l0aCBhXG4vLyBgfmAgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIGJ1aWx0LWluIG9iamVjdCBwcm9wZXJ0aWVzIGFyZSBub3Qgb3ZlcnJpZGRlbiBvclxuLy8gdXNlZCBhcyBhbiBhdHRhY2sgdmVjdG9yLlxuLy8gV2UgYWxzbyBhc3N1bWUgdGhhdCBgT2JqZWN0LmNyZWF0ZShudWxsKWAgaXMgYXZhaWxhYmxlIHdoZW4gdGhlIGV2ZW50IG5hbWVcbi8vIGlzIGFuIEVTNiBTeW1ib2wuXG4vL1xudmFyIHByZWZpeCA9IHR5cGVvZiBPYmplY3QuY3JlYXRlICE9PSAnZnVuY3Rpb24nID8gJ34nIDogZmFsc2U7XG5cbi8qKlxuICogUmVwcmVzZW50YXRpb24gb2YgYSBzaW5nbGUgRXZlbnRFbWl0dGVyIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIEV2ZW50IGhhbmRsZXIgdG8gYmUgY2FsbGVkLlxuICogQHBhcmFtIHtNaXhlZH0gY29udGV4dCBDb250ZXh0IGZvciBmdW5jdGlvbiBleGVjdXRpb24uXG4gKiBAcGFyYW0ge0Jvb2xlYW59IG9uY2UgT25seSBlbWl0IG9uY2VcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBFRShmbiwgY29udGV4dCwgb25jZSkge1xuICB0aGlzLmZuID0gZm47XG4gIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gIHRoaXMub25jZSA9IG9uY2UgfHwgZmFsc2U7XG59XG5cbi8qKlxuICogTWluaW1hbCBFdmVudEVtaXR0ZXIgaW50ZXJmYWNlIHRoYXQgaXMgbW9sZGVkIGFnYWluc3QgdGhlIE5vZGUuanNcbiAqIEV2ZW50RW1pdHRlciBpbnRlcmZhY2UuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAYXBpIHB1YmxpY1xuICovXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7IC8qIE5vdGhpbmcgdG8gc2V0ICovIH1cblxuLyoqXG4gKiBIb2xkcyB0aGUgYXNzaWduZWQgRXZlbnRFbWl0dGVycyBieSBuYW1lLlxuICpcbiAqIEB0eXBlIHtPYmplY3R9XG4gKiBAcHJpdmF0ZVxuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5cbi8qKlxuICogUmV0dXJuIGEgbGlzdCBvZiBhc3NpZ25lZCBldmVudCBsaXN0ZW5lcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50IFRoZSBldmVudHMgdGhhdCBzaG91bGQgYmUgbGlzdGVkLlxuICogQHBhcmFtIHtCb29sZWFufSBleGlzdHMgV2Ugb25seSBuZWVkIHRvIGtub3cgaWYgdGhlcmUgYXJlIGxpc3RlbmVycy5cbiAqIEByZXR1cm5zIHtBcnJheXxCb29sZWFufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbiBsaXN0ZW5lcnMoZXZlbnQsIGV4aXN0cykge1xuICB2YXIgZXZ0ID0gcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudFxuICAgICwgYXZhaWxhYmxlID0gdGhpcy5fZXZlbnRzICYmIHRoaXMuX2V2ZW50c1tldnRdO1xuXG4gIGlmIChleGlzdHMpIHJldHVybiAhIWF2YWlsYWJsZTtcbiAgaWYgKCFhdmFpbGFibGUpIHJldHVybiBbXTtcbiAgaWYgKGF2YWlsYWJsZS5mbikgcmV0dXJuIFthdmFpbGFibGUuZm5dO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXZhaWxhYmxlLmxlbmd0aCwgZWUgPSBuZXcgQXJyYXkobCk7IGkgPCBsOyBpKyspIHtcbiAgICBlZVtpXSA9IGF2YWlsYWJsZVtpXS5mbjtcbiAgfVxuXG4gIHJldHVybiBlZTtcbn07XG5cbi8qKlxuICogRW1pdCBhbiBldmVudCB0byBhbGwgcmVnaXN0ZXJlZCBldmVudCBsaXN0ZW5lcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50IFRoZSBuYW1lIG9mIHRoZSBldmVudC5cbiAqIEByZXR1cm5zIHtCb29sZWFufSBJbmRpY2F0aW9uIGlmIHdlJ3ZlIGVtaXR0ZWQgYW4gZXZlbnQuXG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbiBlbWl0KGV2ZW50LCBhMSwgYTIsIGEzLCBhNCwgYTUpIHtcbiAgdmFyIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnQ7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1tldnRdKSByZXR1cm4gZmFsc2U7XG5cbiAgdmFyIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1tldnRdXG4gICAgLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgLCBhcmdzXG4gICAgLCBpO1xuXG4gIGlmICgnZnVuY3Rpb24nID09PSB0eXBlb2YgbGlzdGVuZXJzLmZuKSB7XG4gICAgaWYgKGxpc3RlbmVycy5vbmNlKSB0aGlzLnJlbW92ZUxpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lcnMuZm4sIHVuZGVmaW5lZCwgdHJ1ZSk7XG5cbiAgICBzd2l0Y2ggKGxlbikge1xuICAgICAgY2FzZSAxOiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQpLCB0cnVlO1xuICAgICAgY2FzZSAyOiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExKSwgdHJ1ZTtcbiAgICAgIGNhc2UgMzogcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0LCBhMSwgYTIpLCB0cnVlO1xuICAgICAgY2FzZSA0OiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExLCBhMiwgYTMpLCB0cnVlO1xuICAgICAgY2FzZSA1OiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExLCBhMiwgYTMsIGE0KSwgdHJ1ZTtcbiAgICAgIGNhc2UgNjogcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0LCBhMSwgYTIsIGEzLCBhNCwgYTUpLCB0cnVlO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDEsIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0xKTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICB9XG5cbiAgICBsaXN0ZW5lcnMuZm4uYXBwbHkobGlzdGVuZXJzLmNvbnRleHQsIGFyZ3MpO1xuICB9IGVsc2Uge1xuICAgIHZhciBsZW5ndGggPSBsaXN0ZW5lcnMubGVuZ3RoXG4gICAgICAsIGo7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChsaXN0ZW5lcnNbaV0ub25jZSkgdGhpcy5yZW1vdmVMaXN0ZW5lcihldmVudCwgbGlzdGVuZXJzW2ldLmZuLCB1bmRlZmluZWQsIHRydWUpO1xuXG4gICAgICBzd2l0Y2ggKGxlbikge1xuICAgICAgICBjYXNlIDE6IGxpc3RlbmVyc1tpXS5mbi5jYWxsKGxpc3RlbmVyc1tpXS5jb250ZXh0KTsgYnJlYWs7XG4gICAgICAgIGNhc2UgMjogbGlzdGVuZXJzW2ldLmZuLmNhbGwobGlzdGVuZXJzW2ldLmNvbnRleHQsIGExKTsgYnJlYWs7XG4gICAgICAgIGNhc2UgMzogbGlzdGVuZXJzW2ldLmZuLmNhbGwobGlzdGVuZXJzW2ldLmNvbnRleHQsIGExLCBhMik7IGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGlmICghYXJncykgZm9yIChqID0gMSwgYXJncyA9IG5ldyBBcnJheShsZW4gLTEpOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaiAtIDFdID0gYXJndW1lbnRzW2pdO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxpc3RlbmVyc1tpXS5mbi5hcHBseShsaXN0ZW5lcnNbaV0uY29udGV4dCwgYXJncyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG4vKipcbiAqIFJlZ2lzdGVyIGEgbmV3IEV2ZW50TGlzdGVuZXIgZm9yIHRoZSBnaXZlbiBldmVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnQgTmFtZSBvZiB0aGUgZXZlbnQuXG4gKiBAcGFyYW0ge0Z1bmN0b259IGZuIENhbGxiYWNrIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtNaXhlZH0gY29udGV4dCBUaGUgY29udGV4dCBvZiB0aGUgZnVuY3Rpb24uXG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gb24oZXZlbnQsIGZuLCBjb250ZXh0KSB7XG4gIHZhciBsaXN0ZW5lciA9IG5ldyBFRShmbiwgY29udGV4dCB8fCB0aGlzKVxuICAgICwgZXZ0ID0gcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudDtcblxuICBpZiAoIXRoaXMuX2V2ZW50cykgdGhpcy5fZXZlbnRzID0gcHJlZml4ID8ge30gOiBPYmplY3QuY3JlYXRlKG51bGwpO1xuICBpZiAoIXRoaXMuX2V2ZW50c1tldnRdKSB0aGlzLl9ldmVudHNbZXZ0XSA9IGxpc3RlbmVyO1xuICBlbHNlIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50c1tldnRdLmZuKSB0aGlzLl9ldmVudHNbZXZ0XS5wdXNoKGxpc3RlbmVyKTtcbiAgICBlbHNlIHRoaXMuX2V2ZW50c1tldnRdID0gW1xuICAgICAgdGhpcy5fZXZlbnRzW2V2dF0sIGxpc3RlbmVyXG4gICAgXTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBZGQgYW4gRXZlbnRMaXN0ZW5lciB0aGF0J3Mgb25seSBjYWxsZWQgb25jZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnQgTmFtZSBvZiB0aGUgZXZlbnQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBDYWxsYmFjayBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7TWl4ZWR9IGNvbnRleHQgVGhlIGNvbnRleHQgb2YgdGhlIGZ1bmN0aW9uLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24gb25jZShldmVudCwgZm4sIGNvbnRleHQpIHtcbiAgdmFyIGxpc3RlbmVyID0gbmV3IEVFKGZuLCBjb250ZXh0IHx8IHRoaXMsIHRydWUpXG4gICAgLCBldnQgPSBwcmVmaXggPyBwcmVmaXggKyBldmVudCA6IGV2ZW50O1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKSB0aGlzLl9ldmVudHMgPSBwcmVmaXggPyB7fSA6IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIGlmICghdGhpcy5fZXZlbnRzW2V2dF0pIHRoaXMuX2V2ZW50c1tldnRdID0gbGlzdGVuZXI7XG4gIGVsc2Uge1xuICAgIGlmICghdGhpcy5fZXZlbnRzW2V2dF0uZm4pIHRoaXMuX2V2ZW50c1tldnRdLnB1c2gobGlzdGVuZXIpO1xuICAgIGVsc2UgdGhpcy5fZXZlbnRzW2V2dF0gPSBbXG4gICAgICB0aGlzLl9ldmVudHNbZXZ0XSwgbGlzdGVuZXJcbiAgICBdO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBldmVudCBsaXN0ZW5lcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50IFRoZSBldmVudCB3ZSB3YW50IHRvIHJlbW92ZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBsaXN0ZW5lciB0aGF0IHdlIG5lZWQgdG8gZmluZC5cbiAqIEBwYXJhbSB7TWl4ZWR9IGNvbnRleHQgT25seSByZW1vdmUgbGlzdGVuZXJzIG1hdGNoaW5nIHRoaXMgY29udGV4dC5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gb25jZSBPbmx5IHJlbW92ZSBvbmNlIGxpc3RlbmVycy5cbiAqIEBhcGkgcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcihldmVudCwgZm4sIGNvbnRleHQsIG9uY2UpIHtcbiAgdmFyIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnQ7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1tldnRdKSByZXR1cm4gdGhpcztcblxuICB2YXIgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW2V2dF1cbiAgICAsIGV2ZW50cyA9IFtdO1xuXG4gIGlmIChmbikge1xuICAgIGlmIChsaXN0ZW5lcnMuZm4pIHtcbiAgICAgIGlmIChcbiAgICAgICAgICAgbGlzdGVuZXJzLmZuICE9PSBmblxuICAgICAgICB8fCAob25jZSAmJiAhbGlzdGVuZXJzLm9uY2UpXG4gICAgICAgIHx8IChjb250ZXh0ICYmIGxpc3RlbmVycy5jb250ZXh0ICE9PSBjb250ZXh0KVxuICAgICAgKSB7XG4gICAgICAgIGV2ZW50cy5wdXNoKGxpc3RlbmVycyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBsaXN0ZW5lcnMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgIGxpc3RlbmVyc1tpXS5mbiAhPT0gZm5cbiAgICAgICAgICB8fCAob25jZSAmJiAhbGlzdGVuZXJzW2ldLm9uY2UpXG4gICAgICAgICAgfHwgKGNvbnRleHQgJiYgbGlzdGVuZXJzW2ldLmNvbnRleHQgIT09IGNvbnRleHQpXG4gICAgICAgICkge1xuICAgICAgICAgIGV2ZW50cy5wdXNoKGxpc3RlbmVyc1tpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvL1xuICAvLyBSZXNldCB0aGUgYXJyYXksIG9yIHJlbW92ZSBpdCBjb21wbGV0ZWx5IGlmIHdlIGhhdmUgbm8gbW9yZSBsaXN0ZW5lcnMuXG4gIC8vXG4gIGlmIChldmVudHMubGVuZ3RoKSB7XG4gICAgdGhpcy5fZXZlbnRzW2V2dF0gPSBldmVudHMubGVuZ3RoID09PSAxID8gZXZlbnRzWzBdIDogZXZlbnRzO1xuICB9IGVsc2Uge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZ0XTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgYWxsIGxpc3RlbmVycyBvciBvbmx5IHRoZSBsaXN0ZW5lcnMgZm9yIHRoZSBzcGVjaWZpZWQgZXZlbnQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50IFRoZSBldmVudCB3YW50IHRvIHJlbW92ZSBhbGwgbGlzdGVuZXJzIGZvci5cbiAqIEBhcGkgcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24gcmVtb3ZlQWxsTGlzdGVuZXJzKGV2ZW50KSB7XG4gIGlmICghdGhpcy5fZXZlbnRzKSByZXR1cm4gdGhpcztcblxuICBpZiAoZXZlbnQpIGRlbGV0ZSB0aGlzLl9ldmVudHNbcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudF07XG4gIGVsc2UgdGhpcy5fZXZlbnRzID0gcHJlZml4ID8ge30gOiBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy9cbi8vIEFsaWFzIG1ldGhvZHMgbmFtZXMgYmVjYXVzZSBwZW9wbGUgcm9sbCBsaWtlIHRoYXQuXG4vL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vZmYgPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUub247XG5cbi8vXG4vLyBUaGlzIGZ1bmN0aW9uIGRvZXNuJ3QgYXBwbHkgYW55bW9yZS5cbi8vXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uIHNldE1heExpc3RlbmVycygpIHtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vL1xuLy8gRXhwb3NlIHRoZSBwcmVmaXguXG4vL1xuRXZlbnRFbWl0dGVyLnByZWZpeGVkID0gcHJlZml4O1xuXG4vL1xuLy8gRXhwb3NlIHRoZSBtb2R1bGUuXG4vL1xuaWYgKCd1bmRlZmluZWQnICE9PSB0eXBlb2YgbW9kdWxlKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xufVxuIiwidmFyIGJhY2tncm91bmRNb2RlbCA9IHJlcXVpcmUoXCIuLi9tb2RlbFwiKS5iYWNrZ3JvdW5kTW9kZWw7XG52YXIgc2VydmljZSA9IHJlcXVpcmUoXCIuLi9zZXJ2aWNlXCIpO1xuXG5mdW5jdGlvbiBCYWNrZ3JvdW5kTWVudUNvbnRyb2xsZXIoKSB7XG5cdHNlcnZpY2UubXNnLm9uKFwiYmFja2dyb3VuZC9jaGFuZ2VMb2NrZWRcIiwgdGhpcy5vbkNoYW5nZUxvY2tlZCk7XG5cdHNlcnZpY2UubXNnLm9uKFwiYmFja2dyb3VuZC9jaGFuZ2VDb2xvclwiLCB0aGlzLm9uQ2hhbmdlQ29sb3IpO1xuXHRzZXJ2aWNlLm1zZy5vbihcImJhY2tncm91bmQvbG9hZFRleHR1cmVcIiwgdGhpcy5vbkxvYWRUZXh0dXJlKTtcblx0c2VydmljZS5tc2cub24oXCJiYWNrZ3JvdW5kL3JlbW92ZVRleHR1cmVcIiwgdGhpcy5vblJlbW92ZVRleHR1cmUpO1xufVxuXG5CYWNrZ3JvdW5kTWVudUNvbnRyb2xsZXIucHJvdG90eXBlLm9uQ2hhbmdlTG9ja2VkID0gZnVuY3Rpb24oKSB7XG5cdGJhY2tncm91bmRNb2RlbC5pc0xvY2tlZCA9ICFiYWNrZ3JvdW5kTW9kZWwuaXNMb2NrZWQ7XG59O1xuXG5CYWNrZ3JvdW5kTWVudUNvbnRyb2xsZXIucHJvdG90eXBlLm9uQ2hhbmdlQ29sb3IgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRiYWNrZ3JvdW5kTW9kZWwuY29sb3IgPSB2YWx1ZTtcbn07XG5cbkJhY2tncm91bmRNZW51Q29udHJvbGxlci5wcm90b3R5cGUub25Mb2FkVGV4dHVyZSA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcblx0cmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuXHRcdGJhY2tncm91bmRNb2RlbC50ZXh0dXJlID0gUElYSS5UZXh0dXJlLmZyb21JbWFnZShyZWFkZXIucmVzdWx0KTtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWQtYmFja2dyb3VuZFwiKS52YWx1ZSA9IG51bGw7XG5cdH0uYmluZCh0aGlzKTtcblxuXHRyZWFkZXIucmVhZEFzRGF0YVVSTChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWQtYmFja2dyb3VuZFwiKS5maWxlc1swXSk7XG59O1xuXG5CYWNrZ3JvdW5kTWVudUNvbnRyb2xsZXIucHJvdG90eXBlLm9uUmVtb3ZlVGV4dHVyZSA9IGZ1bmN0aW9uKCkge1xuXHRiYWNrZ3JvdW5kTW9kZWwudGV4dHVyZSA9IG51bGw7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBCYWNrZ3JvdW5kTWVudUNvbnRyb2xsZXI7IiwidmFyIHByb2plY3RNb2RlbCA9IHJlcXVpcmUoXCIuLi9tb2RlbFwiKS5wcm9qZWN0TW9kZWw7XG52YXIgc2VydmljZSA9IHJlcXVpcmUoXCIuLi9zZXJ2aWNlXCIpO1xudmFyIHV0aWwgPSByZXF1aXJlKFwiLi4vdXRpbFwiKTtcblxuZnVuY3Rpb24gQmVoYXZpb3VyQ29udHJvbGxlcigpIHtcblx0dXRpbC5iaW5kKHRoaXMpO1xuXHRzZXJ2aWNlLm1zZy5vbihcImJlaGF2aW91ci9zZXRFbmFibGVcIiwgdGhpcy5vblNldEVuYWJsZSk7XG59XG5cbkJlaGF2aW91ckNvbnRyb2xsZXIucHJvdG90eXBlLm9uU2V0RW5hYmxlID0gZnVuY3Rpb24oZW5hYmxlLCBiZWhhdmlvdXIpIHtcblx0aWYgKGVuYWJsZSkge1xuXHRcdHRoaXMuZW5hYmxlQmVoYXZpb3VyKGJlaGF2aW91cik7XG5cdH1cblx0ZWxzZSB7XG5cdFx0dGhpcy5kaXNhYmxlQmVoYXZpb3VyKGJlaGF2aW91cik7XG5cdH1cbn07XG5cbkJlaGF2aW91ckNvbnRyb2xsZXIucHJvdG90eXBlLmVuYWJsZUJlaGF2aW91ciA9IGZ1bmN0aW9uKGJlaGF2aW91cikge1xuXHRpZiAoIXByb2plY3RNb2RlbC5oYXNBY3RpdmVCZWhhdmlvdXIoYmVoYXZpb3VyKSkge1xuXHRcdHByb2plY3RNb2RlbC5lbWl0dGVyLmJlaGF2aW91cnMuYWRkKGJlaGF2aW91cik7XG5cdH1cbn07XG5cbkJlaGF2aW91ckNvbnRyb2xsZXIucHJvdG90eXBlLmRpc2FibGVCZWhhdmlvdXIgPSBmdW5jdGlvbihiZWhhdmlvdXIpIHtcblx0dmFyIGJlaGF2aW91cnMgPSBwcm9qZWN0TW9kZWwuZW1pdHRlci5iZWhhdmlvdXJzLmdldEFsbCgpO1xuXHRwcm9qZWN0TW9kZWwuZW1pdHRlci5iZWhhdmlvdXJzLmNsZWFyKCk7XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBiZWhhdmlvdXJzLmxlbmd0aDsgKytpKSB7XG5cdFx0aWYgKGJlaGF2aW91cnNbaV0uZ2V0TmFtZSgpICE9PSBiZWhhdmlvdXIuZ2V0TmFtZSgpKSB7XG5cdFx0XHRwcm9qZWN0TW9kZWwuZW1pdHRlci5iZWhhdmlvdXJzLmFkZChiZWhhdmlvdXJzW2ldKTtcblx0XHR9XG5cdH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCZWhhdmlvdXJDb250cm9sbGVyO1xuIiwidmFyIHByb2plY3RNb2RlbCA9IHJlcXVpcmUoXCIuLi9tb2RlbFwiKS5wcm9qZWN0TW9kZWw7XG52YXIgZW1pc3Npb25Nb2RlbCA9IHJlcXVpcmUoXCIuLi9tb2RlbFwiKS5lbWlzc2lvbk1vZGVsO1xudmFyIHNlcnZpY2UgPSByZXF1aXJlKFwiLi4vc2VydmljZVwiKTtcbnZhciB1dGlsID0gcmVxdWlyZShcIi4uL3V0aWxcIik7XG5cbmZ1bmN0aW9uIEVtaXNzaW9uQ29udHJvbGxlcigpIHtcblx0dXRpbC5iaW5kKHRoaXMpO1xuXHRzZXJ2aWNlLm1zZy5vbihcImVtaXNzaW9uL2NoYW5nZVwiLCB0aGlzLm9uRW1pc3Npb25DaGFuZ2VkKTtcblxuXHR0aGlzLnNldEVtaXNzaW9uQnlOYW1lKGp1cGl0ZXIuRW1pc3Npb25UeXBlcy5ERUZBVUxUKTtcbn1cblxuRW1pc3Npb25Db250cm9sbGVyLnByb3RvdHlwZS5vbkVtaXNzaW9uQ2hhbmdlZCA9IGZ1bmN0aW9uKG5hbWUpIHtcblx0aWYgKHByb2plY3RNb2RlbC5lbWl0dGVyLmVtaXRDb250cm9sbGVyLmdldE5hbWUoKSAhPT0gbmFtZSkge1xuXHRcdHRoaXMuc2V0RW1pc3Npb25CeU5hbWUobmFtZSk7XG5cdH1cbn07XG5cbkVtaXNzaW9uQ29udHJvbGxlci5wcm90b3R5cGUuc2V0RW1pc3Npb25CeU5hbWUgPSBmdW5jdGlvbihuYW1lKSB7XG5cdHZhciBuZXdDb250cm9sbGVyID0gZW1pc3Npb25Nb2RlbC5nZXRFbWlzc2lvbkJ5TmFtZShuYW1lKTtcblx0cHJvamVjdE1vZGVsLmVtaXR0ZXIuZW1pdENvbnRyb2xsZXIgPSBuZXdDb250cm9sbGVyO1xuXHRwcm9qZWN0TW9kZWwuZW1pdHRlci5yZXNldCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFbWlzc2lvbkNvbnRyb2xsZXI7XG4iLCJ2YXIgZmlsZSA9IHJlcXVpcmUoXCIuLi9zZXJ2aWNlXCIpLmZpbGU7XG52YXIgc2VydmljZSA9IHJlcXVpcmUoXCIuLi9zZXJ2aWNlXCIpO1xudmFyIHByb2plY3RNb2RlbCA9IHJlcXVpcmUoXCIuLi9tb2RlbFwiKS5wcm9qZWN0TW9kZWw7XG52YXIgcHJlZGVmaW5lZE1vZGVsID0gcmVxdWlyZShcIi4uL21vZGVsXCIpLnByZWRlZmluZWRNb2RlbDtcbnZhciBiZWhhdmlvdXJNb2RlbCA9IHJlcXVpcmUoXCIuLi9tb2RlbFwiKS5iZWhhdmlvdXJNb2RlbDtcbnZhciBlbWlzc2lvbk1vZGVsID0gcmVxdWlyZShcIi4uL21vZGVsXCIpLmVtaXNzaW9uTW9kZWw7XG52YXIgdGV4dHVyZXNNb2RlbCA9IHJlcXVpcmUoXCIuLi9tb2RlbFwiKS50ZXh0dXJlc01vZGVsO1xudmFyIGJhY2tncm91bmRNb2RlbCA9IHJlcXVpcmUoXCIuLi9tb2RlbFwiKS5iYWNrZ3JvdW5kTW9kZWw7XG5cbmZ1bmN0aW9uIFByb2plY3RNZW51Q29udHJvbGxlcigpIHtcblx0c2VydmljZS5tc2cub24oXCJwcm9qZWN0L3NhdmVcIiwgdGhpcy5vblNhdmVQcm9qZWN0LCB0aGlzKTtcblx0c2VydmljZS5tc2cub24oXCJwcm9qZWN0L2xvYWRcIiwgdGhpcy5vbkxvYWRQcm9qZWN0LCB0aGlzKTtcblx0c2VydmljZS5tc2cub24oXCJwcm9qZWN0L2V4cG9ydENvbmZpZ1wiLCB0aGlzLm9uRXhwb3J0Q29uZmlnLCB0aGlzKTtcblx0c2VydmljZS5tc2cub24oXCJwcm9qZWN0L2xvYWRDb25maWdcIiwgdGhpcy5vbkxvYWRDb25maWcsIHRoaXMpO1xuXHRzZXJ2aWNlLm1zZy5vbihcInByb2plY3QvbG9hZFByZWRlZmluZWRcIiwgdGhpcy5vbkxvYWRQcmVkZWZpbmVkLCB0aGlzKTtcblxuXHRwcm9qZWN0TW9kZWwub24oXCJlbWl0dGVyQ29uZmlnL2NoYW5nZWRcIiwgdGhpcy5vbkVtaXR0ZXJDb25maWdDaGFuZ2VkLCB0aGlzKTtcblx0cHJvamVjdE1vZGVsLm9uKFwiZW1pdHRlckNvbmZpZy9jaGFuZ2VkXCIsIHRoaXMucmVmcmVzaEVtaXRDb250cm9sbGVyLCB0aGlzKTtcbn1cblxuUHJvamVjdE1lbnVDb250cm9sbGVyLnByb3RvdHlwZS5vbkxvYWRQcm9qZWN0ID0gZnVuY3Rpb24oKSB7XG5cdHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXHRyZWFkZXIub25sb2FkID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGRhdGEgPSBKU09OLnBhcnNlKHJlYWRlci5yZXN1bHQpO1xuXHRcdHRoaXMubG9hZFByb2plY3QoZGF0YSk7XG5cblx0fS5iaW5kKHRoaXMpO1xuXG5cdHJlYWRlci5yZWFkQXNUZXh0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZC1wcm9qZWN0XCIpLmZpbGVzWzBdKTtcbn07XG5cblByb2plY3RNZW51Q29udHJvbGxlci5wcm90b3R5cGUubG9hZFByb2plY3QgPSBmdW5jdGlvbihkYXRhKSB7XG5cdHByb2plY3RNb2RlbC5kZXNlcmlhbGl6ZShkYXRhLnByb2plY3QpO1xuXHR0ZXh0dXJlc01vZGVsLmRlc2VyaWFsaXplKGRhdGEudGV4dHVyZSk7XG5cdGJhY2tncm91bmRNb2RlbC5kZXNlcmlhbGl6ZShkYXRhLmJhY2tncm91bmQpO1xuXG5cdHNlcnZpY2UubXNnLmVtaXQoXCJwcm9qZWN0L2xvYWRlZFwiKTtcbn07XG5cblByb2plY3RNZW51Q29udHJvbGxlci5wcm90b3R5cGUub25TYXZlUHJvamVjdCA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgZGF0YSA9IHt9O1xuXHRkYXRhLnByb2plY3QgPSBwcm9qZWN0TW9kZWwuc2VyaWFsaXplKCk7XG5cdGRhdGEudGV4dHVyZSA9IHRleHR1cmVzTW9kZWwuc2VyaWFsaXplKCk7XG5cdGRhdGEuYmFja2dyb3VuZCA9IGJhY2tncm91bmRNb2RlbC5zZXJpYWxpemUoKTtcblxuXHRmaWxlLnNhdmVBcyhcInByb2plY3QuanVwXCIsIGRhdGEpO1xufTtcblxuUHJvamVjdE1lbnVDb250cm9sbGVyLnByb3RvdHlwZS5vbkV4cG9ydENvbmZpZyA9IGZ1bmN0aW9uKCkge1xuXHRmaWxlLnNhdmVBc0pzb24oXCJwYXJ0aWNsZV9jb25maWdcIiwgcHJvamVjdE1vZGVsLmVtaXR0ZXIuZ2V0UGFyc2VyKCkud3JpdGUoKSk7XG59O1xuXG5Qcm9qZWN0TWVudUNvbnRyb2xsZXIucHJvdG90eXBlLm9uTG9hZENvbmZpZyA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcblx0cmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuXHRcdHByb2plY3RNb2RlbC5zZXRFbWl0dGVyQ29uZmlnKEpTT04ucGFyc2UocmVhZGVyLnJlc3VsdCkpO1xuXHR9LmJpbmQodGhpcyk7XG5cblx0cmVhZGVyLnJlYWRBc1RleHQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLWNvbmZpZ1wiKS5maWxlc1swXSk7XG59O1xuXG5Qcm9qZWN0TWVudUNvbnRyb2xsZXIucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMub25Mb2FkUHJlZGVmaW5lZChcInJhZGlhbFwiKTtcbn07XG5cblByb2plY3RNZW51Q29udHJvbGxlci5wcm90b3R5cGUub25Mb2FkUHJlZGVmaW5lZCA9IGZ1bmN0aW9uKG5hbWUpIHtcblx0dGhpcy5sb2FkUHJvamVjdChwcmVkZWZpbmVkTW9kZWwuZ2V0QnlOYW1lKG5hbWUpKTtcbn07XG5Qcm9qZWN0TWVudUNvbnRyb2xsZXIucHJvdG90eXBlLm9uRW1pdHRlckNvbmZpZ0NoYW5nZWQgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5yZWZyZXNoQmVoYXZpb3VycygpO1xuXHR0aGlzLnJlZnJlc2hFbWl0Q29udHJvbGxlcigpO1xuXHRzZXJ2aWNlLm1zZy5lbWl0KFwiZW1pdHRlci9jaGFuZ2VkXCIpO1xufTtcblxuUHJvamVjdE1lbnVDb250cm9sbGVyLnByb3RvdHlwZS5yZWZyZXNoQmVoYXZpb3VycyA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgYmVoYXZpb3VycyA9IHByb2plY3RNb2RlbC5lbWl0dGVyLmJlaGF2aW91cnMuZ2V0QWxsKCk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgYmVoYXZpb3Vycy5sZW5ndGg7IGkrKykge1xuXHRcdGJlaGF2aW91ck1vZGVsLmFkZEJlaGF2aW91cihiZWhhdmlvdXJzW2ldKTtcblx0fVxufTtcblxuUHJvamVjdE1lbnVDb250cm9sbGVyLnByb3RvdHlwZS5yZWZyZXNoRW1pdENvbnRyb2xsZXIgPSBmdW5jdGlvbigpIHtcblx0ZW1pc3Npb25Nb2RlbC5hZGRFbWlzc2lvbihwcm9qZWN0TW9kZWwuZW1pdHRlci5lbWl0Q29udHJvbGxlcik7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb2plY3RNZW51Q29udHJvbGxlcjsiLCJ2YXIgc2VydmljZSA9IHJlcXVpcmUoXCIuLi9zZXJ2aWNlXCIpO1xudmFyIHRleHR1cmVzTW9kZWwgPSByZXF1aXJlKFwiLi4vbW9kZWxcIikudGV4dHVyZXNNb2RlbDtcblxuZnVuY3Rpb24gVGV4dHVyZU1lbnVDb250cm9sbGVyKCkge1xuXHRzZXJ2aWNlLm1zZy5vbihcInRleHR1cmUvY2hhbmdlXCIsIHRoaXMub25UZXh0dXJlQ2hhbmdlKTtcblx0c2VydmljZS5tc2cub24oXCJ0ZXh0dXJlL3VwbG9hZFwiLCB0aGlzLm9uVXBsb2FkVGV4dHVyZSk7XG59XG5cblRleHR1cmVNZW51Q29udHJvbGxlci5wcm90b3R5cGUuZXhwb3J0UGFydGljbGVUZXh0dXJlID0gZnVuY3Rpb24oKSB7XG5cbn07XG5cblRleHR1cmVNZW51Q29udHJvbGxlci5wcm90b3R5cGUub25UZXh0dXJlQ2hhbmdlID0gZnVuY3Rpb24obmFtZSkge1xuXHR0ZXh0dXJlc01vZGVsLnNldFRleHR1cmVCeU5hbWUobmFtZSk7XG59O1xuXG5UZXh0dXJlTWVudUNvbnRyb2xsZXIucHJvdG90eXBlLm9uVXBsb2FkVGV4dHVyZSA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcblx0cmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuXHRcdHRleHR1cmVzTW9kZWwuc2V0VGV4dHVyZShQSVhJLlRleHR1cmUuZnJvbUltYWdlKHJlYWRlci5yZXN1bHQpKTtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWQtdGV4dHVyZVwiKS52YWx1ZSA9IG51bGw7XG5cblx0fS5iaW5kKHRoaXMpO1xuXG5cdHJlYWRlci5yZWFkQXNEYXRhVVJMKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZC10ZXh0dXJlXCIpLmZpbGVzWzBdKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVGV4dHVyZU1lbnVDb250cm9sbGVyOyIsInZhciBQcm9qZWN0TWVudUNvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9Qcm9qZWN0TWVudUNvbnRyb2xsZXIuanNcIik7XG52YXIgVGV4dHVyZU1lbnVDb250cm9sbGVyID0gcmVxdWlyZShcIi4vVGV4dHVyZU1lbnVDb250cm9sbGVyLmpzXCIpO1xudmFyIEJhY2tncm91bmRNZW51Q29udHJvbGxlciA9IHJlcXVpcmUoXCIuL0JhY2tncm91bmRNZW51Q29udHJvbGxlci5qc1wiKTtcbnZhciBCZWhhdmlvdXJDb250cm9sbGVyID0gcmVxdWlyZShcIi4vQmVoYXZpb3VyQ29udHJvbGxlci5qc1wiKTtcbnZhciBFbWlzc2lvbkNvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9FbWlzc2lvbkNvbnRyb2xsZXIuanNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRwcm9qZWN0TWVudUNvbnRyb2xsZXI6IG5ldyBQcm9qZWN0TWVudUNvbnRyb2xsZXIoKSxcblx0dGV4dHVyZU1lbnVDb250cm9sbGVyOiBuZXcgVGV4dHVyZU1lbnVDb250cm9sbGVyKCksXG5cdGJhY2tncm91bmRNZW51Q29udHJvbGxlcjogbmV3IEJhY2tncm91bmRNZW51Q29udHJvbGxlcigpLFxuXHRiZWhhdmlvdXJDb250cm9sbGVyOiBuZXcgQmVoYXZpb3VyQ29udHJvbGxlcigpLFxuXHRlbWlzc2lvbkNvbnRyb2xsZXI6IG5ldyBFbWlzc2lvbkNvbnRyb2xsZXIoKVxufTsiLCJ2YXIgTW9kZWwgPSByZXF1aXJlKFwiLi9Nb2RlbC5qc1wiKTtcbnZhciB1dGlsID0gcmVxdWlyZShcIi4uL3V0aWxcIik7XG5cbmZ1bmN0aW9uIEJhY2tncm91bmRNb2RlbCgpIHtcblx0TW9kZWwuY2FsbCh0aGlzKTtcblxuXHR0aGlzLnByb3BlcnR5KFwiY29sb3JcIiwgMHgwMDAwKTtcblx0dGhpcy5wcm9wZXJ0eShcImlzTG9ja2VkXCIsIHRydWUpO1xuXHR0aGlzLnByb3BlcnR5KFwidGV4dHVyZVwiLCBudWxsKTtcblx0dGhpcy5wcm9wZXJ0eShcImltYWdlUG9zaXRpb25cIiwgbmV3IFBJWEkuUG9pbnQoMCwgMCkpO1xufVxuXG51dGlsLmluaGVyaXQoQmFja2dyb3VuZE1vZGVsLCBNb2RlbCk7XG5cbkJhY2tncm91bmRNb2RlbC5wcm90b3R5cGUuc2VyaWFsaXplID0gZnVuY3Rpb24oKSB7XG5cdHZhciBkYXRhID0ge307XG5cdGRhdGEuY29sb3IgPSB0aGlzLmNvbG9yO1xuXHRkYXRhLmlzTG9ja2VkID0gdGhpcy5pc0xvY2tlZDtcblx0ZGF0YS5pbWFnZVBvc2l0aW9uID0ge3g6IHRoaXMuaW1hZ2VQb3NpdGlvbi54LCB5OiB0aGlzLmltYWdlUG9zaXRpb24ueX07XG5cdGlmICh0aGlzLnRleHR1cmUpIHtcblx0XHRkYXRhLnRleHR1cmVVcmwgPSB0aGlzLnRleHR1cmUuYmFzZVRleHR1cmUuaW1hZ2VVcmw7XG5cdH1cblxuXHRyZXR1cm4gZGF0YTtcbn07XG5cbkJhY2tncm91bmRNb2RlbC5wcm90b3R5cGUuZGVzZXJpYWxpemUgPSBmdW5jdGlvbihkYXRhKSB7XG5cdHRoaXMuY29sb3IgPSBkYXRhLmNvbG9yIHx8IDB4MDAwMDtcblx0dGhpcy5pc0xvY2tlZCA9IGRhdGEuaXNMb2NrZWQgfHwgdHJ1ZTtcblx0dGhpcy5pbWFnZVBvc2l0aW9uID0gbmV3IFBJWEkuUG9pbnQoZGF0YS5pbWFnZVBvc2l0aW9uLngsIGRhdGEuaW1hZ2VQb3NpdGlvbi55KTtcblxuXHRpZiAoZGF0YS50ZXh0dXJlVXJsKSB7XG5cdFx0dGhpcy50ZXh0dXJlID0gUElYSS5UZXh0dXJlLmZyb21JbWFnZShkYXRhLnRleHR1cmVVcmwpO1xuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhY2tncm91bmRNb2RlbDsiLCJmdW5jdGlvbiBCZWhhdmlvdXJNb2RlbCgpIHtcblxuXHR0aGlzLmJlaGF2aW91cnMgPSB7fTtcblx0dGhpcy5hZGRCZWhhdmlvdXIobmV3IGp1cGl0ZXIuTGlmZUJlaGF2aW91cigpKTtcblx0dGhpcy5hZGRCZWhhdmlvdXIobmV3IGp1cGl0ZXIuUG9zaXRpb25CZWhhdmlvdXIoKSk7XG5cdHRoaXMuYWRkQmVoYXZpb3VyKG5ldyBqdXBpdGVyLkNvbG9yQmVoYXZpb3VyKCkpO1xuXHR0aGlzLmFkZEJlaGF2aW91cihuZXcganVwaXRlci5TaXplQmVoYXZpb3VyKCkpO1xuXHR0aGlzLmFkZEJlaGF2aW91cihuZXcganVwaXRlci5Bbmd1bGFyVmVsb2NpdHlCZWhhdmlvdXIoKSk7XG5cdHRoaXMuYWRkQmVoYXZpb3VyKG5ldyBqdXBpdGVyLkVtaXREaXJlY3Rpb25CZWhhdmlvdXIoKSk7XG5cdHRoaXMuYWRkQmVoYXZpb3VyKG5ldyBqdXBpdGVyLlJvdGF0aW9uQmVoYXZpb3VyKCkpO1xufVxuXG5CZWhhdmlvdXJNb2RlbC5wcm90b3R5cGUuYWRkQmVoYXZpb3VyID0gZnVuY3Rpb24oYmVoYXZpb3VyKSB7XG5cdGlmICh0aGlzLmJlaGF2aW91cnNbYmVoYXZpb3VyLmdldE5hbWUoKV0pIHtcblx0XHR0aGlzLmJlaGF2aW91cnNbYmVoYXZpb3VyLmdldE5hbWUoKV0gPSBudWxsO1xuXHRcdGRlbGV0ZSB0aGlzLmJlaGF2aW91cnNbYmVoYXZpb3VyLmdldE5hbWUoKV07XG5cdH1cblxuXHR0aGlzLmJlaGF2aW91cnNbYmVoYXZpb3VyLmdldE5hbWUoKV0gPSBiZWhhdmlvdXI7XG59O1xuXG5CZWhhdmlvdXJNb2RlbC5wcm90b3R5cGUuZ2V0QmVoYXZpb3VyQnlOYW1lID0gZnVuY3Rpb24obmFtZSkge1xuXHRpZiAoIXRoaXMuYmVoYXZpb3Vyc1tuYW1lXSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIk5vIGJlaGF2aW91ciBieSBnaXZlbiBuYW1lID0gXCIgKyBuYW1lKTtcblx0fVxuXG5cdHJldHVybiB0aGlzLmJlaGF2aW91cnNbbmFtZV07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJlaGF2aW91ck1vZGVsOyIsImZ1bmN0aW9uIEVtaXNzaW9uTW9kZWwoKSB7XG5cblx0dGhpcy5lbWlzc2lvbnMgPSB7fTtcblxuXHRmb3IgKHZhciBrZXkgaW4ganVwaXRlci5FbWlzc2lvblR5cGVzKSB7XG5cdFx0dmFyIG5hbWUgPSBqdXBpdGVyLkVtaXNzaW9uVHlwZXNba2V5XTtcblx0XHR0aGlzLmFkZEVtaXNzaW9uKG5ldyBqdXBpdGVyW25hbWVdKTtcblx0fVxuXG59XG5cbkVtaXNzaW9uTW9kZWwucHJvdG90eXBlLmFkZEVtaXNzaW9uID0gZnVuY3Rpb24oZW1pc3Npb24pIHtcblx0aWYgKHRoaXMuZW1pc3Npb25zW2VtaXNzaW9uLmdldE5hbWUoKV0pIHtcblx0XHR0aGlzLmVtaXNzaW9uc1tlbWlzc2lvbi5nZXROYW1lKCldID0gbnVsbDtcblx0XHRkZWxldGUgdGhpcy5lbWlzc2lvbnNbZW1pc3Npb24uZ2V0TmFtZSgpXTtcblx0fVxuXG5cdHRoaXMuZW1pc3Npb25zW2VtaXNzaW9uLmdldE5hbWUoKV0gPSBlbWlzc2lvbjtcbn07XG5cbkVtaXNzaW9uTW9kZWwucHJvdG90eXBlLmdldEVtaXNzaW9uQnlOYW1lID0gZnVuY3Rpb24obmFtZSkge1xuXHRpZiAoIXRoaXMuZW1pc3Npb25zW25hbWVdKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiTm8gYmVoYXZpb3VyIGJ5IGdpdmVuIG5hbWUgPSBcIiArIG5hbWUpO1xuXHR9XG5cblx0cmV0dXJuIHRoaXMuZW1pc3Npb25zW25hbWVdO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFbWlzc2lvbk1vZGVsOyIsInZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKFwiZXZlbnRlbWl0dGVyM1wiKTtcbnZhciB1dGlsID0gcmVxdWlyZShcIi4uL3V0aWxcIik7XG5cbmZ1bmN0aW9uIE1vZGVsKCkge1xuXHRFdmVudEVtaXR0ZXIuY2FsbCh0aGlzKTtcblx0dXRpbC5iaW5kKHRoaXMpO1xufVxuXG51dGlsLmluaGVyaXQoTW9kZWwsIEV2ZW50RW1pdHRlcik7XG5cbk1vZGVsLnByb3RvdHlwZS5wcm9wZXJ0eSA9IGZ1bmN0aW9uKHByb3BlcnR5LCBkZWZhdWx0VmFsdWUpIHtcblx0dmFyIF92YWx1ZTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIHByb3BlcnR5LCB7XG5cdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBfdmFsdWU7XG5cdFx0fSxcblx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAoX3ZhbHVlICE9PSB2YWx1ZSkge1xuXHRcdFx0XHR2YXIgcHJldiA9IF92YWx1ZTtcblx0XHRcdFx0X3ZhbHVlID0gdmFsdWU7XG5cdFx0XHRcdHRoaXMuZW1pdChwcm9wZXJ0eSArIFwiL2NoYW5nZWRcIiwgdmFsdWUsIHByZXYpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblx0aWYgKGRlZmF1bHRWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0dGhpc1twcm9wZXJ0eV0gPSBkZWZhdWx0VmFsdWU7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWw7IiwiZnVuY3Rpb24gUGFydGljbGVNb2RlbCgpe1xuXHR0aGlzLnRleHR1cmUgPSBudWxsO1xuXHR0aGlzLm5hbWUgPSBudWxsO1xuXHR0aGlzLnByZWRlZmluZWQgPSBmYWxzZTtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFBhcnRpY2xlTW9kZWw7IiwiZnVuY3Rpb24gUHJlZGVmaW5lZE1vZGVsKCkge1xuXHR0aGlzLmNvbmZpZ3MgPSB7fTtcbn1cblxuUHJlZGVmaW5lZE1vZGVsLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihuYW1lLCBjb25maWcpIHtcblx0dGhpcy5jb25maWdzW25hbWVdID0gY29uZmlnO1xufTtcblxuUHJlZGVmaW5lZE1vZGVsLnByb3RvdHlwZS5nZXRCeU5hbWUgPSBmdW5jdGlvbihuYW1lKSB7XG5cdHJldHVybiB0aGlzLmNvbmZpZ3NbbmFtZV07XG59O1xuXG5QcmVkZWZpbmVkTW9kZWwucHJvdG90eXBlLmdldEFsbENvbmZpZ3MgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuY29uZmlnczsgLy90b2RvOiBjb25jYXQ/XG59O1xuXG5QcmVkZWZpbmVkTW9kZWwucHJvdG90eXBlLmdldE5hbWVzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiBPYmplY3Qua2V5cyh0aGlzLmNvbmZpZ3MpO1xufTtcblxuUHJlZGVmaW5lZE1vZGVsLnByb3RvdHlwZS5nZXRDb25maWdVcmxzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiBbXG5cdFx0XCJhc3NldHMvY29uZmlnL2RlZmF1bHQuanVwXCIsXG5cdFx0XCJhc3NldHMvY29uZmlnL2ZpcmV3b3JrLmp1cFwiLFxuXHRcdFwiYXNzZXRzL2NvbmZpZy9ncmVlbl9jaGFvcy5qdXBcIixcblx0XHRcImFzc2V0cy9jb25maWcvcmFkaWFsLmp1cFwiLFxuXHRcdFwiYXNzZXRzL2NvbmZpZy9yYW5kb21fZW1pdF90ZXN0Lmp1cFwiLFxuXHRcdFwiYXNzZXRzL2NvbmZpZy9yYWRpYWxfdGVzdF8yLmp1cFwiLFxuXHRdO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcmVkZWZpbmVkTW9kZWw7IiwidmFyIE1vZGVsID0gcmVxdWlyZShcIi4vTW9kZWwuanNcIik7XG52YXIgdXRpbCA9IHJlcXVpcmUoXCIuLi91dGlsXCIpO1xuXG5mdW5jdGlvbiBQcm9qZWN0TW9kZWwoKSB7XG5cdE1vZGVsLmNhbGwodGhpcyk7XG5cblx0dGhpcy5zdGFnZVNpemUgPSBuZXcgUElYSS5Qb2ludCg2MDAsIDYwMCk7XG5cdHRoaXMuZW1pdHRlciA9IG5ldyBqdXBpdGVyLkVtaXR0ZXIoKTtcblx0dGhpcy5wcm9wZXJ0eShcIm1hcmtlclBvc2l0aW9uXCIsIG5ldyBQSVhJLlBvaW50KDAuNSwgMC41KSk7XG59XG5cbnV0aWwuaW5oZXJpdChQcm9qZWN0TW9kZWwsIE1vZGVsKTtcblxuUHJvamVjdE1vZGVsLnByb3RvdHlwZS5oYXNBY3RpdmVCZWhhdmlvdXIgPSBmdW5jdGlvbihiZWhhdmlvdXIpIHtcblx0dmFyIGJlaGF2aW91cyA9IHRoaXMuZW1pdHRlci5iZWhhdmlvdXJzLmdldEFsbCgpO1xuXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgYmVoYXZpb3VzLmxlbmd0aDsgKytpKSB7XG5cdFx0aWYgKGJlaGF2aW91c1tpXS5nZXROYW1lKCkgPT09IGJlaGF2aW91ci5nZXROYW1lKCkpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBmYWxzZTtcbn07XG5cblByb2plY3RNb2RlbC5wcm90b3R5cGUuc2VyaWFsaXplID0gZnVuY3Rpb24oKSB7XG5cdHZhciBkYXRhID0ge307XG5cdGRhdGEuZW1pdHRlckNvbmZpZyA9IHRoaXMuZW1pdHRlci5nZXRQYXJzZXIoKS53cml0ZSgpO1xuXHRkYXRhLm1hcmtlclBvc2l0aW9uID0ge3g6IHRoaXMubWFya2VyUG9zaXRpb24ueCwgeTogdGhpcy5tYXJrZXJQb3NpdGlvbi55fTtcblxuXHRyZXR1cm4gZGF0YTtcbn07XG5cblByb2plY3RNb2RlbC5wcm90b3R5cGUuZGVzZXJpYWxpemUgPSBmdW5jdGlvbihkYXRhKSB7XG5cdHRoaXMubWFya2VyUG9zaXRpb24gPSBuZXcgUElYSS5Qb2ludChkYXRhLm1hcmtlclBvc2l0aW9uLngsIGRhdGEubWFya2VyUG9zaXRpb24ueSk7XG5cdHRoaXMuc2V0RW1pdHRlckNvbmZpZyhkYXRhLmVtaXR0ZXJDb25maWcpO1xufTtcblxuUHJvamVjdE1vZGVsLnByb3RvdHlwZS5zZXRFbWl0dGVyQ29uZmlnID0gZnVuY3Rpb24oY29uZmlnKSB7XG5cdHRoaXMuZW1pdHRlci5nZXRQYXJzZXIoKS5yZWFkKGNvbmZpZyk7XG5cdHRoaXMuZW1pdChcImVtaXR0ZXJDb25maWcvY2hhbmdlZFwiKTtcbn07XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm9qZWN0TW9kZWwucHJvdG90eXBlLCBcIm1hcmtlclBvc2l0aW9uSW5TdGFnZUNvb3JkaW5hdGVzXCIsIHtcblx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gbmV3IFBJWEkuUG9pbnQodGhpcy5tYXJrZXJQb3NpdGlvbi54ICogdGhpcy5zdGFnZVNpemUueCwgdGhpcy5tYXJrZXJQb3NpdGlvbi55ICogdGhpcy5zdGFnZVNpemUueSk7XG5cdH0sXG5cdHNldDogZnVuY3Rpb24odmFsdWUpIHtcblx0XHR0aGlzLm1hcmtlclBvc2l0aW9uID0gbmV3IFBJWEkuUG9pbnQodmFsdWUueCAvIHRoaXMuc3RhZ2VTaXplLngsIHZhbHVlLnkgLyB0aGlzLnN0YWdlU2l6ZS55KTtcblx0fVxufSk7XG5tb2R1bGUuZXhwb3J0cyA9IFByb2plY3RNb2RlbDsiLCJ2YXIgTW9kZWwgPSByZXF1aXJlKFwiLi9Nb2RlbC5qc1wiKTtcbnZhciB1dGlsID0gcmVxdWlyZShcIi4uL3V0aWxcIik7XG5cbnZhciBQUkVERUZJTkVEX1RFWFRVUkVTID0gW1xuXHR7bmFtZTogXCJmbGFyZV9ibHVlXCIsIHVybDogXCJhc3NldHMvZmxhcmVfYmx1ZS5wbmdcIn0sXG5cdHtuYW1lOiBcImNsb3VkXCIsIHVybDogXCJhc3NldHMvY2xvdWQucG5nXCJ9LFxuXHR7bmFtZTogXCJjbG91ZDJcIiwgdXJsOiBcImFzc2V0cy9jbG91ZDIucG5nXCJ9LFxuXHR7bmFtZTogXCJmbGFyZVwiLCB1cmw6IFwiYXNzZXRzL2ZsYXJlLnBuZ1wifSxcblx0e25hbWU6IFwic3BhcmtsZVwiLCB1cmw6IFwiYXNzZXRzL3NwYXJrbGUucG5nXCJ9LFxuXHR7bmFtZTogXCJjaXJjbGVcIiwgdXJsOiBcImFzc2V0cy9jaXJjbGUucG5nXCJ9XG5dO1xuXG5mdW5jdGlvbiBUZXh0dXJlc01vZGVsKCkge1xuXHRNb2RlbC5jYWxsKHRoaXMpO1xuXG5cdHRoaXMudGV4dHVyZXMgPSBQUkVERUZJTkVEX1RFWFRVUkVTLmNvbmNhdCgpO1xuXHR0aGlzLmN1cnJlbnRUZXh0dXJlTmFtZSA9IG51bGw7XG5cdHRoaXMucHJvcGVydHkoXCJjdXJyZW50VGV4dHVyZVwiLCBudWxsKTtcbn1cblxudXRpbC5pbmhlcml0KFRleHR1cmVzTW9kZWwsIE1vZGVsKTtcblxuVGV4dHVyZXNNb2RlbC5wcm90b3R5cGUuc2V0RGVmYXVsdFRleHR1cmUgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5zZXRUZXh0dXJlQnlOYW1lKFwiY2lyY2xlXCIpO1xufTtcblxuVGV4dHVyZXNNb2RlbC5wcm90b3R5cGUuc2V0VGV4dHVyZUJ5TmFtZSA9IGZ1bmN0aW9uKG5hbWUpIHtcblx0dmFyIHVybDtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnRleHR1cmVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0aWYgKHRoaXMudGV4dHVyZXNbaV0ubmFtZSA9PT0gbmFtZSkge1xuXHRcdFx0dXJsID0gdGhpcy50ZXh0dXJlc1tpXS51cmw7XG5cdFx0fVxuXHR9XG5cdHRoaXMuY3VycmVudFRleHR1cmVOYW1lID0gbmFtZTtcblx0dGhpcy5jdXJyZW50VGV4dHVyZSA9IFBJWEkuVGV4dHVyZS5mcm9tRnJhbWUodXJsKTtcbn07XG5cblRleHR1cmVzTW9kZWwucHJvdG90eXBlLnNldFRleHR1cmUgPSBmdW5jdGlvbih0ZXh0dXJlKSB7XG5cdHRoaXMuY3VycmVudFRleHR1cmVOYW1lID0gbnVsbDtcblx0dGhpcy5jdXJyZW50VGV4dHVyZSA9IHRleHR1cmU7XG59O1xuXG5UZXh0dXJlc01vZGVsLnByb3RvdHlwZS5nZXRDdXJyZW50VGV4dHVyZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5jdXJyZW50VGV4dHVyZTtcbn07XG5cblRleHR1cmVzTW9kZWwucHJvdG90eXBlLmdldFRleHR1cmVzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLnRleHR1cmVzO1xufTtcblxuVGV4dHVyZXNNb2RlbC5wcm90b3R5cGUuZ2V0VGV4dHVyZVVybHMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuZ2V0VGV4dHVyZXMoKS5tYXAoZnVuY3Rpb24odGV4dHVyZSkge1xuXHRcdHJldHVybiB0ZXh0dXJlLnVybDtcblx0fSk7XG59O1xuXG5UZXh0dXJlc01vZGVsLnByb3RvdHlwZS5zZXJpYWxpemUgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHtuYW1lOiB0aGlzLmN1cnJlbnRUZXh0dXJlTmFtZSwgdXJsOiB0aGlzLmN1cnJlbnRUZXh0dXJlLmJhc2VUZXh0dXJlLmltYWdlVXJsfTtcbn07XG5cblRleHR1cmVzTW9kZWwucHJvdG90eXBlLmRlc2VyaWFsaXplID0gZnVuY3Rpb24oZGF0YSkge1xuXHRpZiAoZGF0YS5uYW1lKSB7XG5cdFx0dGhpcy5zZXRUZXh0dXJlQnlOYW1lKGRhdGEubmFtZSk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0dGhpcy5zZXRUZXh0dXJlKFBJWEkuVGV4dHVyZS5mcm9tSW1hZ2UoZGF0YS51cmwpKTtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUZXh0dXJlc01vZGVsOyIsInZhciBQcm9qZWN0TW9kZWwgPSByZXF1aXJlKFwiLi9Qcm9qZWN0TW9kZWwuanNcIik7XG52YXIgQmFja2dyb3VuZE1vZGVsID0gcmVxdWlyZShcIi4vQmFja2dyb3VuZE1vZGVsLmpzXCIpO1xudmFyIFBhcnRpY2xlTW9kZWwgPSByZXF1aXJlKFwiLi9QYXJ0aWNsZU1vZGVsLmpzXCIpO1xudmFyIEJlaGF2aW91ck1vZGVsID0gcmVxdWlyZShcIi4vQmVoYXZpb3VyTW9kZWwuanNcIik7XG52YXIgUHJlZGVmaW5lZE1vZGVsID0gcmVxdWlyZShcIi4vUHJlZGVmaW5lZE1vZGVsLmpzXCIpO1xudmFyIFRleHR1cmVzTW9kZWwgPSByZXF1aXJlKFwiLi9UZXh0dXJlc01vZGVsLmpzXCIpO1xudmFyIEVtaXNzaW9uTW9kZWwgPSByZXF1aXJlKFwiLi9FbWlzc2lvbk1vZGVsLmpzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0cHJvamVjdE1vZGVsOiBuZXcgUHJvamVjdE1vZGVsKCksXG5cdHBhcnRpY2xlTW9kZWw6IG5ldyBQYXJ0aWNsZU1vZGVsKCksXG5cdGJlaGF2aW91ck1vZGVsOiBuZXcgQmVoYXZpb3VyTW9kZWwoKSxcblx0cHJlZGVmaW5lZE1vZGVsOiBuZXcgUHJlZGVmaW5lZE1vZGVsKCksXG5cdHRleHR1cmVzTW9kZWw6IG5ldyBUZXh0dXJlc01vZGVsKCksXG5cdGJhY2tncm91bmRNb2RlbDogbmV3IEJhY2tncm91bmRNb2RlbCgpLFxuXHRlbWlzc2lvbk1vZGVsOiBuZXcgRW1pc3Npb25Nb2RlbCgpXG59OyIsImZ1bmN0aW9uIEZpbGVTZXJ2aWNlKCkge1xuXG59XG5cbkZpbGVTZXJ2aWNlLnByb3RvdHlwZS5zYXZlQXNKc29uID0gZnVuY3Rpb24obmFtZSwgZGF0YSkge1xuXHR0aGlzLnNhdmVBcyhuYW1lICsgXCIuanNvblwiLCBkYXRhKTtcbn07XG5cbkZpbGVTZXJ2aWNlLnByb3RvdHlwZS5zYXZlQXMgPSBmdW5jdGlvbihuYW1lLCBkYXRhKSB7XG5cdGNvbnNvbGUubG9nKFwic2F2ZSBhcyBcIiwgbmFtZSwgXCJkYXRhIFwiLCBkYXRhKTtcblx0dmFyIGJsb2IgPSBuZXcgQmxvYihbSlNPTi5zdHJpbmdpZnkoZGF0YSldLCB7dHlwZTogXCJhcHBsaWNhdGlvbi9qc29uXCJ9KTtcblx0c2F2ZUFzKGJsb2IsIG5hbWUpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBGaWxlU2VydmljZTsiLCJ2YXIgRmlsZVNlcnZpY2UgPSByZXF1aXJlKFwiLi9GaWxlU2VydmljZS5qc1wiKTtcbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKFwiZXZlbnRlbWl0dGVyM1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdG1zZzogbmV3IEV2ZW50RW1pdHRlcigpLFxuXHRmaWxlOiBuZXcgRmlsZVNlcnZpY2UoKVxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHNjb3BlKSB7XG5cdGZvciAodmFyIGkgaW4gc2NvcGUpIHtcblx0XHRpZiAodHlwZW9mIHNjb3BlW2ldID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdHNjb3BlW2ldID0gc2NvcGVbaV0uYmluZChzY29wZSk7XG5cdFx0fVxuXHR9XG59OyIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRpbmhlcml0OiByZXF1aXJlKFwiLi9pbmhlcml0LmpzXCIpLFxuXHRiaW5kOiByZXF1aXJlKFwiLi9iaW5kLmpzXCIpXG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY2hpbGRDbGFzcywgYmFzZUNsYXNzKSB7XG5cdGNoaWxkQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShiYXNlQ2xhc3MucHJvdG90eXBlKTtcblx0Y2hpbGRDbGFzcy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjaGlsZENsYXNzO1xufTsiLCJ2YXIgTWVudSA9IHJlcXVpcmUoXCIuL21lbnUvTWVudS5qc1wiKTtcbnZhciBQYXJ0aWNsZVZpZXcgPSByZXF1aXJlKFwiLi9QYXJ0aWNsZVZpZXcuanNcIik7XG52YXIgU3RhZ2UgPSByZXF1aXJlKFwiLi9zdGFnZS9TdGFnZS5qc1wiKTtcbnZhciBiYWNrZ3JvdW5kTW9kZWwgPSByZXF1aXJlKFwiLi4vbW9kZWxcIikuYmFja2dyb3VuZE1vZGVsO1xudmFyIHNlcnZpY2UgPSByZXF1aXJlKFwiLi4vc2VydmljZVwiKTtcblxuZnVuY3Rpb24gTWFpblZpZXcoKSB7XG5cdHRoaXMucmVuZGVyZXIgPSB0aGlzLmNyZWF0ZVJlbmRlcmVyKCk7XG5cdHRoaXMuc3RhZ2UgPSB0aGlzLmNyZWF0ZVN0YWdlKCk7XG5cdHRoaXMuc3RhdHMgPSB0aGlzLmNyZWF0ZVN0YXRzKCk7XG5cdHRoaXMucGFydGljbGVWaWV3ID0gdGhpcy5jcmVhdGVQYXJ0aWNsZVZpZXcoKTtcblx0dGhpcy5tZW51ID0gdGhpcy5jcmVhdGVNZW51KCk7XG5cblx0c2VydmljZS5tc2cuZW1pdChcInByb2plY3QvbG9hZFByZWRlZmluZWRcIiwgXCJkZWZhdWx0XCIpO1xuXHR0aGlzLmRyYXcoKTtcbn1cblxuTWFpblZpZXcucHJvdG90eXBlLmNyZWF0ZVN0YWdlID0gZnVuY3Rpb24oKSB7XG5cdC8vdG9kbzogc2l6ZSBmcm9tIFxuXHRyZXR1cm4gbmV3IFN0YWdlKG5ldyBQSVhJLlJlY3RhbmdsZSgwLCAwLCA2MDAsIDYwMCkpO1xufTtcblxuTWFpblZpZXcucHJvdG90eXBlLmNyZWF0ZVJlbmRlcmVyID0gZnVuY3Rpb24oKSB7XG5cdC8vdG9kbzogYXV0b2RldGVjdCByZW5kZXJlclxuXHQvL3RvZG86IGR5bmFtaWMgc2l6ZSBvZiByZW5kZXJlclxuXHR2YXIgcmVuZGVyZXIgPSBuZXcgUElYSS5XZWJHTFJlbmRlcmVyKDYwMCwgNjAwKTtcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdGFnZVwiKS5hcHBlbmRDaGlsZChyZW5kZXJlci52aWV3KTtcblxuXHRiYWNrZ3JvdW5kTW9kZWwub24oXCJjb2xvci9jaGFuZ2VkXCIsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0cmVuZGVyZXIuYmFja2dyb3VuZENvbG9yID0gdmFsdWU7XG5cdH0pO1xuXHRyZXR1cm4gcmVuZGVyZXI7XG59O1xuXG5NYWluVmlldy5wcm90b3R5cGUuY3JlYXRlU3RhdHMgPSBmdW5jdGlvbigpIHtcblx0dmFyIHN0YXRzID0gbmV3IFN0YXRzKCk7XG5cdHN0YXRzLmRvbUVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG5cdHN0YXRzLmRvbUVsZW1lbnQuc3R5bGUubGVmdCA9IFwiMHB4XCI7XG5cdHN0YXRzLmRvbUVsZW1lbnQuc3R5bGUudG9wID0gXCIwcHhcIjtcblx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzdGF0cy5kb21FbGVtZW50KTtcblx0cmV0dXJuIHN0YXRzO1xufTtcblxuTWFpblZpZXcucHJvdG90eXBlLmNyZWF0ZU1lbnUgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIG5ldyBNZW51KCk7XG59O1xuXG5NYWluVmlldy5wcm90b3R5cGUuY3JlYXRlUGFydGljbGVWaWV3ID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLnN0YWdlLmFkZENoaWxkKG5ldyBQYXJ0aWNsZVZpZXcoKSk7XG59O1xuXG5NYWluVmlldy5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKCkge1xuXHRQSVhJLnRpY2tlci5zaGFyZWQuYWRkKGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuc3RhdHMuYmVnaW4oKTtcblx0XHR0aGlzLnJlbmRlcmVyLnJlbmRlcih0aGlzLnN0YWdlKTtcblx0XHR0aGlzLnN0YXRzLmVuZCgpO1xuXHR9LCB0aGlzKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTWFpblZpZXc7IiwidmFyIHV0aWwgPSByZXF1aXJlKFwiLi4vdXRpbFwiKTtcbnZhciBzZXJ2aWNlID0gcmVxdWlyZShcIi4uL3NlcnZpY2VcIik7XG5cbmZ1bmN0aW9uIE1hcmtlcihvbkRyYWcpIHtcblx0UElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcblx0dXRpbC5iaW5kKHRoaXMpO1xuXG5cdHRoaXMub25EcmFnID0gb25EcmFnO1xuXHR0aGlzLmludGVyYWN0aXZlID0gdHJ1ZTtcblx0dGhpcy5idXR0b25Nb2RlID0gdHJ1ZTtcblx0dGhpcy5kcmFnZ2luZyA9IGZhbHNlO1xuXHR0aGlzLmltYWdlID0gdGhpcy5jcmVhdGVJbWFnZSgpO1xuXG5cdHRoaXMubW91c2Vkb3duID0gdGhpcy50b3VjaHN0YXJ0ID0gdGhpcy5vbk1vdXNlRG93bjtcblx0dGhpcy5tb3VzZXVwID0gdGhpcy5tb3VzZXVwb3V0c2lkZSA9IHRoaXMudG91Y2hlbmQgPSB0aGlzLnRvdWNoZW5kb3V0c2lkZSA9IHRoaXMub25Nb3VzZVVwO1xuXHR0aGlzLm1vdXNlbW92ZSA9IHRoaXMudG91Y2htb3ZlID0gdGhpcy5vbk1vdXNlTW92ZTtcblxuXHRzZXJ2aWNlLm1zZy5vbihcInN0YWdlL21vdXNlT3ZlclwiLCB0aGlzLm9uTW91c2VPdmVyU3RhZ2UpO1xuXHRzZXJ2aWNlLm1zZy5vbihcInN0YWdlL21vdXNlT3V0XCIsIHRoaXMub25Nb3VzZU91dFN0YWdlKTtcbn1cblxudXRpbC5pbmhlcml0KE1hcmtlciwgUElYSS5Db250YWluZXIpO1xuXG5NYXJrZXIucHJvdG90eXBlLmNyZWF0ZUltYWdlID0gZnVuY3Rpb24oKSB7XG5cdHZhciBpbWFnZSA9IFBJWEkuU3ByaXRlLmZyb21GcmFtZShcIm1hcmtlci5wbmdcIik7XG5cdGltYWdlLmFuY2hvci5zZXQoMC41LCAwLjUpO1xuXHRpbWFnZS5hbHBoYSA9IDAuNztcblxuXHRyZXR1cm4gdGhpcy5hZGRDaGlsZChpbWFnZSk7XG59O1xuXG5NYXJrZXIucHJvdG90eXBlLm9uTW91c2VEb3duID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuZHJhZ2dpbmcgPSB0cnVlO1xufTtcblxuTWFya2VyLnByb3RvdHlwZS5vbk1vdXNlVXAgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5kcmFnZ2luZyA9IGZhbHNlO1xufTtcblxuTWFya2VyLnByb3RvdHlwZS5vbk1vdXNlTW92ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdGlmICh0aGlzLmRyYWdnaW5nKSB7XG5cdFx0dmFyIG5ld1Bvc2l0aW9uID0gZXZlbnQuZGF0YS5nZXRMb2NhbFBvc2l0aW9uKHRoaXMucGFyZW50KTtcblx0XHR0aGlzLm9uRHJhZyhuZXdQb3NpdGlvbik7XG5cdH1cbn07XG5cbk1hcmtlci5wcm90b3R5cGUub25Nb3VzZU92ZXJTdGFnZSA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLmltYWdlLmFscGhhID0gMC41O1xufTtcblxuTWFya2VyLnByb3RvdHlwZS5vbk1vdXNlT3V0U3RhZ2UgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5pbWFnZS5hbHBoYSA9IDAuMjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTWFya2VyOyIsInZhciB1dGlsID0gcmVxdWlyZShcIi4uL3V0aWxcIik7XG52YXIgc2VydmljZSA9IHJlcXVpcmUoXCIuLi9zZXJ2aWNlXCIpO1xudmFyIHByb2plY3RNb2RlbCA9IHJlcXVpcmUoXCIuLi9tb2RlbFwiKS5wcm9qZWN0TW9kZWw7XG52YXIgdGV4dHVyZXNNb2RlbCA9IHJlcXVpcmUoXCIuLi9tb2RlbFwiKS50ZXh0dXJlc01vZGVsO1xuXG5mdW5jdGlvbiBQYXJ0aWNsZVZpZXcoKSB7XG5cdFBJWEkuQ29udGFpbmVyLmNhbGwodGhpcyk7XG5cdHV0aWwuYmluZCh0aGlzKTtcblxuXHR2YXIgcmVuZGVyZXIgPSBuZXcganVwaXRlci5SZW5kZXJlcihwcm9qZWN0TW9kZWwuZW1pdHRlciwgdGV4dHVyZXNNb2RlbC5nZXRDdXJyZW50VGV4dHVyZSgpKTtcblx0dGhpcy5yZW5kZXJlciA9IHRoaXMuYWRkQ2hpbGQocmVuZGVyZXIpO1xuXG5cdHByb2plY3RNb2RlbC5vbihcIm1hcmtlclBvc2l0aW9uL2NoYW5nZWRcIiwgdGhpcy5yZWZyZXNoUmVuZGVyZXJQb3NpdGlvbik7XG5cdHRleHR1cmVzTW9kZWwub24oXCJjdXJyZW50VGV4dHVyZS9jaGFuZ2VkXCIsIHRoaXMub25UZXh0dXJlQ2hhbmdlZCk7XG5cdHNlcnZpY2UubXNnLm9uKFwicHJvamVjdC9sb2FkZWRcIiwgdGhpcy5vblByb2plY3RMb2FkZWQpO1xuXHRwcm9qZWN0TW9kZWwuZW1pdHRlci5vbihcImVtaXR0ZXIvY29tcGxldGVcIiwgdGhpcy5vbkNvbXBsZXRlKTtcblxuXHR0aGlzLnJlZnJlc2hSZW5kZXJlclBvc2l0aW9uKCk7XG59XG5cbnV0aWwuaW5oZXJpdChQYXJ0aWNsZVZpZXcsIFBJWEkuQ29udGFpbmVyKTtcblxuUGFydGljbGVWaWV3LnByb3RvdHlwZS5yZWZyZXNoUmVuZGVyZXJQb3NpdGlvbiA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnJlbmRlcmVyLnBvc2l0aW9uID0gcHJvamVjdE1vZGVsLm1hcmtlclBvc2l0aW9uSW5TdGFnZUNvb3JkaW5hdGVzO1xufTtcblxuUGFydGljbGVWaWV3LnByb3RvdHlwZS5vblRleHR1cmVDaGFuZ2VkID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMucmVuZGVyZXIudGV4dHVyZSA9IHRleHR1cmVzTW9kZWwuZ2V0Q3VycmVudFRleHR1cmUoKTtcbn07XG5cblBhcnRpY2xlVmlldy5wcm90b3R5cGUub25Qcm9qZWN0TG9hZGVkID0gZnVuY3Rpb24oKSB7XG5cdHByb2plY3RNb2RlbC5lbWl0dGVyLnJlc2V0KCk7XG59O1xuXG5QYXJ0aWNsZVZpZXcucHJvdG90eXBlLm9uQ29tcGxldGUgPSBmdW5jdGlvbigpIHtcblx0cHJvamVjdE1vZGVsLmVtaXR0ZXIucmVzZXRBbmRQbGF5KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBhcnRpY2xlVmlldztcblxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdHNsaWRlcjogcmVxdWlyZShcIi4vc2xpZGVyLmpzXCIpXG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGl0bGUsIHN0eWxlKSB7XG5cdHN0eWxlID0gc3R5bGUgfHwge307XG5cblx0dmFyIHN0ZXAgPSBzdHlsZS5zdGVwIHx8IDE7XG5cdHZhciBtaW4gPSBzdHlsZS5taW4gfHwgMDtcblx0dmFyIG1heCA9IHN0eWxlLm1heCB8fCAxMDA7XG5cblx0c3R5bGUuc3RlcCA9IDE7XG5cdHN0eWxlLnRpdGxlID0gdGl0bGUgKyBcIiBcIiArIHN0eWxlLnZhbHVlO1xuXHRzdHlsZS5taW4gPSBtaW4gLyBzdGVwO1xuXHRzdHlsZS5tYXggPSBtYXggLyBzdGVwO1xuXHRzdHlsZS52YWx1ZSA9IChzdHlsZS52YWx1ZSAtIG1pbikgLyBzdGVwO1xuXG5cdHZhciB1cGRhdGUgPSBmdW5jdGlvbihzbGlkZXIsIGludm9rZU9uQ2hhbmdlZCkge1xuXHRcdHZhciB2YWx1ZSA9ICgoc2xpZGVyLmdldFZhbHVlKCkgKiBzdGVwKSkudG9GaXhlZChzdGVwIDwgMSA/IDIgOiAwKTtcblx0XHRzbGlkZXIuZGVmaW5lKFwidGl0bGVcIiwgdGl0bGUgKyBcIiBcIiArIHZhbHVlKTtcblx0XHRzbGlkZXIucmVmcmVzaCgpO1xuXG5cdFx0aWYgKHNsaWRlci5vbkNoYW5nZWQgJiYgaW52b2tlT25DaGFuZ2VkKSB7XG5cdFx0XHRzbGlkZXIub25DaGFuZ2VkKHBhcnNlRmxvYXQodmFsdWUpKTtcblx0XHR9XG5cdH07XG5cblx0c3R5bGUuc2V0VmFsdWUgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdCQkKHN0eWxlLmlkKS5jb25maWcudmFsdWUgPSAoKHZhbHVlKSAvIHN0ZXApO1xuXHRcdHVwZGF0ZSgkJChzdHlsZS5pZCksIGZhbHNlKTtcblx0fTtcblxuXHRzdHlsZS5vbiA9IHtcblx0XHRvbkNoYW5nZTogZnVuY3Rpb24oKSB7XG5cdFx0XHR1cGRhdGUodGhpcywgdHJ1ZSk7XG5cdFx0fSxcblx0XHRvblNsaWRlckRyYWc6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dXBkYXRlKHRoaXMsIHRydWUpO1xuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4gc3R5bGU7XG59OyIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRtZW51OiByZXF1aXJlKFwiLi9tZW51XCIpLFxuXHRNYWluVmlldzogcmVxdWlyZShcIi4vTWFpblZpZXcuanNcIilcbn07IiwidmFyIFN1Yk1lbnUgPSByZXF1aXJlKFwiLi9TdWJNZW51LmpzXCIpO1xudmFyIGluaGVyaXQgPSByZXF1aXJlKFwiLi4vLi4vdXRpbFwiKS5pbmhlcml0O1xudmFyIGJpbmQgPSByZXF1aXJlKFwiLi4vLi4vdXRpbFwiKS5iaW5kO1xudmFyIGJlaGF2aW91ck1vZGVsID0gcmVxdWlyZShcIi4uLy4uL21vZGVsXCIpLmJlaGF2aW91ck1vZGVsO1xudmFyIHByb2plY3RNb2RlbCA9IHJlcXVpcmUoXCIuLi8uLi9tb2RlbFwiKS5wcm9qZWN0TW9kZWw7XG52YXIgc2VydmljZSA9IHJlcXVpcmUoXCIuLi8uLi9zZXJ2aWNlXCIpO1xuXG5mdW5jdGlvbiBBbmd1bGFyVmVsb2NpdHlNZW51KCkge1xuXHRTdWJNZW51LmNhbGwodGhpcyk7XG5cdGJpbmQodGhpcyk7XG5cblx0dGhpcy51aSA9IHtcblx0XHRyb3dzOiBbXG5cdFx0XHR0aGlzLmNoZWNrYm94KFwiRW5hYmxlZDogXCIsIHtpZDogXCJhbmd1bGFyX3ZlbG9jaXR5X2VuYWJsZVwiLCB2YWx1ZTogMH0pLFxuXHRcdFx0dGhpcy5yYW5nZWRTbGlkZXIoXCJkZWdyZWVzXCIsIFwiRGVncmVlcy9zZWM6XCIpLFxuXHRcdFx0dGhpcy5yYW5nZWRTbGlkZXIoXCJkZWdyZWVzX3ZhcmlhbmNlXCIsIFwiRGVncmVlcyB2YXJpYW5jZS9zZWM6XCIpLFxuXHRcdFx0dGhpcy5yYW5nZWRTbGlkZXIoXCJtYXhfcmFkaXVzXCIsIFwiTWF4IHJhZGl1czpcIiksXG5cdFx0XHR0aGlzLnJhbmdlZFNsaWRlcihcIm1heF9yYWRpdXNfdmFyaWFuY2VcIiwgXCJNYXggcmFkaXVzIHZhcmlhbmNlOlwiKSxcblx0XHRcdHRoaXMucmFuZ2VkU2xpZGVyKFwibWluX3JhZGl1c1wiLCBcIk1pbiByYWRpdXM6XCIpLFxuXHRcdFx0dGhpcy5yYW5nZWRTbGlkZXIoXCJtaW5fcmFkaXVzX3ZhcmlhbmNlXCIsIFwiTWluIHJhZGl1cyB2YXJpYW5jZTpcIilcblx0XHRdXG5cdH07XG59XG5cbmluaGVyaXQoQW5ndWxhclZlbG9jaXR5TWVudSwgU3ViTWVudSk7XG5cbkFuZ3VsYXJWZWxvY2l0eU1lbnUucHJvdG90eXBlLnJhbmdlZFNsaWRlciA9IGZ1bmN0aW9uKGlkLCBsYWJlbCkge1xuXHR2YXIgc2xpZGVyID0gdGhpcy5zbGlkZXIobGFiZWwsIHtcblx0XHRpZDogaWQsXG5cdFx0bGFiZWxXaWR0aDogMzAsXG5cdFx0bWluOiAtMTAwMCxcblx0XHRtYXg6IDEwMDAsXG5cdFx0c3RlcDogMC4wMSxcblx0XHR2YWx1ZTogMFxuXHR9KTtcblxuXHRyZXR1cm4gc2xpZGVyO1xufTtcblxuQW5ndWxhclZlbG9jaXR5TWVudS5wcm90b3R5cGUub25NZW51Q3JlYXRlZCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLmJpbmQoXCJkZWdyZWVzXCIsIFwiZGVncmVlc1wiKTtcblx0dGhpcy5iaW5kKFwiZGVncmVlc192YXJpYW5jZVwiLCBcImRlZ3JlZXNWYXJpYW5jZVwiKTtcblxuXHR0aGlzLmJpbmQoXCJtYXhfcmFkaXVzXCIsIFwibWF4UmFkaXVzXCIpO1xuXHR0aGlzLmJpbmQoXCJtYXhfcmFkaXVzX3ZhcmlhbmNlXCIsIFwibWF4UmFkaXVzVmFyaWFuY2VcIik7XG5cblx0dGhpcy5iaW5kKFwibWluX3JhZGl1c1wiLCBcIm1pblJhZGl1c1wiKTtcblx0dGhpcy5iaW5kKFwibWluX3JhZGl1c192YXJpYW5jZVwiLCBcIm1pblJhZGl1c1ZhcmlhbmNlXCIpO1xuXG5cdCQkKFwiYW5ndWxhcl92ZWxvY2l0eV9lbmFibGVcIikuYXR0YWNoRXZlbnQoXCJvbkNoYW5nZVwiLCB0aGlzLm9uRW5hYmxlQ2hhbmdlZCk7XG5cdHNlcnZpY2UubXNnLm9uKFwiZW1pdHRlci9jaGFuZ2VkXCIsIHRoaXMub25FbWl0dGVyQ2hhbmdlZCk7XG59O1xuXG5Bbmd1bGFyVmVsb2NpdHlNZW51LnByb3RvdHlwZS5vbkVuYWJsZUNoYW5nZWQgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRzZXJ2aWNlLm1zZy5lbWl0KFwiYmVoYXZpb3VyL3NldEVuYWJsZVwiLCB2YWx1ZSwgdGhpcy5nZXRCZWhhdmlvdXIoKSk7XG59O1xuXG5Bbmd1bGFyVmVsb2NpdHlNZW51LnByb3RvdHlwZS5vbkVtaXR0ZXJDaGFuZ2VkID0gZnVuY3Rpb24oKSB7XG5cdCQkKFwiYW5ndWxhcl92ZWxvY2l0eV9lbmFibGVcIikuc2V0VmFsdWUocHJvamVjdE1vZGVsLmhhc0FjdGl2ZUJlaGF2aW91cih0aGlzLmdldEJlaGF2aW91cigpKSk7XG59O1xuXG5Bbmd1bGFyVmVsb2NpdHlNZW51LnByb3RvdHlwZS5nZXRCZWhhdmlvdXIgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIGJlaGF2aW91ck1vZGVsLmdldEJlaGF2aW91ckJ5TmFtZShcIkFuZ3VsYXJWZWxvY2l0eUJlaGF2aW91clwiKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQW5ndWxhclZlbG9jaXR5TWVudTtcblxuXG4iLCJ2YXIgU3ViTWVudSA9IHJlcXVpcmUoXCIuL1N1Yk1lbnUuanNcIik7XG52YXIgdXRpbCA9IHJlcXVpcmUoXCIuLi8uLi91dGlsXCIpO1xudmFyIHNlcnZpY2UgPSByZXF1aXJlKFwiLi4vLi4vc2VydmljZVwiKTtcbnZhciBiYWNrZ3JvdW5kTW9kZWwgPSByZXF1aXJlKFwiLi4vLi4vbW9kZWxcIikuYmFja2dyb3VuZE1vZGVsO1xuXG5mdW5jdGlvbiBCYWNrZ3JvdW5kTWVudSgpIHtcblx0U3ViTWVudS5jYWxsKHRoaXMpO1xuXHR1dGlsLmJpbmQodGhpcyk7XG5cblx0dGhpcy51aSA9IHtcblx0XHRyb3dzOiBbXG5cdFx0XHR0aGlzLmNoZWNrYm94KFwiTG9ja2VkOiBcIiwge2lkOiBcImxvY2tfZW5hYmxlXCIsIHZhbHVlOiBiYWNrZ3JvdW5kTW9kZWwuaXNMb2NrZWR9KSxcblx0XHRcdHRoaXMuYnV0dG9uKFwiTG9hZCBpbWFnZVwiLCB7Y2xpY2s6IHRoaXMub25Mb2FkSW1hZ2V9KSxcblx0XHRcdHRoaXMuYnV0dG9uKFwiUmVtb3ZlIGJhY2tncm91bmRcIiwge2NsaWNrOiB0aGlzLm9uUmVtb3ZlQmFja2dyb3VuZH0pLFxuXHRcdFx0e3ZpZXc6IFwiY29sb3JwaWNrZXJcIiwgaWQ6IFwiYmFja2dyb3VuZF9jb2xvclwiLCBsYWJlbDogXCJDb2xvclwiLCBuYW1lOiBcImNvbG9yXCIsIHZhbHVlOiBcIiMwMDAwMFwifVxuXHRcdF1cblx0fTtcbn1cblxudXRpbC5pbmhlcml0KEJhY2tncm91bmRNZW51LCBTdWJNZW51KTtcblxuQmFja2dyb3VuZE1lbnUucHJvdG90eXBlLm9uTWVudUNyZWF0ZWQgPSBmdW5jdGlvbigpIHtcblx0JCQoXCJiYWNrZ3JvdW5kX2NvbG9yXCIpLmF0dGFjaEV2ZW50KFwib25DaGFuZ2VcIiwgdGhpcy5vbkNvbG9yQ2hhbmdlZCk7XG5cdCQkKFwibG9ja19lbmFibGVcIikuYXR0YWNoRXZlbnQoXCJvbkNoYW5nZVwiLCB0aGlzLm9uTG9ja0NoYW5nZWQpO1xuXG5cdC8vdG9kbzogcmVmYWN0b3JcblxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWQtYmFja2dyb3VuZFwiKS5vbmNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHNlcnZpY2UubXNnLmVtaXQoXCJiYWNrZ3JvdW5kL2xvYWRUZXh0dXJlXCIpO1xuXHR9O1xufTtcblxuQmFja2dyb3VuZE1lbnUucHJvdG90eXBlLm9uQ29sb3JDaGFuZ2VkID0gZnVuY3Rpb24oKSB7XG5cdHZhciB2YWx1ZSA9ICQkKFwiYmFja2dyb3VuZF9jb2xvclwiKS5nZXRWYWx1ZSgpLnJlcGxhY2UoXCIjXCIsIFwiMHhcIik7XG5cdHNlcnZpY2UubXNnLmVtaXQoXCJiYWNrZ3JvdW5kL2NoYW5nZUNvbG9yXCIsIHZhbHVlKTtcbn07XG5cbkJhY2tncm91bmRNZW51LnByb3RvdHlwZS5vbkxvYWRJbWFnZSA9IGZ1bmN0aW9uKCkge1xuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWQtYmFja2dyb3VuZFwiKS5jbGljaygpO1xufTtcblxuQmFja2dyb3VuZE1lbnUucHJvdG90eXBlLm9uUmVtb3ZlQmFja2dyb3VuZCA9IGZ1bmN0aW9uKCkge1xuXHRzZXJ2aWNlLm1zZy5lbWl0KFwiYmFja2dyb3VuZC9yZW1vdmVUZXh0dXJlXCIpO1xufTtcblxuQmFja2dyb3VuZE1lbnUucHJvdG90eXBlLm9uTG9ja0NoYW5nZWQgPSBmdW5jdGlvbigpIHtcblx0c2VydmljZS5tc2cuZW1pdChcImJhY2tncm91bmQvY2hhbmdlTG9ja2VkXCIpO1xufTtcbm1vZHVsZS5leHBvcnRzID0gQmFja2dyb3VuZE1lbnU7IiwidmFyIFN1Yk1lbnUgPSByZXF1aXJlKFwiLi9TdWJNZW51LmpzXCIpO1xudmFyIHV0aWwgPSByZXF1aXJlKFwiLi4vLi4vdXRpbFwiKTtcbnZhciBiZWhhdmlvdXJNb2RlbCA9IHJlcXVpcmUoXCIuLi8uLi9tb2RlbFwiKS5iZWhhdmlvdXJNb2RlbDtcbnZhciBwcm9qZWN0TW9kZWwgPSByZXF1aXJlKFwiLi4vLi4vbW9kZWxcIikucHJvamVjdE1vZGVsO1xudmFyIHNlcnZpY2UgPSByZXF1aXJlKFwiLi4vLi4vc2VydmljZVwiKTtcblxuZnVuY3Rpb24gQ29sb3JNZW51KCkge1xuXHRTdWJNZW51LmNhbGwodGhpcyk7XG5cdHV0aWwuYmluZCh0aGlzKTtcblxuXHR0aGlzLnVpID0ge1xuXHRcdHJvd3M6IFtcblx0XHRcdHRoaXMuY2hlY2tib3goXCJFbmFibGVkOlwiLCB7aWQ6IFwiY29sb3JfZW5hYmxlXCIsIHZhbHVlOiAwfSksXG5cdFx0XHR0aGlzLnNlY3Rpb24oXCJTdGFydDpcIiksXG5cdFx0XHR7dmlldzogXCJ0ZW1wbGF0ZVwiLCBjb250ZW50OiBcInN0YXJ0X2NvbG9yXCIsIGF1dG9oZWlnaHQ6IHRydWV9LFxuXHRcdFx0dGhpcy5zZWN0aW9uKFwiRW5kOlwiKSxcblx0XHRcdHt2aWV3OiBcInRlbXBsYXRlXCIsIGNvbnRlbnQ6IFwiZW5kX2NvbG9yXCIsIGF1dG9oZWlnaHQ6IHRydWV9LFxuXHRcdFx0dGhpcy5zZWN0aW9uKFwiU3RhcnQgdmFyaWFuY2U6XCIpLFxuXHRcdFx0dGhpcy5jb2xvclNsaWRlcihcInN0YXJ0X3ZhcmlhbmNlX3JcIiwgXCJSOlwiKSxcblx0XHRcdHRoaXMuY29sb3JTbGlkZXIoXCJzdGFydF92YXJpYW5jZV9nXCIsIFwiRzpcIiksXG5cdFx0XHR0aGlzLmNvbG9yU2xpZGVyKFwic3RhcnRfdmFyaWFuY2VfYlwiLCBcIkI6XCIpLFxuXHRcdFx0dGhpcy5zbGlkZXIoXCJcIiwge2lkOiBcInN0YXJ0X3ZhcmlhbmNlX2FscGhhXCIsIGxhYmVsOiBcIkE6XCIsIGxhYmVsV2lkdGg6IDMwLCBtaW46IDAsIG1heDogMSwgc3RlcDogMC4wMSwgdmFsdWU6IDB9KSxcblx0XHRcdHRoaXMuc2VjdGlvbihcIkVuZCB2YXJpYW5jZTpcIiksXG5cdFx0XHR0aGlzLmNvbG9yU2xpZGVyKFwiZW5kX3ZhcmlhbmNlX3JcIiwgXCJSOlwiKSxcblx0XHRcdHRoaXMuY29sb3JTbGlkZXIoXCJlbmRfdmFyaWFuY2VfZ1wiLCBcIkc6XCIpLFxuXHRcdFx0dGhpcy5jb2xvclNsaWRlcihcImVuZF92YXJpYW5jZV9iXCIsIFwiQjpcIiksXG5cdFx0XHR0aGlzLnNsaWRlcihcIlwiLCB7aWQ6IFwiZW5kX3ZhcmlhbmNlX2FscGhhXCIsIGxhYmVsOiBcIkE6XCIsIGxhYmVsV2lkdGg6IDMwLCBtaW46IDAsIG1heDogMSwgc3RlcDogMC4wMSwgdmFsdWU6IDB9KVxuXG5cdFx0XVxuXHR9O1xuXG5cdHZhciBzdGFydENvbG9yID0gJChcIiNzdGFydF9jb2xvcl9pbnB1dFwiKTtcblx0dmFyIHN0YXJ0Q29sb3JJbmZvID0gJChcIiNzdGFydF9jb2xvcl9pbmZvXCIpO1xuXHRzdGFydENvbG9yLnNwZWN0cnVtKHRoaXMuZ2V0Q29sb3JQaWNrZXJDb25maWcoKSk7XG5cblx0dGhpcy5nZXRTdGFydENvbG9yID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHN0YXJ0Q29sb3I7XG5cdH07XG5cdHRoaXMuZ2V0U3RhcnRDb2xvckluZm8gPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gc3RhcnRDb2xvckluZm87XG5cdH07XG5cblx0dmFyIGVuZENvbG9yID0gJChcIiNlbmRfY29sb3JfaW5wdXRcIik7XG5cdHZhciBlbmRDb2xvckluZm8gPSAkKFwiI2VuZF9jb2xvcl9pbmZvXCIpO1xuXHRlbmRDb2xvci5zcGVjdHJ1bSh0aGlzLmdldENvbG9yUGlja2VyQ29uZmlnKCkpO1xuXG5cdHRoaXMuZ2V0RW5kQ29sb3IgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZW5kQ29sb3I7XG5cdH07XG5cblx0dGhpcy5nZXRFbmRDb2xvckluZm8gPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZW5kQ29sb3JJbmZvO1xuXHR9O1xufVxuXG51dGlsLmluaGVyaXQoQ29sb3JNZW51LCBTdWJNZW51KTtcblxuQ29sb3JNZW51LnByb3RvdHlwZS5nZXRDb2xvclBpY2tlckNvbmZpZyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4ge1xuXHRcdGNvbG9yOiBcIiNmZmZmZmZcIixcblx0XHRzaG93SW5wdXQ6IHRydWUsXG5cdFx0c2hvd0FscGhhOiB0cnVlLFxuXHRcdHByZWZlcnJlZEZvcm1hdDogXCJoZXhcIixcblx0XHRjbGlja291dEZpcmVzQ2hhbmdlOiB0cnVlLFxuXHR9O1xufTtcblxuQ29sb3JNZW51LnByb3RvdHlwZS5jb2xvclNsaWRlciA9IGZ1bmN0aW9uKGlkLCBsYWJlbCkge1xuXHRyZXR1cm4gdGhpcy5zbGlkZXIuY2FsbCh0aGlzLCBcIlwiLCB7XG5cdFx0aWQ6IGlkLCBsYWJlbDogbGFiZWwsIGxhYmVsV2lkdGg6IDMwLCBtaW46IDAsIG1heDogMjU1LCBzdGVwOiAxLCB2YWx1ZTogMFxuXHR9KTtcbn07XG5cbkNvbG9yTWVudS5wcm90b3R5cGUub25NZW51Q3JlYXRlZCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLmJpbmQoXCJzdGFydF92YXJpYW5jZV9yXCIsIFwiclwiLCB0aGlzLmdldFN0YXJ0VmFyaWFuY2UpO1xuXHR0aGlzLmJpbmQoXCJzdGFydF92YXJpYW5jZV9nXCIsIFwiZ1wiLCB0aGlzLmdldFN0YXJ0VmFyaWFuY2UpO1xuXHR0aGlzLmJpbmQoXCJzdGFydF92YXJpYW5jZV9iXCIsIFwiYlwiLCB0aGlzLmdldFN0YXJ0VmFyaWFuY2UpO1xuXHR0aGlzLmJpbmQoXCJzdGFydF92YXJpYW5jZV9hbHBoYVwiLCBcImFscGhhXCIsIHRoaXMuZ2V0U3RhcnRWYXJpYW5jZSk7XG5cblx0dGhpcy5iaW5kKFwiZW5kX3ZhcmlhbmNlX3JcIiwgXCJyXCIsIHRoaXMuZ2V0RW5kVmFyaWFuY2UpO1xuXHR0aGlzLmJpbmQoXCJlbmRfdmFyaWFuY2VfZ1wiLCBcImdcIiwgdGhpcy5nZXRFbmRWYXJpYW5jZSk7XG5cdHRoaXMuYmluZChcImVuZF92YXJpYW5jZV9iXCIsIFwiYlwiLCB0aGlzLmdldEVuZFZhcmlhbmNlKTtcblx0dGhpcy5iaW5kKFwiZW5kX3ZhcmlhbmNlX2FscGhhXCIsIFwiYWxwaGFcIiwgdGhpcy5nZXRFbmRWYXJpYW5jZSk7XG5cblx0JCQoXCJjb2xvcl9lbmFibGVcIikuYXR0YWNoRXZlbnQoXCJvbkNoYW5nZVwiLCB0aGlzLm9uRW5hYmxlQ2hhbmdlZCk7XG5cdHNlcnZpY2UubXNnLm9uKFwiZW1pdHRlci9jaGFuZ2VkXCIsIHRoaXMub25FbWl0dGVyQ2hhbmdlZCk7XG5cblx0dGhpcy5nZXRTdGFydENvbG9yKCkub24oXCJtb3ZlLnNwZWN0cnVtXCIsIHRoaXMub25TdGFydENvbG9yQ2hhbmdlZCk7XG5cdHRoaXMuZ2V0U3RhcnRDb2xvcigpLm9uKFwiaGlkZS5zcGVjdHJ1bVwiLCB0aGlzLm9uU3RhcnRDb2xvckNoYW5nZWQpO1xuXHR0aGlzLmdldEVuZENvbG9yKCkub24oXCJtb3ZlLnNwZWN0cnVtXCIsIHRoaXMub25FbmRDb2xvckNoYW5nZWQpO1xuXHR0aGlzLmdldEVuZENvbG9yKCkub24oXCJoaWRlLnNwZWN0cnVtXCIsIHRoaXMub25FbmRDb2xvckNoYW5nZWQpO1xuXG59O1xuXG5Db2xvck1lbnUucHJvdG90eXBlLm9uU3RhcnRDb2xvckNoYW5nZWQgPSBmdW5jdGlvbigpIHtcblx0dmFyIGNvbG9yID0gdGhpcy5nZXRTdGFydENvbG9yKCkuc3BlY3RydW0oXCJnZXRcIikudG9SZ2IoKTtcblx0dGhpcy5nZXRCZWhhdmlvdXIoKS5zdGFydC5zZXQoY29sb3IuciwgY29sb3IuZywgY29sb3IuYiwgY29sb3IuYSk7XG59O1xuXG5Db2xvck1lbnUucHJvdG90eXBlLm9uRW5kQ29sb3JDaGFuZ2VkID0gZnVuY3Rpb24oKSB7XG5cdHZhciBjb2xvciA9IHRoaXMuZ2V0RW5kQ29sb3IoKS5zcGVjdHJ1bShcImdldFwiKS50b1JnYigpO1xuXHR0aGlzLmdldEJlaGF2aW91cigpLmVuZC5zZXQoY29sb3IuciwgY29sb3IuZywgY29sb3IuYiwgY29sb3IuYSk7XG59O1xuXG5Db2xvck1lbnUucHJvdG90eXBlLm9uRW5hYmxlQ2hhbmdlZCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdHNlcnZpY2UubXNnLmVtaXQoXCJiZWhhdmlvdXIvc2V0RW5hYmxlXCIsIHZhbHVlLCB0aGlzLmdldEJlaGF2aW91cigpKTtcbn07XG5cbkNvbG9yTWVudS5wcm90b3R5cGUub25FbWl0dGVyQ2hhbmdlZCA9IGZ1bmN0aW9uKCkge1xuXHQkJChcImNvbG9yX2VuYWJsZVwiKS5zZXRWYWx1ZShwcm9qZWN0TW9kZWwuaGFzQWN0aXZlQmVoYXZpb3VyKHRoaXMuZ2V0QmVoYXZpb3VyKCkpKTtcblxuXHR0aGlzLmdldFN0YXJ0Q29sb3IoKS5zcGVjdHJ1bShcInNldFwiLCBcIiNcIiArIHRoaXMuZ2V0QmVoYXZpb3VyKCkuc3RhcnQuaGV4LnRvU3RyaW5nKDE2KSk7XG5cdHRoaXMuZ2V0RW5kQ29sb3IoKS5zcGVjdHJ1bShcInNldFwiLCBcIiNcIiArIHRoaXMuZ2V0QmVoYXZpb3VyKCkuZW5kLmhleC50b1N0cmluZygxNikpO1xuXG5cdHRoaXMucmVmcmVzaENvbG9ySW5mbygpO1xufTtcblxuQ29sb3JNZW51LnByb3RvdHlwZS5yZWZyZXNoQ29sb3JJbmZvID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuZ2V0U3RhcnRDb2xvckluZm8oKS50ZXh0KHRoaXMuZ2V0U3RhcnRDb2xvcigpLnNwZWN0cnVtKFwiZ2V0XCIpLnRvUmdiU3RyaW5nKCkpO1xuXHR0aGlzLmdldEVuZENvbG9ySW5mbygpLnRleHQodGhpcy5nZXRFbmRDb2xvcigpLnNwZWN0cnVtKFwiZ2V0XCIpLnRvUmdiU3RyaW5nKCkpO1xufTtcblxuQ29sb3JNZW51LnByb3RvdHlwZS5nZXRTdGFydFZhcmlhbmNlID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmdldEJlaGF2aW91cigpLnN0YXJ0VmFyaWFuY2U7XG59O1xuXG5Db2xvck1lbnUucHJvdG90eXBlLmdldEVuZFZhcmlhbmNlID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmdldEJlaGF2aW91cigpLmVuZFZhcmlhbmNlO1xufTtcblxuQ29sb3JNZW51LnByb3RvdHlwZS5nZXRCZWhhdmlvdXIgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIGJlaGF2aW91ck1vZGVsLmdldEJlaGF2aW91ckJ5TmFtZShqdXBpdGVyLkJlaGF2aW91ck5hbWVzLkNPTE9SX0JFSEFWSU9VUik7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbG9yTWVudTtcblxuXG4iLCJ2YXIgU3ViTWVudSA9IHJlcXVpcmUoXCIuL1N1Yk1lbnUuanNcIik7XG52YXIgdXRpbCA9IHJlcXVpcmUoXCIuLi8uLi91dGlsXCIpO1xudmFyIHNlcnZpY2UgPSByZXF1aXJlKFwiLi4vLi4vc2VydmljZVwiKTtcbnZhciBlbWlzc2lvbk1vZGVsID0gcmVxdWlyZShcIi4uLy4uL21vZGVsXCIpLmVtaXNzaW9uTW9kZWw7XG5cbmZ1bmN0aW9uIERlZmF1bHRFbWlzc2lvbk1lbnUoKSB7XG5cdFN1Yk1lbnUuY2FsbCh0aGlzKTtcblx0dXRpbC5iaW5kKHRoaXMpO1xuXG5cdHRoaXMudWkgPSB7XG5cdFx0aWQ6IFwiZGVmYXVsdF9lbWl0X2NvbnRyb2xsZXJfbWVudVwiLFxuXHRcdHJvd3M6IFtcblx0XHRcdHRoaXMuY291bnRlcihcIkVtaXQvc2VjOlwiLCB7XG5cdFx0XHRcdGlkOiBcImVtaXRfcGVyX3NlY29uZFwiLFxuXHRcdFx0XHRzdGVwOiAwLjEsIHZhbHVlOiAwLCBtaW46IDAsIG1heDogMjAwLCBhbGlnbjogXCJjZW50ZXJcIiwgZm9ybWF0OiB3ZWJpeC5pMThuLm51bWJlckZvcm1hdFxuXHRcdFx0fSlcblx0XHRdXG5cdH07XG59XG5cbnV0aWwuaW5oZXJpdChEZWZhdWx0RW1pc3Npb25NZW51LCBTdWJNZW51KTtcblxuRGVmYXVsdEVtaXNzaW9uTWVudS5wcm90b3R5cGUub25BY3RpdmUgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5vbkVtaXR0ZXJDaGFuZ2VkKCk7XG5cblx0JCQoXCJlbWl0X3Blcl9zZWNvbmRcIikuYXR0YWNoRXZlbnQoXCJvbkNoYW5nZVwiLCB0aGlzLm9uRW1pdFBlclNlY29uZENoYW5nZWQpO1xufTtcblxuRGVmYXVsdEVtaXNzaW9uTWVudS5wcm90b3R5cGUub25EZXN0cm95ID0gZnVuY3Rpb24oKSB7XG5cdCQkKFwiZW1pdF9wZXJfc2Vjb25kXCIpLmRldGFjaEV2ZW50KFwib25DaGFuZ2VcIiwgdGhpcy5vbkVtaXRQZXJTZWNvbmRDaGFuZ2VkKTtcbn07XG5cbkRlZmF1bHRFbWlzc2lvbk1lbnUucHJvdG90eXBlLm9uRW1pdFBlclNlY29uZENoYW5nZWQgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHR0aGlzLmdldENvbnRyb2xsZXIoKS5lbWl0UGVyU2Vjb25kID0gdmFsdWU7XG59O1xuXG5EZWZhdWx0RW1pc3Npb25NZW51LnByb3RvdHlwZS5vbkVtaXR0ZXJDaGFuZ2VkID0gZnVuY3Rpb24oKSB7XG5cdCQkKFwiZW1pdF9wZXJfc2Vjb25kXCIpLnNldFZhbHVlKHRoaXMuZ2V0Q29udHJvbGxlcigpLmVtaXRQZXJTZWNvbmQpO1xufTtcblxuRGVmYXVsdEVtaXNzaW9uTWVudS5wcm90b3R5cGUuZ2V0Q29udHJvbGxlciA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gZW1pc3Npb25Nb2RlbC5nZXRFbWlzc2lvbkJ5TmFtZShqdXBpdGVyLkVtaXNzaW9uVHlwZXMuREVGQVVMVCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERlZmF1bHRFbWlzc2lvbk1lbnU7IiwidmFyIFN1Yk1lbnUgPSByZXF1aXJlKFwiLi9TdWJNZW51LmpzXCIpO1xudmFyIHV0aWwgPSByZXF1aXJlKFwiLi4vLi4vdXRpbFwiKTtcbnZhciBzZXJ2aWNlID0gcmVxdWlyZShcIi4uLy4uL3NlcnZpY2VcIik7XG52YXIgYmVoYXZpb3VyTW9kZWwgPSByZXF1aXJlKFwiLi4vLi4vbW9kZWxcIikuYmVoYXZpb3VyTW9kZWw7XG52YXIgcHJvamVjdE1vZGVsID0gcmVxdWlyZShcIi4uLy4uL21vZGVsXCIpLnByb2plY3RNb2RlbDtcblxuZnVuY3Rpb24gRW1pdERpcmVjdGlvbk1lbnUoKSB7XG5cdFN1Yk1lbnUuY2FsbCh0aGlzKTtcblx0dXRpbC5iaW5kKHRoaXMpO1xuXG5cdHRoaXMudWkgPSB7XG5cdFx0cm93czogW1xuXHRcdFx0dGhpcy5jaGVja2JveChcIkVuYWJsZWQ6IFwiLCB7aWQ6IFwiZW1pdF9hbmdsZV9lbmFibGVcIiwgdmFsdWU6IDB9KSxcblx0XHRcdHRoaXMuc2xpZGVyKFwiQW5nbGU6XCIsIHtcblx0XHRcdFx0aWQ6IFwiZW1pdF9hbmdsZVwiLCBtaW46IDAsIG1heDogMzYwLCBzdGVwOiAxLCB2YWx1ZTogMFxuXHRcdFx0fSksXG5cdFx0XHR0aGlzLnNsaWRlcihcIlZhcmlhbmNlOlwiLCB7XG5cdFx0XHRcdGlkOiBcImVtaXRfYW5nbGVfdmFyaWFuY2VcIiwgbWluOiAwLCBtYXg6IDM2MCwgc3RlcDogMSwgdmFsdWU6IDBcblx0XHRcdH0pXG5cdFx0XVxuXHR9O1xufVxuXG51dGlsLmluaGVyaXQoRW1pdERpcmVjdGlvbk1lbnUsIFN1Yk1lbnUpO1xuXG5FbWl0RGlyZWN0aW9uTWVudS5wcm90b3R5cGUub25NZW51Q3JlYXRlZCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLmJpbmQoXCJlbWl0X2FuZ2xlXCIsIFwiYW5nbGVJbkRlZ3JlZXNcIik7XG5cdHRoaXMuYmluZChcImVtaXRfYW5nbGVfdmFyaWFuY2VcIiwgXCJ2YXJpYW5jZUluRGVncmVlc1wiKTtcblxuXHQkJChcImVtaXRfYW5nbGVfZW5hYmxlXCIpLmF0dGFjaEV2ZW50KFwib25DaGFuZ2VcIiwgdGhpcy5vbkVuYWJsZUNoYW5nZWQpO1xuXHRzZXJ2aWNlLm1zZy5vbihcImVtaXR0ZXIvY2hhbmdlZFwiLCB0aGlzLm9uRW1pdHRlckNoYW5nZWQpO1xuXG59O1xuXG5FbWl0RGlyZWN0aW9uTWVudS5wcm90b3R5cGUub25FbmFibGVDaGFuZ2VkID0gZnVuY3Rpb24odmFsdWUpIHtcblx0c2VydmljZS5tc2cuZW1pdChcImJlaGF2aW91ci9zZXRFbmFibGVcIiwgdmFsdWUsIHRoaXMuZ2V0QmVoYXZpb3VyKCkpO1xufTtcblxuRW1pdERpcmVjdGlvbk1lbnUucHJvdG90eXBlLm9uRW1pdHRlckNoYW5nZWQgPSBmdW5jdGlvbigpIHtcblx0JCQoXCJlbWl0X2FuZ2xlX2VuYWJsZVwiKS5zZXRWYWx1ZShwcm9qZWN0TW9kZWwuaGFzQWN0aXZlQmVoYXZpb3VyKHRoaXMuZ2V0QmVoYXZpb3VyKCkpKTtcbn07XG5cbkVtaXREaXJlY3Rpb25NZW51LnByb3RvdHlwZS5nZXRCZWhhdmlvdXIgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIGJlaGF2aW91ck1vZGVsLmdldEJlaGF2aW91ckJ5TmFtZShqdXBpdGVyLkJlaGF2aW91ck5hbWVzLkVNSVRfRElSRUNUSU9OKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRW1pdERpcmVjdGlvbk1lbnU7IiwidmFyIFN1Yk1lbnUgPSByZXF1aXJlKFwiLi9TdWJNZW51LmpzXCIpO1xudmFyIExpZmVNZW51ID0gcmVxdWlyZShcIi4vTGlmZU1lbnUuanNcIik7XG52YXIgRW1pdERpcmVjdGlvbk1lbnUgPSByZXF1aXJlKFwiLi9FbWl0RGlyZWN0aW9uTWVudS5qc1wiKTtcbnZhciBEZWZhdWx0RW1pc3Npb25NZW51ID0gcmVxdWlyZShcIi4vRGVmYXVsdEVtaXNzaW9uTWVudS5qc1wiKTtcbnZhciBSYW5kb21FbWlzc2lvbk1lbnUgPSByZXF1aXJlKFwiLi9SYW5kb21FbWlzc2lvbk1lbnUuanNcIik7XG52YXIgU3RhbmRhcmRFbWlzc2lvbk1lbnUgPSByZXF1aXJlKFwiLi9TdGFuZGFyZEVtaXNzaW9uTWVudS5qc1wiKTtcbnZhciB1dGlsID0gcmVxdWlyZShcIi4uLy4uL3V0aWxcIik7XG52YXIgc2VydmljZSA9IHJlcXVpcmUoXCIuLi8uLi9zZXJ2aWNlXCIpO1xudmFyIHByb2plY3RNb2RlbCA9IHJlcXVpcmUoXCIuLi8uLi9tb2RlbFwiKS5wcm9qZWN0TW9kZWw7XG5cbmZ1bmN0aW9uIEdlbmVyYWxNZW51KCkge1xuXHRTdWJNZW51LmNhbGwodGhpcyk7XG5cdHV0aWwuYmluZCh0aGlzKTtcblxuXHR0aGlzLmxpZmVNZW51ID0gbmV3IExpZmVNZW51KCk7XG5cdHRoaXMuZW1pdERpcmVjdGlvbk1lbnUgPSBuZXcgRW1pdERpcmVjdGlvbk1lbnUoKTtcblx0dGhpcy5lbWlzc2lvbk1lbnVzID0gdGhpcy5nZXRFbWlzc2lvbk1lbnVzKCk7XG5cdHRoaXMuY3VycmVudENvbnRyb2xsZXJNZW51ID0gbnVsbDtcblxuXHR0aGlzLnVpID0ge1xuXHRcdHJvd3M6IFtcblx0XHRcdHRoaXMuc2VjdGlvbihcIkVtaXNzaW9uIHR5cGU6XCIpLFxuXHRcdFx0dGhpcy5nZXRFbWlzc2lvbk1lbnUoKSxcblx0XHRcdHRoaXMuc2VjdGlvbihcIkR1cmF0aW9uOlwiKSxcblx0XHRcdHtpZDogXCJkdXJhdGlvblwiLCB2aWV3OiBcInRleHRcIiwgdmFsdWU6IC0xLCBsYWJlbDogXCJEdXJhdGlvblwiLCBsYWJlbEFsaWduOiBcImxlZnRcIn0sXG5cdFx0XHR0aGlzLnNlY3Rpb24oXCJMaWZlOlwiKSxcblx0XHRcdHRoaXMubGlmZU1lbnUudWksXG5cdFx0XHR0aGlzLnNlY3Rpb24oXCJFbWlzc2lvbiBkaXJlY3Rpb246XCIpLFxuXHRcdFx0dGhpcy5lbWl0RGlyZWN0aW9uTWVudS51aVxuXHRcdF1cblx0fTtcbn1cblxudXRpbC5pbmhlcml0KEdlbmVyYWxNZW51LCBTdWJNZW51KTtcblxuR2VuZXJhbE1lbnUucHJvdG90eXBlLmdldEVtaXNzaW9uTWVudXMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIFtcblx0XHR7bmFtZToganVwaXRlci5FbWlzc2lvblR5cGVzLkRFRkFVTFQsIG1lbnU6IG5ldyBEZWZhdWx0RW1pc3Npb25NZW51KCl9LFxuXHRcdHtuYW1lOiBqdXBpdGVyLkVtaXNzaW9uVHlwZXMuUkFORE9NLCBtZW51OiBuZXcgUmFuZG9tRW1pc3Npb25NZW51KCl9LFxuXHRcdHtuYW1lOiBqdXBpdGVyLkVtaXNzaW9uVHlwZXMuVU5JRk9STSwgbWVudTogbmV3IFN0YW5kYXJkRW1pc3Npb25NZW51KCl9XG5cdF07XG59O1xuXG5HZW5lcmFsTWVudS5wcm90b3R5cGUuZ2V0RW1pc3Npb25OYW1lcyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5nZXRFbWlzc2lvbk1lbnVzKCkubWFwKGZ1bmN0aW9uKG1lbnUpIHtcblx0XHRyZXR1cm4gbWVudS5uYW1lO1xuXHR9KTtcbn07XG5cbkdlbmVyYWxNZW51LnByb3RvdHlwZS5nZXRFbWl0Q29udHJvbGxlck1lbnVCeU5hbWUgPSBmdW5jdGlvbihuYW1lKSB7XG5cdHZhciBpbmRleCA9IHRoaXMuZ2V0RW1pc3Npb25OYW1lcygpLmluZGV4T2YobmFtZSk7XG5cdHJldHVybiB0aGlzLmdldEVtaXNzaW9uTWVudXMoKVtpbmRleF0ubWVudTtcbn07XG5cbkdlbmVyYWxNZW51LnByb3RvdHlwZS5nZXRFbWlzc2lvbk1lbnUgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHtcblx0XHR2aWV3OiBcIm1lbnVcIixcblx0XHRpZDogXCJlbWlzc2lvbl9tZW51XCIsXG5cdFx0c3ViTWVudVBvczogXCJyaWdodFwiLFxuXHRcdGxheW91dDogXCJ5XCIsXG5cdFx0aGVpZ2h0OiAzMCxcblxuXHRcdGRhdGE6IFt7XG5cdFx0XHRpZDogXCJlbWlzc2lvbl9tZW51X2l0ZW1cIixcblx0XHRcdHZhbHVlOiBcIlNlbGVjdCBlbWl0IHNldHRpbmdzXCIsXG5cdFx0XHRzdWJtZW51OiB0aGlzLmdldEVtaXNzaW9uTmFtZXModHJ1ZSksXG5cdFx0XHRjb25maWc6IHtcblx0XHRcdFx0d2lkdGg6IDIwMCxcblx0XHRcdFx0b246IHtvbkl0ZW1DbGljazogdGhpcy5zZXRFbWlzc2lvbk1lbnV9XG5cdFx0XHR9XG5cdFx0fV0sXG5cdFx0dHlwZToge3N1YnNpZ246IHRydWUsIGhlaWdodDogNTAsfVxuXHR9O1xufTtcblxuR2VuZXJhbE1lbnUucHJvdG90eXBlLm9uQWN0aXZlID0gZnVuY3Rpb24oKSB7XG5cdFN1Yk1lbnUucHJvdG90eXBlLm9uQWN0aXZlLmNhbGwodGhpcyk7XG5cdHRoaXMubGlmZU1lbnUub25BY3RpdmUoKTtcblx0dGhpcy5lbWl0RGlyZWN0aW9uTWVudS5vbkFjdGl2ZSgpO1xufTtcblxuR2VuZXJhbE1lbnUucHJvdG90eXBlLm9uTWVudUNyZWF0ZWQgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5zZXRFbWlzc2lvbk1lbnUodGhpcy5nZXRFbWlzc2lvbk5hbWVzKClbMF0pO1xuXG5cdCQkKFwiZHVyYXRpb25cIikuYXR0YWNoRXZlbnQoXCJvbkNoYW5nZVwiLCB0aGlzLm9uRHVyYXRpb25DaGFuZ2VkKTtcblx0c2VydmljZS5tc2cub24oXCJlbWl0dGVyL2NoYW5nZWRcIiwgdGhpcy5vbkVtaXR0ZXJDaGFuZ2VkKTtcbn07XG5cbkdlbmVyYWxNZW51LnByb3RvdHlwZS5zZXRFbWlzc2lvbk1lbnUgPSBmdW5jdGlvbihuYW1lKSB7XG5cdGlmICh0aGlzLmN1cnJlbnRDb250cm9sbGVyTWVudSkge1xuXHRcdHRoaXMuY3VycmVudENvbnRyb2xsZXJNZW51Lm9uRGVzdHJveSgpO1xuXHRcdCQkKHRoaXMudWkuaWQpLnJlbW92ZVZpZXcodGhpcy5jdXJyZW50Q29udHJvbGxlck1lbnUudWkuaWQpO1xuXHR9XG5cblx0dGhpcy5jdXJyZW50Q29udHJvbGxlck1lbnUgPSB0aGlzLmdldEVtaXRDb250cm9sbGVyTWVudUJ5TmFtZShuYW1lKTtcblx0JCQodGhpcy51aS5pZCkuYWRkVmlldyh0aGlzLmN1cnJlbnRDb250cm9sbGVyTWVudS51aSwgMik7XG5cdHRoaXMuY3VycmVudENvbnRyb2xsZXJNZW51Lm9uQWN0aXZlKCk7XG5cdCQkKFwiZW1pc3Npb25fbWVudVwiKS5nZXRNZW51SXRlbShcImVtaXNzaW9uX21lbnVfaXRlbVwiKS52YWx1ZSA9IG5hbWU7XG5cdCQkKFwiZW1pc3Npb25fbWVudVwiKS5yZWZyZXNoKCk7XG5cdHRoaXMub25BY3RpdmUoKTtcblxuXHRzZXJ2aWNlLm1zZy5lbWl0KFwiZW1pc3Npb24vY2hhbmdlXCIsIG5hbWUpO1xuXG59O1xuXG5HZW5lcmFsTWVudS5wcm90b3R5cGUub25EdXJhdGlvbkNoYW5nZWQgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHR2YWx1ZSA9IHBhcnNlRmxvYXQodmFsdWUpO1xuXHRpZiAoIWlzTmFOKHZhbHVlKSkge1xuXHRcdHByb2plY3RNb2RlbC5lbWl0dGVyLmR1cmF0aW9uLm1heFRpbWUgPSB2YWx1ZTtcblx0fVxuXG5cdCQkKFwiZHVyYXRpb25cIikuc2V0VmFsdWUocHJvamVjdE1vZGVsLmVtaXR0ZXIuZHVyYXRpb24ubWF4VGltZSk7XG59O1xuXG5HZW5lcmFsTWVudS5wcm90b3R5cGUub25FbWl0dGVyQ2hhbmdlZCA9IGZ1bmN0aW9uKCkge1xuXHQkJChcImR1cmF0aW9uXCIpLnNldFZhbHVlKHByb2plY3RNb2RlbC5lbWl0dGVyLmR1cmF0aW9uLm1heFRpbWUpO1xuXHR0aGlzLnNldEVtaXNzaW9uTWVudShwcm9qZWN0TW9kZWwuZW1pdHRlci5lbWl0Q29udHJvbGxlci5nZXROYW1lKCkpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBHZW5lcmFsTWVudTsiLCJ2YXIgU3ViTWVudSA9IHJlcXVpcmUoXCIuL1N1Yk1lbnUuanNcIik7XG52YXIgdXRpbCA9IHJlcXVpcmUoXCIuLi8uLi91dGlsXCIpO1xudmFyIHNlcnZpY2UgPSByZXF1aXJlKFwiLi4vLi4vc2VydmljZVwiKTtcbnZhciBiZWhhdmlvdXJNb2RlbCA9IHJlcXVpcmUoXCIuLi8uLi9tb2RlbFwiKS5iZWhhdmlvdXJNb2RlbDtcblxuZnVuY3Rpb24gTGlmZU1lbnUoKSB7XG5cdFN1Yk1lbnUuY2FsbCh0aGlzKTtcblxuXHR0aGlzLnVpID0ge1xuXHRcdHJvd3M6IFtcblx0XHRcdHRoaXMuc2xpZGVyKFwiTGlmZSB0aW1lOlwiLCB7XG5cdFx0XHRcdGlkOiBcImxpZmVfc2xpZGVyX3RpbWVcIiwgbWluOiAwLCBtYXg6IDEwLCBzdGVwOiAwLjEsIHZhbHVlOiA1XG5cdFx0XHR9KSxcblx0XHRcdHRoaXMuc2xpZGVyKFwiTGlmZSB2YXJpYW5jZTpcIiwge1xuXHRcdFx0XHRpZDogXCJsaWZlX3NsaWRlcl92YXJpYW5jZVwiLCBtaW46IDAsIG1heDogMTAsIHN0ZXA6IDAuMSwgdmFsdWU6IDBcblx0XHRcdH0pXG5cdFx0XVxuXHR9O1xufVxuXG51dGlsLmluaGVyaXQoTGlmZU1lbnUsIFN1Yk1lbnUpO1xuXG5MaWZlTWVudS5wcm90b3R5cGUub25NZW51Q3JlYXRlZCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLmJpbmQoXCJsaWZlX3NsaWRlcl90aW1lXCIsIFwibWF4TGlmZVRpbWVcIik7XG5cdHRoaXMuYmluZChcImxpZmVfc2xpZGVyX3ZhcmlhbmNlXCIsIFwidGltZVZhcmlhbmNlXCIpO1xuXG5cdHNlcnZpY2UubXNnLmVtaXQoXCJiZWhhdmlvdXIvc2V0RW5hYmxlXCIsIHRydWUsIHRoaXMuZ2V0QmVoYXZpb3VyKCkpO1xuXG59O1xuXG5MaWZlTWVudS5wcm90b3R5cGUuZ2V0QmVoYXZpb3VyID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiBiZWhhdmlvdXJNb2RlbC5nZXRCZWhhdmlvdXJCeU5hbWUoanVwaXRlci5CZWhhdmlvdXJOYW1lcy5MSUZFX0JFSEFWSU9VUik7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExpZmVNZW51OyIsInZhciBQcm9qZWN0TWVudSA9IHJlcXVpcmUoXCIuL1Byb2plY3RNZW51LmpzXCIpO1xudmFyIFRleHR1cmVNZW51ID0gcmVxdWlyZShcIi4vVGV4dHVyZU1lbnUuanNcIik7XG52YXIgQmFja2dyb3VuZE1lbnUgPSByZXF1aXJlKFwiLi9CYWNrZ3JvdW5kTWVudS5qc1wiKTtcbnZhciBDb2xvck1lbnUgPSByZXF1aXJlKFwiLi9Db2xvck1lbnUuanNcIik7XG52YXIgQW5ndWxhclZlbG9jaXR5TWVudSA9IHJlcXVpcmUoXCIuL0FuZ3VsYXJWZWxvY2l0eU1lbnUuanNcIik7XG52YXIgUG9zaXRpb25NZW51ID0gcmVxdWlyZShcIi4vUG9zaXRpb25NZW51LmpzXCIpO1xudmFyIFNpemVNZW51ID0gcmVxdWlyZShcIi4vU2l6ZU1lbnUuanNcIik7XG52YXIgUm90YXRpb25NZW51ID0gcmVxdWlyZShcIi4vUm90YXRpb25NZW51LmpzXCIpO1xudmFyIEdlbmVyYWxNZW51ID0gcmVxdWlyZShcIi4vR2VuZXJhbE1lbnUuanNcIik7XG52YXIgc2VydmljZSA9IHJlcXVpcmUoXCIuLi8uLi9zZXJ2aWNlXCIpO1xuXG5mdW5jdGlvbiBNZW51KCkge1xuXG5cdHZhciBzdWJNZW51cyA9IFtcblx0XHR7dmFsdWU6IFwiUHJvamVjdFwiLCB2aWV3OiBuZXcgUHJvamVjdE1lbnUoKX0sXG5cdFx0e3ZhbHVlOiBcIlRleHR1cmVcIiwgdmlldzogbmV3IFRleHR1cmVNZW51KCl9LFxuXHRcdHt2YWx1ZTogXCJCYWNrZ3JvdW5kXCIsIHZpZXc6IG5ldyBCYWNrZ3JvdW5kTWVudSgpfSxcblx0XHR7JHRlbXBsYXRlOiBcIlNlcGFyYXRvclwifSxcblx0XHR7dmFsdWU6IFwiR2VuZXJhbFwiLCB2aWV3OiBuZXcgR2VuZXJhbE1lbnUoKX0sXG5cdFx0e3ZhbHVlOiBcIkNvbG9yXCIsIHZpZXc6IG5ldyBDb2xvck1lbnUoKX0sXG5cdFx0e3ZhbHVlOiBcIlBvc2l0aW9uXCIsIHZpZXc6IG5ldyBQb3NpdGlvbk1lbnUoKX0sXG5cdFx0e3ZhbHVlOiBcIkFuZ3VsYXIgVmVsb2NpdHlcIiwgdmlldzogbmV3IEFuZ3VsYXJWZWxvY2l0eU1lbnUoKX0sXG5cdFx0e3ZhbHVlOiBcIlNpemVcIiwgdmlldzogbmV3IFNpemVNZW51KCl9LFxuXHRcdHt2YWx1ZTogXCJSb3RhdGlvblwiLCB2aWV3OiBuZXcgUm90YXRpb25NZW51KCl9XG5cdF07XG5cblx0dmFyIG1lbnUgPSB7XG5cdFx0dmlldzogXCJtZW51XCIsIGlkOiBcIm0xXCIsXG5cdFx0bGF5b3V0OiBcInlcIiwgd2lkdGg6IDIwMCxcblx0XHRoZWlnaHQ6IHdpbmRvdy5pbm5lckhlaWdodCxcblx0XHRzZWxlY3Q6IHRydWUsXG5cdFx0ZGF0YTogc3ViTWVudXMsXG5cdFx0b246IHtcblx0XHRcdG9uTWVudUl0ZW1DbGljazogdGhpcy5vbk1lbnVJdGVtQ2xpY2suYmluZCh0aGlzKVxuXHRcdH1cblx0fTtcblxuXHR2YXIgdWlDb2x1bW5zID0gW21lbnVdO1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IHN1Yk1lbnVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIHN1Yk1lbnUgPSBzdWJNZW51c1tpXTtcblx0XHRpZiAoc3ViTWVudS52aWV3KSB7XG5cdFx0XHRzdWJNZW51LnZpZXcudWkuaWQgPSBcInN1Ym1lbnVcIiArIGk7XG5cdFx0XHRzdWJNZW51LnZpZXcudWkuYmF0Y2ggPSBpLnRvU3RyaW5nKCk7XG5cdFx0XHR1aUNvbHVtbnMucHVzaChzdWJNZW51LnZpZXcudWkpO1xuXHRcdH1cblx0fVxuXG5cdHVpQ29sdW1ucy5wdXNoKHtib2R5OiB7Y29udGVudDogXCJzdGFnZVwifX0pO1xuXG5cdHRoaXMudWkgPSB3ZWJpeC51aSh7XG5cdFx0dHlwZTogXCJzcGFjZVwiLFxuXHRcdHZpc2libGVCYXRjaDogXCIxXCIsXG5cdFx0Y29sczogdWlDb2x1bW5zXG5cdH0pO1xuXG5cdHdlYml4LmV2ZW50KHdpbmRvdywgXCJyZXNpemVcIiwgZnVuY3Rpb24oKSB7XG5cdFx0JCQoXCJtMVwiKS5kZWZpbmUoXCJoZWlnaHRcIiwgd2luZG93LmlubmVySGVpZ2h0KTtcblx0fS5iaW5kKHRoaXMpKTtcblxuXHRzZXJ2aWNlLm1zZy5lbWl0KFwibWVudS9jcmVhdGVkXCIpO1xufVxuXG5NZW51LnByb3RvdHlwZS5vbk1lbnVJdGVtQ2xpY2sgPSBmdW5jdGlvbihpZCkge1xuXHR2YXIgaXRlbSA9ICQkKFwibTFcIikuZ2V0TWVudUl0ZW0oaWQpO1xuXHR0aGlzLnVpLnNob3dCYXRjaChpdGVtLnZpZXcudWkuYmF0Y2gpO1xuXHRpdGVtLnZpZXcub25BY3RpdmUoKTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IE1lbnU7IiwidmFyIFN1Yk1lbnUgPSByZXF1aXJlKFwiLi9TdWJNZW51LmpzXCIpO1xudmFyIGluaGVyaXQgPSByZXF1aXJlKFwiLi4vLi4vdXRpbFwiKS5pbmhlcml0O1xudmFyIGJpbmQgPSByZXF1aXJlKFwiLi4vLi4vdXRpbFwiKS5iaW5kO1xudmFyIGJlaGF2aW91ck1vZGVsID0gcmVxdWlyZShcIi4uLy4uL21vZGVsXCIpLmJlaGF2aW91ck1vZGVsO1xudmFyIHByb2plY3RNb2RlbCA9IHJlcXVpcmUoXCIuLi8uLi9tb2RlbFwiKS5wcm9qZWN0TW9kZWw7XG52YXIgc2VydmljZSA9IHJlcXVpcmUoXCIuLi8uLi9zZXJ2aWNlXCIpO1xuXG5mdW5jdGlvbiBQb3NpdGlvbk1lbnUoKSB7XG5cdFN1Yk1lbnUuY2FsbCh0aGlzKTtcblx0YmluZCh0aGlzKTtcblxuXHR0aGlzLnVpID0ge1xuXHRcdHJvd3M6IFtcblx0XHRcdHRoaXMuY2hlY2tib3goXCJFbmFibGVkOiBcIiwge2lkOiBcInBvc2l0aW9uX2VuYWJsZVwiLCB2YWx1ZTogMH0pLFxuXHRcdFx0dGhpcy5zZWN0aW9uKFwiUG9zaXRpb246IFwiKSxcblx0XHRcdHRoaXMucG9zaXRpb25TbGlkZXIoXCJwb3NpdGlvbl94XCIsIFwiWDogXCIpLFxuXHRcdFx0dGhpcy5wb3NpdGlvblNsaWRlcihcInBvc2l0aW9uX3lcIiwgXCJZOiBcIiksXG5cdFx0XHR0aGlzLnZhcmlhbmNlU2xpZGVyKFwicG9zaXRpb25fdmFyaWFuY2VfeFwiLCBcIlZhcmlhbmNlIFg6IFwiKSxcblx0XHRcdHRoaXMudmFyaWFuY2VTbGlkZXIoXCJwb3NpdGlvbl92YXJpYW5jZV95XCIsIFwiVmFyaWFuY2UgWTogXCIpLFxuXHRcdFx0dGhpcy5zZWN0aW9uKFwiVmVsb2NpdHk6IFwiKSxcblx0XHRcdHRoaXMucG9zaXRpb25TbGlkZXIoXCJ2ZWxvY2l0eV94XCIsIFwiWDogXCIpLFxuXHRcdFx0dGhpcy5wb3NpdGlvblNsaWRlcihcInZlbG9jaXR5X3lcIiwgXCJZOiBcIiksXG5cdFx0XHR0aGlzLnZhcmlhbmNlU2xpZGVyKFwidmVsb2NpdHlfdmFyaWFuY2VfeFwiLCBcIlZhcmlhbmNlIFg6IFwiKSxcblx0XHRcdHRoaXMudmFyaWFuY2VTbGlkZXIoXCJ2ZWxvY2l0eV92YXJpYW5jZV95XCIsIFwiVmFyaWFuY2UgWTogXCIpLFxuXHRcdFx0dGhpcy5zZWN0aW9uKFwiQWNjZWxlcmF0aW9uL0dyYXZpdHk6XCIpLFxuXHRcdFx0dGhpcy5wb3NpdGlvblNsaWRlcihcImFjY2VsZXJhdGlvbl94XCIsIFwiWDogXCIpLFxuXHRcdFx0dGhpcy5wb3NpdGlvblNsaWRlcihcImFjY2VsZXJhdGlvbl95XCIsIFwiWTogXCIpLFxuXHRcdFx0dGhpcy52YXJpYW5jZVNsaWRlcihcImFjY2VsZXJhdGlvbl92YXJpYW5jZV94XCIsIFwiVmFyaWFuY2UgWDogXCIpLFxuXHRcdFx0dGhpcy52YXJpYW5jZVNsaWRlcihcImFjY2VsZXJhdGlvbl92YXJpYW5jZV95XCIsIFwiVmFyaWFuY2UgWTogXCIpXG5cblx0XHRdXG5cdH07XG59XG5cbmluaGVyaXQoUG9zaXRpb25NZW51LCBTdWJNZW51KTtcblxuUG9zaXRpb25NZW51LnByb3RvdHlwZS5wb3NpdGlvblNsaWRlciA9IGZ1bmN0aW9uKGlkLCBsYWJlbCkge1xuXHR2YXIgc2xpZGVyID0gdGhpcy5zbGlkZXIobGFiZWwsIHtcblx0XHRpZDogaWQsXG5cdFx0bGFiZWxXaWR0aDogMzAsXG5cdFx0bWluOiAtNTAwLFxuXHRcdG1heDogNTAwLFxuXHRcdHN0ZXA6IDEsXG5cdFx0dmFsdWU6IDBcblx0fSk7XG5cblx0cmV0dXJuIHNsaWRlcjtcbn07XG5cblBvc2l0aW9uTWVudS5wcm90b3R5cGUudmFyaWFuY2VTbGlkZXIgPSBmdW5jdGlvbihpZCwgbGFiZWwpIHtcblx0dmFyIHNsaWRlciA9IHRoaXMuc2xpZGVyKGxhYmVsLCB7XG5cdFx0aWQ6IGlkLFxuXHRcdGxhYmVsV2lkdGg6IDMwLFxuXHRcdG1pbjogMCxcblx0XHRtYXg6IDUwMCxcblx0XHRzdGVwOiAxLFxuXHRcdHZhbHVlOiAwXG5cdH0pO1xuXG5cdHJldHVybiBzbGlkZXI7XG59O1xuXG5Qb3NpdGlvbk1lbnUucHJvdG90eXBlLm9uTWVudUNyZWF0ZWQgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5iaW5kKFwicG9zaXRpb25feFwiLCBcInhcIiwgdGhpcy5nZXRQb3NpdGlvbik7XG5cdHRoaXMuYmluZChcInBvc2l0aW9uX3lcIiwgXCJ5XCIsIHRoaXMuZ2V0UG9zaXRpb24pO1xuXHR0aGlzLmJpbmQoXCJwb3NpdGlvbl92YXJpYW5jZV94XCIsIFwieFwiLCB0aGlzLmdldFBvc2l0aW9uVmFyaWFuY2UpO1xuXHR0aGlzLmJpbmQoXCJwb3NpdGlvbl92YXJpYW5jZV95XCIsIFwieVwiLCB0aGlzLmdldFBvc2l0aW9uVmFyaWFuY2UpO1xuXG5cdHRoaXMuYmluZChcInZlbG9jaXR5X3hcIiwgXCJ4XCIsIHRoaXMuZ2V0VmVsb2NpdHkpO1xuXHR0aGlzLmJpbmQoXCJ2ZWxvY2l0eV95XCIsIFwieVwiLCB0aGlzLmdldFZlbG9jaXR5KTtcblx0dGhpcy5iaW5kKFwidmVsb2NpdHlfdmFyaWFuY2VfeFwiLCBcInhcIiwgdGhpcy5nZXRWZWxvY2l0eVZhcmlhbmNlKTtcblx0dGhpcy5iaW5kKFwidmVsb2NpdHlfdmFyaWFuY2VfeVwiLCBcInlcIiwgdGhpcy5nZXRWZWxvY2l0eVZhcmlhbmNlKTtcblxuXHR0aGlzLmJpbmQoXCJhY2NlbGVyYXRpb25feFwiLCBcInhcIiwgdGhpcy5nZXRBY2NlbGVyYXRpb24pO1xuXHR0aGlzLmJpbmQoXCJhY2NlbGVyYXRpb25feVwiLCBcInlcIiwgdGhpcy5nZXRBY2NlbGVyYXRpb24pO1xuXHR0aGlzLmJpbmQoXCJhY2NlbGVyYXRpb25fdmFyaWFuY2VfeFwiLCBcInhcIiwgdGhpcy5nZXRBY2NlbGVyYXRpb25WYXJpYW5jZSk7XG5cdHRoaXMuYmluZChcImFjY2VsZXJhdGlvbl92YXJpYW5jZV95XCIsIFwieVwiLCB0aGlzLmdldEFjY2VsZXJhdGlvblZhcmlhbmNlKTtcblxuXHQkJChcInBvc2l0aW9uX2VuYWJsZVwiKS5hdHRhY2hFdmVudChcIm9uQ2hhbmdlXCIsIHRoaXMub25FbmFibGVDaGFuZ2VkKTtcblx0c2VydmljZS5tc2cub24oXCJlbWl0dGVyL2NoYW5nZWRcIiwgdGhpcy5vbkVtaXR0ZXJDaGFuZ2VkKTtcbn07XG5cblBvc2l0aW9uTWVudS5wcm90b3R5cGUub25FbmFibGVDaGFuZ2VkID0gZnVuY3Rpb24odmFsdWUpIHtcblx0c2VydmljZS5tc2cuZW1pdChcImJlaGF2aW91ci9zZXRFbmFibGVcIiwgdmFsdWUsIHRoaXMuZ2V0QmVoYXZpb3VyKCkpO1xufTtcblxuUG9zaXRpb25NZW51LnByb3RvdHlwZS5vbkVtaXR0ZXJDaGFuZ2VkID0gZnVuY3Rpb24oKSB7XG5cdCQkKFwicG9zaXRpb25fZW5hYmxlXCIpLnNldFZhbHVlKHByb2plY3RNb2RlbC5oYXNBY3RpdmVCZWhhdmlvdXIodGhpcy5nZXRCZWhhdmlvdXIoKSkpO1xufTtcblxuUG9zaXRpb25NZW51LnByb3RvdHlwZS5nZXRQb3NpdGlvbiA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5nZXRCZWhhdmlvdXIoKS5wb3NpdGlvbjtcbn07XG5cblBvc2l0aW9uTWVudS5wcm90b3R5cGUuZ2V0UG9zaXRpb25WYXJpYW5jZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5nZXRCZWhhdmlvdXIoKS5wb3NpdGlvblZhcmlhbmNlO1xufTtcblxuUG9zaXRpb25NZW51LnByb3RvdHlwZS5nZXRWZWxvY2l0eSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5nZXRCZWhhdmlvdXIoKS52ZWxvY2l0eTtcbn07XG5cblBvc2l0aW9uTWVudS5wcm90b3R5cGUuZ2V0VmVsb2NpdHlWYXJpYW5jZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5nZXRCZWhhdmlvdXIoKS52ZWxvY2l0eVZhcmlhbmNlO1xufTtcblxuUG9zaXRpb25NZW51LnByb3RvdHlwZS5nZXRBY2NlbGVyYXRpb24gPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuZ2V0QmVoYXZpb3VyKCkuYWNjZWxlcmF0aW9uO1xufTtcblxuUG9zaXRpb25NZW51LnByb3RvdHlwZS5nZXRBY2NlbGVyYXRpb25WYXJpYW5jZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5nZXRCZWhhdmlvdXIoKS5hY2NlbGVyYXRpb25WYXJpYW5jZTtcbn07XG5cblBvc2l0aW9uTWVudS5wcm90b3R5cGUuZ2V0QmVoYXZpb3VyID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiBiZWhhdmlvdXJNb2RlbC5nZXRCZWhhdmlvdXJCeU5hbWUoanVwaXRlci5CZWhhdmlvdXJOYW1lcy5QT1NJVElPTl9CRUhBVklPVVIpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQb3NpdGlvbk1lbnU7XG5cblxuIiwidmFyIGNvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi4vLi4vY29udHJvbGxlclwiKS5wcm9qZWN0TWVudUNvbnRyb2xsZXI7XG52YXIgdXRpbCA9IHJlcXVpcmUoXCIuLi8uLi91dGlsXCIpO1xudmFyIHNlcnZpY2UgPSByZXF1aXJlKFwiLi4vLi4vc2VydmljZVwiKTtcbnZhciBwcmVkZWZpbmVkTW9kZWwgPSByZXF1aXJlKFwiLi4vLi4vbW9kZWxcIikucHJlZGVmaW5lZE1vZGVsO1xuXG5mdW5jdGlvbiBQcm9qZWN0TWVudSgpIHtcblx0dXRpbC5iaW5kKHRoaXMpO1xuXG5cdHRoaXMudWkgPSB7XG5cdFx0cm93czogW1xuXHRcdFx0e3ZpZXc6IFwiYnV0dG9uXCIsIHZhbHVlOiBcIlNhdmUgUHJvamVjdFwiLCB3aWR0aDogMjAwLCBjbGljazogdGhpcy5vblNhdmVQcm9qZWN0fSxcblx0XHRcdHt2aWV3OiBcImJ1dHRvblwiLCB2YWx1ZTogXCJMb2FkIFByb2plY3RcIiwgd2lkdGg6IDIwMCwgY2xpY2s6IHRoaXMub25Mb2FkUHJvamVjdH0sXG5cdFx0XHR7dmlldzogXCJidXR0b25cIiwgdmFsdWU6IFwiRXhwb3J0IGNvbmZpZ1wiLCB3aWR0aDogMjAwLCBjbGljazogdGhpcy5vbkV4cG9ydENvbmZpZ30sXG5cdFx0XHR7dmlldzogXCJidXR0b25cIiwgdmFsdWU6IFwiTG9hZCBjb25maWdcIiwgd2lkdGg6IDIwMCwgY2xpY2s6IHRoaXMub25Mb2FkQ29uZmlnfSxcblx0XHRcdHt2aWV3OiBcImJ1dHRvblwiLCB2YWx1ZTogXCJMb2FkIHByZWRlZmluZWRcIiwgd2lkdGg6IDIwMCwgY2xpY2s6IHRoaXMub25Mb2FkUHJlZGVmaW5lZH0sXG5cdFx0XHR7dmlldzogXCJidXR0b25cIiwgdmFsdWU6IFwiUmVzZXRcIiwgd2lkdGg6IDIwMH1cblx0XHRdXG5cdH07XG5cblx0Ly90b2RvOiByZWZhY3RvclxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWQtY29uZmlnXCIpLm9uY2hhbmdlID0gZnVuY3Rpb24oKSB7XG5cdFx0c2VydmljZS5tc2cuZW1pdChcInByb2plY3QvbG9hZENvbmZpZ1wiKTtcblx0fTtcblxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWQtcHJvamVjdFwiKS5vbmNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHNlcnZpY2UubXNnLmVtaXQoXCJwcm9qZWN0L2xvYWRcIik7XG5cdH07XG59XG5cblByb2plY3RNZW51LnByb3RvdHlwZS5vbkxvYWRDb25maWcgPSBmdW5jdGlvbigpIHtcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLWNvbmZpZ1wiKS5jbGljaygpO1xufTtcblxuUHJvamVjdE1lbnUucHJvdG90eXBlLm9uTG9hZFByb2plY3QgPSBmdW5jdGlvbigpIHtcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkLXByb2plY3RcIikuY2xpY2soKTtcbn07XG5cblByb2plY3RNZW51LnByb3RvdHlwZS5vblNhdmVQcm9qZWN0ID0gZnVuY3Rpb24oKSB7XG5cdHNlcnZpY2UubXNnLmVtaXQoXCJwcm9qZWN0L3NhdmVcIik7XG59O1xuXG5Qcm9qZWN0TWVudS5wcm90b3R5cGUub25FeHBvcnRDb25maWcgPSBmdW5jdGlvbigpIHtcblx0c2VydmljZS5tc2cuZW1pdChcInByb2plY3QvZXhwb3J0Q29uZmlnXCIpO1xufTtcblxuUHJvamVjdE1lbnUucHJvdG90eXBlLm9uTG9hZFByZWRlZmluZWQgPSBmdW5jdGlvbigpIHtcblx0dmFyIGRhdGEgPSBwcmVkZWZpbmVkTW9kZWwuZ2V0TmFtZXMoKS5tYXAoZnVuY3Rpb24obmFtZSkge1xuXHRcdHJldHVybiB7dmlldzogXCJ0ZXh0XCIsIHZhbHVlOiBuYW1lfTtcblx0fSk7XG5cblx0d2ViaXgudWkoe1xuXHRcdHZpZXc6IFwid2luZG93XCIsXG5cdFx0bW9kYWw6IHRydWUsXG5cdFx0aGVhZDoge3ZpZXc6IFwiYnV0dG9uXCIsIGxhYmVsOiBcImNsb3NlXCIsIGFsaWduOiBcInJpZ2h0XCIsIGNsaWNrOiAoXCIkJCgnY2hvb3NlX3ByZWRlZmluZWRfd2luZG93JykuY2xvc2UoKTtcIil9LFxuXHRcdHBvc2l0aW9uOiBcImNlbnRlclwiLFxuXHRcdGlkOiBcImNob29zZV9wcmVkZWZpbmVkX3dpbmRvd1wiLFxuXHRcdGJvZHk6IHtcblx0XHRcdHZpZXc6IFwibWVudVwiLFxuXHRcdFx0aWQ6IFwiY2hvb3NlX3ByZWRlZmluZWRfbWVudVwiLFxuXHRcdFx0c2VsZWN0OiB0cnVlLFxuXHRcdFx0ZGF0YTogZGF0YSxcblx0XHRcdGxheW91dDogXCJ5XCIsXG5cdFx0XHRzY3JvbGw6IFwieVwiLFxuXHRcdFx0aGVpZ2h0OiAzMDAsXG5cdFx0XHRvbjoge1xuXHRcdFx0XHRvbk1lbnVJdGVtQ2xpY2s6IHRoaXMub25QcmVkZWZpbmVkQ2xpY2tcblx0XHRcdH1cblx0XHR9XG5cdH0pLnNob3coKTtcbn07XG5cblByb2plY3RNZW51LnByb3RvdHlwZS5vblByZWRlZmluZWRDbGljayA9IGZ1bmN0aW9uKGlkKSB7XG5cdHNlcnZpY2UubXNnLmVtaXQoXCJwcm9qZWN0L2xvYWRQcmVkZWZpbmVkXCIsICQkKFwiY2hvb3NlX3ByZWRlZmluZWRfbWVudVwiKS5nZXRNZW51SXRlbShpZCkudmFsdWUpO1xuXHQkJChcImNob29zZV9wcmVkZWZpbmVkX3dpbmRvd1wiKS5oaWRlKCk7XG5cdCQkKFwiY2hvb3NlX3ByZWRlZmluZWRfd2luZG93XCIpLmNsb3NlKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb2plY3RNZW51OyIsInZhciBTdWJNZW51ID0gcmVxdWlyZShcIi4vU3ViTWVudS5qc1wiKTtcbnZhciB1dGlsID0gcmVxdWlyZShcIi4uLy4uL3V0aWxcIik7XG52YXIgc2VydmljZSA9IHJlcXVpcmUoXCIuLi8uLi9zZXJ2aWNlXCIpO1xudmFyIHByb2plY3RNb2RlbCA9IHJlcXVpcmUoXCIuLi8uLi9tb2RlbFwiKS5wcm9qZWN0TW9kZWw7XG52YXIgZW1pc3Npb25Nb2RlbCA9IHJlcXVpcmUoXCIuLi8uLi9tb2RlbFwiKS5lbWlzc2lvbk1vZGVsO1xuXG5mdW5jdGlvbiBSYW5kb21FbWlzc2lvbk1lbnUoKSB7XG5cdFN1Yk1lbnUuY2FsbCh0aGlzKTtcblx0dXRpbC5iaW5kKHRoaXMpO1xuXG5cdHRoaXMudWkgPSB7XG5cdFx0aWQ6IFwicmFuZG9tX2VtaXRfY29udHJvbGxlcl9tZW51XCIsXG5cdFx0cm93czogW1xuXHRcdFx0dGhpcy5jb3VudGVyKFwiRW1pc3Npb24gcmF0ZTpcIiwge1xuXHRcdFx0XHRpZDogXCJlbWlzc2lvbl9yYXRlXCIsXG5cdFx0XHRcdHN0ZXA6IDEsIHZhbHVlOiAwLCBtaW46IDAsIG1heDogMjAwMCwgYWxpZ246IFwiY2VudGVyXCIsIGZvcm1hdDogd2ViaXguaTE4bi5udW1iZXJGb3JtYXRcblx0XHRcdH0pLFxuXHRcdFx0dGhpcy5jb3VudGVyKFwiTWF4IHBhcnRpY2xlczpcIiwge1xuXHRcdFx0XHRpZDogXCJlbWlzc2lvbl9tYXhfcGFydGljbGVzXCIsXG5cdFx0XHRcdHN0ZXA6IDEsIHZhbHVlOiAwLCBtaW46IDAsIG1heDogMjAwMCwgYWxpZ246IFwiY2VudGVyXCIsIGZvcm1hdDogd2ViaXguaTE4bi5udW1iZXJGb3JtYXRcblx0XHRcdH0pXG5cdFx0XVxuXHR9O1xufVxuXG51dGlsLmluaGVyaXQoUmFuZG9tRW1pc3Npb25NZW51LCBTdWJNZW51KTtcblxuUmFuZG9tRW1pc3Npb25NZW51LnByb3RvdHlwZS5vbkFjdGl2ZSA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLm9uRW1pdHRlckNoYW5nZWQoKTtcblxuXHQkJChcImVtaXNzaW9uX3JhdGVcIikuYXR0YWNoRXZlbnQoXCJvbkNoYW5nZVwiLCB0aGlzLm9uRW1pc3Npb25SYXRlQ2hhbmdlZCk7XG5cdCQkKFwiZW1pc3Npb25fbWF4X3BhcnRpY2xlc1wiKS5hdHRhY2hFdmVudChcIm9uQ2hhbmdlXCIsIHRoaXMub25NYXhQYXJ0aWNsZXNDaGFuZ2VkKTtcblxufTtcblxuUmFuZG9tRW1pc3Npb25NZW51LnByb3RvdHlwZS5vbkRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcblx0JCQoXCJlbWlzc2lvbl9yYXRlXCIpLmRldGFjaEV2ZW50KFwib25DaGFuZ2VcIiwgdGhpcy5vbkVtaXNzaW9uUmF0ZUNoYW5nZWQpO1xuXHQkJChcImVtaXNzaW9uX21heF9wYXJ0aWNsZXNcIikuZGV0YWNoRXZlbnQoXCJvbkNoYW5nZVwiLCB0aGlzLm9uTWF4UGFydGljbGVzQ2hhbmdlZCk7XG5cdHNlcnZpY2UubXNnLm9mZihcImVtaXR0ZXIvY2hhbmdlZFwiLCB0aGlzLm9uRW1pdHRlckNoYW5nZWQpO1xufTtcblxuUmFuZG9tRW1pc3Npb25NZW51LnByb3RvdHlwZS5vbkVtaXNzaW9uUmF0ZUNoYW5nZWQgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHR0aGlzLmdldENvbnRyb2xsZXIoKS5lbWlzc2lvblJhdGUgPSB2YWx1ZTtcbn07XG5cblJhbmRvbUVtaXNzaW9uTWVudS5wcm90b3R5cGUub25NYXhQYXJ0aWNsZXNDaGFuZ2VkID0gZnVuY3Rpb24odmFsdWUpIHtcblx0dGhpcy5nZXRDb250cm9sbGVyKCkubWF4UGFydGljbGVzID0gdmFsdWU7XG59O1xuXG5SYW5kb21FbWlzc2lvbk1lbnUucHJvdG90eXBlLm9uRW1pdHRlckNoYW5nZWQgPSBmdW5jdGlvbigpIHtcblx0JCQoXCJlbWlzc2lvbl9yYXRlXCIpLnNldFZhbHVlKHRoaXMuZ2V0Q29udHJvbGxlcigpLmVtaXNzaW9uUmF0ZSk7XG5cdCQkKFwiZW1pc3Npb25fbWF4X3BhcnRpY2xlc1wiKS5zZXRWYWx1ZSh0aGlzLmdldENvbnRyb2xsZXIoKS5tYXhQYXJ0aWNsZXMpO1xufTtcblxuUmFuZG9tRW1pc3Npb25NZW51LnByb3RvdHlwZS5nZXRDb250cm9sbGVyID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiBlbWlzc2lvbk1vZGVsLmdldEVtaXNzaW9uQnlOYW1lKGp1cGl0ZXIuRW1pc3Npb25UeXBlcy5SQU5ET00pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSYW5kb21FbWlzc2lvbk1lbnU7IiwidmFyIFN1Yk1lbnUgPSByZXF1aXJlKFwiLi9TdWJNZW51LmpzXCIpO1xudmFyIHV0aWwgPSByZXF1aXJlKFwiLi4vLi4vdXRpbFwiKTtcbnZhciBiZWhhdmlvdXJNb2RlbCA9IHJlcXVpcmUoXCIuLi8uLi9tb2RlbFwiKS5iZWhhdmlvdXJNb2RlbDtcbnZhciBwcm9qZWN0TW9kZWwgPSByZXF1aXJlKFwiLi4vLi4vbW9kZWxcIikucHJvamVjdE1vZGVsO1xudmFyIHNlcnZpY2UgPSByZXF1aXJlKFwiLi4vLi4vc2VydmljZVwiKTtcblxuZnVuY3Rpb24gUm90YXRpb25NZW51KCkge1xuXHRTdWJNZW51LmNhbGwodGhpcyk7XG5cdHV0aWwuYmluZCh0aGlzKTtcblxuXHR0aGlzLnVpID0ge1xuXHRcdHJvd3M6IFtcblx0XHRcdHRoaXMuY2hlY2tib3goXCJFbmFibGVkOiBcIiwge2lkOiBcInJvdGF0aW9uX2VuYWJsZVwiLCB2YWx1ZTogMH0pLFxuXHRcdFx0dGhpcy5yYW5nZWRTbGlkZXIoXCJyb3RhdGlvblwiLCBcIlJvdGF0aW9uL3NlYzogXCIpLFxuXHRcdFx0dGhpcy5yYW5nZWRTbGlkZXIoXCJ2YXJpYW5jZVwiLCBcIlZhcmlhbmNlOiBcIilcblx0XHRdXG5cdH07XG59XG5cbnV0aWwuaW5oZXJpdChSb3RhdGlvbk1lbnUsIFN1Yk1lbnUpO1xuXG5Sb3RhdGlvbk1lbnUucHJvdG90eXBlLnJhbmdlZFNsaWRlciA9IGZ1bmN0aW9uKGlkLCBsYWJlbCkge1xuXHR2YXIgc2xpZGVyID0gdGhpcy5zbGlkZXIobGFiZWwsIHtcblx0XHRpZDogaWQsXG5cdFx0bGFiZWxXaWR0aDogMzAsXG5cdFx0bWluOiAtMzYwLFxuXHRcdG1heDogMzYwLFxuXHRcdHN0ZXA6IDAuMDEsXG5cdFx0dmFsdWU6IDBcblx0fSk7XG5cblx0cmV0dXJuIHNsaWRlcjtcbn07XG5cblJvdGF0aW9uTWVudS5wcm90b3R5cGUub25NZW51Q3JlYXRlZCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLmJpbmQoXCJyb3RhdGlvblwiLCBcInJvdGF0aW9uSW5EZWdyZWVzXCIsIHRoaXMuZ2V0QmVoYXZpb3VyKTtcblx0dGhpcy5iaW5kKFwidmFyaWFuY2VcIiwgXCJ2YXJpYW5jZUluRGVncmVlc1wiLCB0aGlzLmdldEJlaGF2aW91cik7XG5cblx0JCQoXCJyb3RhdGlvbl9lbmFibGVcIikuYXR0YWNoRXZlbnQoXCJvbkNoYW5nZVwiLCB0aGlzLm9uRW5hYmxlQ2hhbmdlZCk7XG5cdHNlcnZpY2UubXNnLm9uKFwiZW1pdHRlci9jaGFuZ2VkXCIsIHRoaXMub25FbWl0dGVyQ2hhbmdlZCk7XG59O1xuXG5Sb3RhdGlvbk1lbnUucHJvdG90eXBlLm9uRW5hYmxlQ2hhbmdlZCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdHNlcnZpY2UubXNnLmVtaXQoXCJiZWhhdmlvdXIvc2V0RW5hYmxlXCIsIHZhbHVlLCB0aGlzLmdldEJlaGF2aW91cigpKTtcbn07XG5cblJvdGF0aW9uTWVudS5wcm90b3R5cGUub25FbWl0dGVyQ2hhbmdlZCA9IGZ1bmN0aW9uKCkge1xuXHQkJChcInJvdGF0aW9uX2VuYWJsZVwiKS5zZXRWYWx1ZShwcm9qZWN0TW9kZWwuaGFzQWN0aXZlQmVoYXZpb3VyKHRoaXMuZ2V0QmVoYXZpb3VyKCkpKTtcbn07XG5cblJvdGF0aW9uTWVudS5wcm90b3R5cGUuZ2V0QmVoYXZpb3VyID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiBiZWhhdmlvdXJNb2RlbC5nZXRCZWhhdmlvdXJCeU5hbWUoanVwaXRlci5CZWhhdmlvdXJOYW1lcy5ST1RBVElPTl9CRUhBVklPVVIpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSb3RhdGlvbk1lbnU7XG5cblxuIiwidmFyIFN1Yk1lbnUgPSByZXF1aXJlKFwiLi9TdWJNZW51LmpzXCIpO1xudmFyIHV0aWwgPSByZXF1aXJlKFwiLi4vLi4vdXRpbFwiKTtcbnZhciBiZWhhdmlvdXJNb2RlbCA9IHJlcXVpcmUoXCIuLi8uLi9tb2RlbFwiKS5iZWhhdmlvdXJNb2RlbDtcbnZhciBwcm9qZWN0TW9kZWwgPSByZXF1aXJlKFwiLi4vLi4vbW9kZWxcIikucHJvamVjdE1vZGVsO1xudmFyIHNlcnZpY2UgPSByZXF1aXJlKFwiLi4vLi4vc2VydmljZVwiKTtcblxuZnVuY3Rpb24gU2l6ZU1lbnUoKSB7XG5cdFN1Yk1lbnUuY2FsbCh0aGlzKTtcblx0dXRpbC5iaW5kKHRoaXMpO1xuXG5cdHRoaXMudWkgPSB7XG5cdFx0cm93czogW1xuXHRcdFx0dGhpcy5jaGVja2JveChcIkVuYWJsZWQ6IFwiLCB7aWQ6IFwic2l6ZV9lbmFibGVcIiwgdmFsdWU6IDB9KSxcblx0XHRcdHRoaXMuc2VjdGlvbihcIlN0YXJ0IHNpemU6IFwiKSxcblx0XHRcdHRoaXMucG9zaXRpb25TbGlkZXIoXCJzdGFydF9zaXplX3hcIiwgXCJYOiBcIiksXG5cdFx0XHR0aGlzLnBvc2l0aW9uU2xpZGVyKFwic3RhcnRfc2l6ZV95XCIsIFwiWTogXCIpLFxuXHRcdFx0dGhpcy52YXJpYW5jZVNsaWRlcihcInN0YXJ0X3NpemVfdmFyaWFuY2VcIiwgXCJWYXJpYW5jZTogXCIpLFxuXG5cdFx0XHR0aGlzLnNlY3Rpb24oXCJFbmQgc2l6ZTogXCIpLFxuXHRcdFx0dGhpcy5wb3NpdGlvblNsaWRlcihcImVuZF9zaXplX3hcIiwgXCJYOiBcIiksXG5cdFx0XHR0aGlzLnBvc2l0aW9uU2xpZGVyKFwiZW5kX3NpemVfeVwiLCBcIlk6IFwiKSxcblx0XHRcdHRoaXMudmFyaWFuY2VTbGlkZXIoXCJlbmRfc2l6ZV92YXJpYW5jZVwiLCBcIlZhcmlhbmNlOiBcIilcblx0XHRdXG5cdH07XG59XG5cbnV0aWwuaW5oZXJpdChTaXplTWVudSwgU3ViTWVudSk7XG5cblNpemVNZW51LnByb3RvdHlwZS5wb3NpdGlvblNsaWRlciA9IGZ1bmN0aW9uKGlkLCBsYWJlbCkge1xuXHR2YXIgc2xpZGVyID0gdGhpcy5zbGlkZXIobGFiZWwsIHtcblx0XHRpZDogaWQsXG5cdFx0bGFiZWxXaWR0aDogMzAsXG5cdFx0bWluOiAwLFxuXHRcdG1heDogMTAsXG5cdFx0dmFsdWU6IDEsXG5cdFx0c3RlcDogMC4xXG5cdH0pO1xuXG5cdHJldHVybiBzbGlkZXI7XG59O1xuXG5TaXplTWVudS5wcm90b3R5cGUudmFyaWFuY2VTbGlkZXIgPSBmdW5jdGlvbihpZCwgbGFiZWwpIHtcblx0dmFyIHNsaWRlciA9IHRoaXMuc2xpZGVyKGxhYmVsLCB7XG5cdFx0aWQ6IGlkLFxuXHRcdGxhYmVsV2lkdGg6IDMwLFxuXHRcdG1pbjogMCxcblx0XHRtYXg6IDEwLFxuXHRcdHZhbHVlOiAwLFxuXHRcdHN0ZXA6IDAuMVxuXHR9KTtcblxuXHRyZXR1cm4gc2xpZGVyO1xufTtcblxuU2l6ZU1lbnUucHJvdG90eXBlLm9uTWVudUNyZWF0ZWQgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5iaW5kKFwic3RhcnRfc2l6ZV94XCIsIFwieFwiLCB0aGlzLmdldFNpemVTdGFydCk7XG5cdHRoaXMuYmluZChcInN0YXJ0X3NpemVfeVwiLCBcInlcIiwgdGhpcy5nZXRTaXplU3RhcnQpO1xuXHR0aGlzLmJpbmQoXCJlbmRfc2l6ZV94XCIsIFwieFwiLCB0aGlzLmdldFNpemVFbmQpO1xuXHR0aGlzLmJpbmQoXCJlbmRfc2l6ZV95XCIsIFwieVwiLCB0aGlzLmdldFNpemVFbmQpO1xuXHR0aGlzLmJpbmQoXCJzdGFydF9zaXplX3ZhcmlhbmNlXCIsIFwic3RhcnRWYXJpYW5jZVwiKTtcblx0dGhpcy5iaW5kKFwiZW5kX3NpemVfdmFyaWFuY2VcIiwgXCJlbmRWYXJpYW5jZVwiKTtcblxuXHQkJChcInNpemVfZW5hYmxlXCIpLmF0dGFjaEV2ZW50KFwib25DaGFuZ2VcIiwgdGhpcy5vbkVuYWJsZUNoYW5nZWQpO1xuXHRzZXJ2aWNlLm1zZy5vbihcImVtaXR0ZXIvY2hhbmdlZFwiLCB0aGlzLm9uRW1pdHRlckNoYW5nZWQpO1xufTtcblxuU2l6ZU1lbnUucHJvdG90eXBlLm9uRW5hYmxlQ2hhbmdlZCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdHNlcnZpY2UubXNnLmVtaXQoXCJiZWhhdmlvdXIvc2V0RW5hYmxlXCIsIHZhbHVlLCB0aGlzLmdldEJlaGF2aW91cigpKTtcbn07XG5cblNpemVNZW51LnByb3RvdHlwZS5vbkVtaXR0ZXJDaGFuZ2VkID0gZnVuY3Rpb24oKSB7XG5cdCQkKFwic2l6ZV9lbmFibGVcIikuc2V0VmFsdWUocHJvamVjdE1vZGVsLmhhc0FjdGl2ZUJlaGF2aW91cih0aGlzLmdldEJlaGF2aW91cigpKSk7XG59O1xuXG5TaXplTWVudS5wcm90b3R5cGUuZ2V0U2l6ZVN0YXJ0ID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmdldEJlaGF2aW91cigpLnNpemVTdGFydDtcbn07XG5cblNpemVNZW51LnByb3RvdHlwZS5nZXRTaXplRW5kID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmdldEJlaGF2aW91cigpLnNpemVFbmQ7XG59O1xuXG5TaXplTWVudS5wcm90b3R5cGUuZ2V0QmVoYXZpb3VyID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiBiZWhhdmlvdXJNb2RlbC5nZXRCZWhhdmlvdXJCeU5hbWUoanVwaXRlci5CZWhhdmlvdXJOYW1lcy5TSVpFX0JFSEFWSU9VUik7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNpemVNZW51O1xuXG5cbiIsInZhciBTdWJNZW51ID0gcmVxdWlyZShcIi4vU3ViTWVudS5qc1wiKTtcbnZhciB1dGlsID0gcmVxdWlyZShcIi4uLy4uL3V0aWxcIik7XG52YXIgc2VydmljZSA9IHJlcXVpcmUoXCIuLi8uLi9zZXJ2aWNlXCIpO1xudmFyIHByb2plY3RNb2RlbCA9IHJlcXVpcmUoXCIuLi8uLi9tb2RlbFwiKS5wcm9qZWN0TW9kZWw7XG52YXIgZW1pc3Npb25Nb2RlbCA9IHJlcXVpcmUoXCIuLi8uLi9tb2RlbFwiKS5lbWlzc2lvbk1vZGVsO1xuXG5mdW5jdGlvbiBTdGFuZGFyZEVtaXNzaW9uTWVudSgpIHtcblx0U3ViTWVudS5jYWxsKHRoaXMpO1xuXHR1dGlsLmJpbmQodGhpcyk7XG5cblx0dGhpcy51aSA9IHtcblx0XHRpZDogXCJzdGFuZGFyZF9lbWl0X2NvbnRyb2xsZXJfbWVudVwiLFxuXHRcdHJvd3M6IFtcblx0XHRcdHRoaXMuY291bnRlcihcIkVtaXNzaW9uIHJhdGU6XCIsIHtcblx0XHRcdFx0aWQ6IFwic3RhbmRhcmRfZW1pdF9lbWlzc2lvbl9yYXRlXCIsXG5cdFx0XHRcdHN0ZXA6IDEsIHZhbHVlOiAwLCBtaW46IDAsIG1heDogMjAwMCwgYWxpZ246IFwiY2VudGVyXCIsIGZvcm1hdDogd2ViaXguaTE4bi5udW1iZXJGb3JtYXRcblx0XHRcdH0pLFxuXHRcdFx0dGhpcy5jb3VudGVyKFwiTWF4IHBhcnRpY2xlczpcIiwge1xuXHRcdFx0XHRpZDogXCJzdGFuZGVyZF9lbWlzc2lvbl9tYXhfcGFydGljbGVzXCIsXG5cdFx0XHRcdHN0ZXA6IDEsIHZhbHVlOiAwLCBtaW46IDAsIG1heDogMjAwMCwgYWxpZ246IFwiY2VudGVyXCIsIGZvcm1hdDogd2ViaXguaTE4bi5udW1iZXJGb3JtYXRcblx0XHRcdH0pXG5cdFx0XVxuXHR9O1xufVxuXG51dGlsLmluaGVyaXQoU3RhbmRhcmRFbWlzc2lvbk1lbnUsIFN1Yk1lbnUpO1xuXG5TdGFuZGFyZEVtaXNzaW9uTWVudS5wcm90b3R5cGUub25BY3RpdmUgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5vbkVtaXR0ZXJDaGFuZ2VkKCk7XG5cblx0JCQoXCJzdGFuZGFyZF9lbWl0X2VtaXNzaW9uX3JhdGVcIikuYXR0YWNoRXZlbnQoXCJvbkNoYW5nZVwiLCB0aGlzLm9uRW1pc3Npb25SYXRlQ2hhbmdlZCk7XG5cdCQkKFwic3RhbmRlcmRfZW1pc3Npb25fbWF4X3BhcnRpY2xlc1wiKS5hdHRhY2hFdmVudChcIm9uQ2hhbmdlXCIsIHRoaXMub25NYXhQYXJ0aWNsZXNDaGFuZ2VkKTtcblx0c2VydmljZS5tc2cub24oXCJlbWl0dGVyL2NoYW5nZWRcIiwgdGhpcy5vbkVtaXR0ZXJDaGFuZ2VkKTtcbn07XG5cblN0YW5kYXJkRW1pc3Npb25NZW51LnByb3RvdHlwZS5vbkRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcblx0JCQoXCJzdGFuZGFyZF9lbWl0X2VtaXNzaW9uX3JhdGVcIikuZGV0YWNoRXZlbnQoXCJvbkNoYW5nZVwiLCB0aGlzLm9uRW1pc3Npb25SYXRlQ2hhbmdlZCk7XG5cdCQkKFwic3RhbmRlcmRfZW1pc3Npb25fbWF4X3BhcnRpY2xlc1wiKS5kZXRhY2hFdmVudChcIm9uQ2hhbmdlXCIsIHRoaXMub25NYXhQYXJ0aWNsZXNDaGFuZ2VkKTtcblx0c2VydmljZS5tc2cub2ZmKFwiZW1pdHRlci9jaGFuZ2VkXCIsIHRoaXMub25FbWl0dGVyQ2hhbmdlZCk7XG59O1xuXG5TdGFuZGFyZEVtaXNzaW9uTWVudS5wcm90b3R5cGUub25FbWlzc2lvblJhdGVDaGFuZ2VkID0gZnVuY3Rpb24odmFsdWUpIHtcblx0dGhpcy5nZXRDb250cm9sbGVyKCkuZW1pc3Npb25SYXRlID0gdmFsdWU7XG59O1xuXG5TdGFuZGFyZEVtaXNzaW9uTWVudS5wcm90b3R5cGUub25NYXhQYXJ0aWNsZXNDaGFuZ2VkID0gZnVuY3Rpb24odmFsdWUpIHtcblx0dGhpcy5nZXRDb250cm9sbGVyKCkubWF4UGFydGljbGVzID0gdmFsdWU7XG59O1xuXG5TdGFuZGFyZEVtaXNzaW9uTWVudS5wcm90b3R5cGUub25FbWl0dGVyQ2hhbmdlZCA9IGZ1bmN0aW9uKCkge1xuXHQkJChcInN0YW5kYXJkX2VtaXRfZW1pc3Npb25fcmF0ZVwiKS5zZXRWYWx1ZSh0aGlzLmdldENvbnRyb2xsZXIoKS5lbWlzc2lvblJhdGUpO1xuXHQkJChcInN0YW5kZXJkX2VtaXNzaW9uX21heF9wYXJ0aWNsZXNcIikuc2V0VmFsdWUodGhpcy5nZXRDb250cm9sbGVyKCkubWF4UGFydGljbGVzKTtcbn07XG5cblN0YW5kYXJkRW1pc3Npb25NZW51LnByb3RvdHlwZS5nZXRDb250cm9sbGVyID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiBlbWlzc2lvbk1vZGVsLmdldEVtaXNzaW9uQnlOYW1lKGp1cGl0ZXIuRW1pc3Npb25UeXBlcy5VTklGT1JNKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU3RhbmRhcmRFbWlzc2lvbk1lbnU7IiwidmFyIGV4dGVuc2lvbiA9IHJlcXVpcmUoXCIuLi9leHRlbnNpb25cIik7XG52YXIgc2VydmljZSA9IHJlcXVpcmUoXCIuLi8uLi9zZXJ2aWNlXCIpO1xuXG5mdW5jdGlvbiBTdWJNZW51KCkge1xuXHR0aGlzLldJRFRIID0gMjAwO1xuXHRzZXJ2aWNlLm1zZy5vbihcIm1lbnUvY3JlYXRlZFwiLCB0aGlzLm9uTWVudUNyZWF0ZWQuYmluZCh0aGlzKSk7XG59XG5cblN1Yk1lbnUucHJvdG90eXBlLm9uTWVudUNyZWF0ZWQgPSBmdW5jdGlvbigpIHtcbn07XG5cblN1Yk1lbnUucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbihpZCwgcHJvcGVydHlOYW1lLCBnZXRUYXJnZXRGdW5jdGlvbikge1xuXHRnZXRUYXJnZXRGdW5jdGlvbiA9IGdldFRhcmdldEZ1bmN0aW9uIHx8IHRoaXMuZ2V0QmVoYXZpb3VyO1xuXG5cdCQkKGlkKS5vbkNoYW5nZWQgPSBmdW5jdGlvbihuZXdWYWx1ZSkge1xuXHRcdC8vY29uc29sZS5sb2coXCJvbkNoYW5nZWRcIiwgaWQsIG5ld1ZhbHVlLCBnZXRUYXJnZXRGdW5jdGlvbigpKTtcblx0XHRnZXRUYXJnZXRGdW5jdGlvbigpW3Byb3BlcnR5TmFtZV0gPSBuZXdWYWx1ZTtcblx0fTtcblxuXHRzZXJ2aWNlLm1zZy5vbihcImVtaXR0ZXIvY2hhbmdlZFwiLCBmdW5jdGlvbigpIHtcblx0XHQvL2NvbnNvbGUubG9nKFwiZW1pdHRlci9jaGFuZ2VcIiwgaWQsIGdldFRhcmdldEZ1bmN0aW9uKClbcHJvcGVydHlOYW1lXSk7XG5cblx0XHR2YXIgc2V0VmFsdWUgPSAkJChpZCkuY29uZmlnLnNldFZhbHVlIHx8ICQkKGlkKS5zZXRWYWx1ZTtcblx0XHRzZXRWYWx1ZShnZXRUYXJnZXRGdW5jdGlvbigpW3Byb3BlcnR5TmFtZV0sIGdldFRhcmdldEZ1bmN0aW9uKCkpO1xuXHRcdCQkKGlkKS5yZWZyZXNoKCk7XG5cdH0pO1xufTtcblxuU3ViTWVudS5wcm90b3R5cGUub25BY3RpdmUgPSBmdW5jdGlvbigpIHtcblx0dmFyIHJvd3MgPSB0aGlzLnVpLnJvd3M7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgcm93cy5sZW5ndGg7IGkrKykge1xuXHRcdGlmKCQkKHJvd3NbaV0uaWQpLnJlZnJlc2gpe1xuXHRcdFx0JCQocm93c1tpXS5pZCkucmVmcmVzaCgpO1xuXG5cdFx0fVxuXHR9XG59O1xuXG5TdWJNZW51LnByb3RvdHlwZS5nZXRCZWhhdmlvdXIgPSBmdW5jdGlvbigpIHtcblx0dGhyb3cgbmV3IEVycm9yKFwiSGFzIHRvIGJlIG92ZXJyaWRlblwiKTtcbn07XG5cblN1Yk1lbnUucHJvdG90eXBlLmJ1dHRvbiA9IGZ1bmN0aW9uKGxhYmVsLCBzdHlsZSkge1xuXHRyZXR1cm4gdGhpcy5fc2V0dXAoe3ZpZXc6IFwiYnV0dG9uXCIsIHZhbHVlOiBsYWJlbH0sIHN0eWxlKTtcbn07XG5cblN1Yk1lbnUucHJvdG90eXBlLmNvdW50ZXIgPSBmdW5jdGlvbihsYWJlbCwgc3R5bGUpIHtcblx0cmV0dXJuIHRoaXMuX3NldHVwKHt2aWV3OiBcImNvdW50ZXJcIiwgbGFiZWw6IGxhYmVsfSwgc3R5bGUpO1xufTtcblxuU3ViTWVudS5wcm90b3R5cGUuc2VjdGlvbiA9IGZ1bmN0aW9uKGxhYmVsKSB7XG5cdHJldHVybiB7dmlldzogXCJ0ZW1wbGF0ZVwiLCB0ZW1wbGF0ZTogbGFiZWwsIHR5cGU6IFwic2VjdGlvblwifTtcblx0Ly9yZXR1cm4ge3ZpZXc6IFwibGFiZWxcIiwgbGFiZWw6IGxhYmVsLCB3aWR0aDogdGhpcy5XSURUSCwgaGVpZ2h0OiAzMCwgYWxpZ246IFwiY2VudGVyXCJ9O1xufTtcblxuU3ViTWVudS5wcm90b3R5cGUudGl0bGUgPSBmdW5jdGlvbihsYWJlbCkge1xuXHQvL3JldHVybiB7dmlldzogXCJ0ZW1wbGF0ZVwiLCB0ZW1wbGF0ZTogbGFiZWwsIHdpZHRoOiB0aGlzLldJRFRILCB0eXBlOiBcInNlY3Rpb25cIn07XG5cdHJldHVybiB7dmlldzogXCJsYWJlbFwiLCBsYWJlbDogbGFiZWwsIGhlaWdodDogMzAsIGFsaWduOiBcImNlbnRlclwifTtcbn07XG5cblN1Yk1lbnUucHJvdG90eXBlLmNoZWNrYm94ID0gZnVuY3Rpb24obGFiZWwsIHN0eWxlKSB7XG5cdHJldHVybiB0aGlzLl9zZXR1cCh7dmlldzogXCJjaGVja2JveFwiLCBsYWJlbDogbGFiZWx9LCBzdHlsZSk7XG59O1xuXG5TdWJNZW51LnByb3RvdHlwZS5zbGlkZXIgPSBmdW5jdGlvbih0aXRsZSwgc3R5bGUpIHtcblx0c3R5bGUgPSBleHRlbnNpb24uc2xpZGVyKHRpdGxlLCBzdHlsZSk7XG5cdHJldHVybiB0aGlzLl9zZXR1cCh7dmlldzogXCJzbGlkZXJcIn0sIHN0eWxlKTtcblxufTtcblxuU3ViTWVudS5wcm90b3R5cGUuX3NldHVwID0gZnVuY3Rpb24oZGVmYXVsdFN0eWxlLCBleHRyYVN0eWxlKSB7XG5cdGV4dHJhU3R5bGUgPSBleHRyYVN0eWxlIHx8IHt9O1xuXHRkZWZhdWx0U3R5bGUud2lkdGggPSB0aGlzLldJRFRIO1xuXHRkZWZhdWx0U3R5bGUuaWQgPSBleHRyYVN0eWxlLmlkIHx8IHdlYml4LnVpZCgpO1xuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihkZWZhdWx0U3R5bGUsIGV4dHJhU3R5bGUpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTdWJNZW51OyIsInZhciBTdWJNZW51ID0gcmVxdWlyZShcIi4vU3ViTWVudS5qc1wiKTtcbnZhciB1dGlsID0gcmVxdWlyZShcIi4uLy4uL3V0aWxcIik7XG52YXIgc2VydmljZSA9IHJlcXVpcmUoXCIuLi8uLi9zZXJ2aWNlXCIpO1xuXG52YXIgY29udHJvbGxlciA9IHJlcXVpcmUoXCIuLi8uLi9jb250cm9sbGVyXCIpLnRleHR1cmVNZW51Q29udHJvbGxlcjtcbnZhciB0ZXh0dXJlc01vZGVsID0gcmVxdWlyZShcIi4uLy4uL21vZGVsXCIpLnRleHR1cmVzTW9kZWw7XG5cbmZ1bmN0aW9uIFRleHR1cmVNZW51KCkge1xuXHRTdWJNZW51LmNhbGwodGhpcyk7XG5cdHV0aWwuYmluZCh0aGlzKTtcblxuXHR0aGlzLnVpID0ge1xuXHRcdHJvd3M6IFtcblx0XHRcdC8vdGhpcy5idXR0b24oXCJFeHBvcnQgdGV4dHVyZVwiKSxcblx0XHRcdHRoaXMuYnV0dG9uKFwiVXBsb2FkIHRleHR1cmVcIiwge2NsaWNrOiB0aGlzLm9uVXBsb2FkVGV4dHVyZX0pLFxuXHRcdFx0dGhpcy5idXR0b24oXCJTaG93IGFsbFwiLCB7Y2xpY2s6IHRoaXMub25TaG93QWxsfSksXG5cdFx0XHR0aGlzLnRleHR1cmVQcmV2aWV3KClcblx0XHRdXG5cdH07XG5cblx0Ly90b2RvOiByZWZhY3RvclxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWQtdGV4dHVyZVwiKS5vbmNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHNlcnZpY2UubXNnLmVtaXQoXCJ0ZXh0dXJlL3VwbG9hZFwiKTtcblx0fTtcbn1cblxudXRpbC5pbmhlcml0KFRleHR1cmVNZW51LCBTdWJNZW51KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUZXh0dXJlTWVudTtcblxuVGV4dHVyZU1lbnUucHJvdG90eXBlLm9uVXBsb2FkVGV4dHVyZSA9IGZ1bmN0aW9uKCkge1xuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWQtdGV4dHVyZVwiKS5jbGljaygpO1xufTtcblxuVGV4dHVyZU1lbnUucHJvdG90eXBlLnRleHR1cmVQcmV2aWV3ID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0dmlldzogXCJjYXJvdXNlbFwiLFxuXHRcdGlkOiBcImNhcm91c2VsXCIsXG5cdFx0d2lkdGg6IDEwMCwgaGVpZ2h0OiAxMDAsXG5cdFx0Y29sczogdGhpcy5nZXRUZXh0dXJlc1ByZXZpZXdEYXRhKCksXG5cdFx0bmF2aWdhdGlvbjoge1xuXHRcdFx0aXRlbXM6IGZhbHNlXG5cdFx0fVxuXHR9O1xuXG59O1xuXG5UZXh0dXJlTWVudS5wcm90b3R5cGUub25NZW51Q3JlYXRlZCA9IGZ1bmN0aW9uKCkge1xuXHQkJChcImNhcm91c2VsXCIpLmF0dGFjaEV2ZW50KFwib25TaG93XCIsIGZ1bmN0aW9uKG5hbWUpIHtcblx0XHRzZXJ2aWNlLm1zZy5lbWl0KFwidGV4dHVyZS9jaGFuZ2VcIiwgbmFtZSk7XG5cdH0pO1xufTtcblxuVGV4dHVyZU1lbnUucHJvdG90eXBlLm9uU2hvd0FsbCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnRleHR1cmVzV2luZG93ID0gd2ViaXgudWkoe1xuXHRcdHZpZXc6IFwid2luZG93XCIsXG5cdFx0Ym9keToge1xuXHRcdFx0cm93czogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dmlldzogXCJkYXRhdmlld1wiLFxuXHRcdFx0XHRcdHlDb3VudDogMixcblx0XHRcdFx0XHR4Q291bnQ6IDIsXG5cdFx0XHRcdFx0c2VsZWN0OiB0cnVlLFxuXHRcdFx0XHRcdHNjcm9sbDogdHJ1ZSxcblx0XHRcdFx0XHR0eXBlOiB7XG5cdFx0XHRcdFx0XHR3aWR0aDogMTAwLFxuXHRcdFx0XHRcdFx0aGVpZ2h0OiAxMDBcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHRlbXBsYXRlOiBpbWFnZVRlbXBsYXRlLFxuXHRcdFx0XHRcdGRhdGE6IHRoaXMuZ2V0VGV4dHVyZXNWaWV3RGF0YSgpLFxuXHRcdFx0XHRcdGNsaWNrOiB0aGlzLm9uTWVudUl0ZW1DbGljay5iaW5kKHRoaXMpXG5cblx0XHRcdFx0fVxuXHRcdFx0XVxuXG5cdFx0fSxcblx0XHRoZWFkOiBmYWxzZSxcblx0XHR0b3A6IDEwMCxcblx0XHRsZWZ0OiAxMDAsXG5cdFx0d2lkdGg6IDYwMCxcblx0XHRoZWlnaHQ6IDUwMFxuXHR9KTtcblxuXHR0aGlzLnRleHR1cmVzV2luZG93LnNob3coKTtcbn07XG5cblRleHR1cmVNZW51LnByb3RvdHlwZS5vbk1lbnVJdGVtQ2xpY2sgPSBmdW5jdGlvbihuYW1lKSB7XG5cdHRoaXMudGV4dHVyZXNXaW5kb3cuaGlkZSgpO1xuXHQkJChcImNhcm91c2VsXCIpLnNldEFjdGl2ZShuYW1lKTtcbn07XG5cblRleHR1cmVNZW51LnByb3RvdHlwZS5nZXRUZXh0dXJlc1ByZXZpZXdEYXRhID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0ZXh0dXJlc01vZGVsLmdldFRleHR1cmVzKCkubWFwKGZ1bmN0aW9uKHRleHR1cmUpIHtcblx0XHRyZXR1cm4ge2lkOiB0ZXh0dXJlLm5hbWUsIGNzczogXCJpbWFnZVwiLCB0ZW1wbGF0ZTogaW1hZ2VUZW1wbGF0ZSwgZGF0YToge3NyYzogdGV4dHVyZS51cmx9fTtcblx0fSk7XG59O1xuXG5UZXh0dXJlTWVudS5wcm90b3R5cGUuZ2V0VGV4dHVyZXNWaWV3RGF0YSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGV4dHVyZXNNb2RlbC5nZXRUZXh0dXJlcygpLm1hcChmdW5jdGlvbih0ZXh0dXJlKSB7XG5cdFx0cmV0dXJuIHtpZDogdGV4dHVyZS5uYW1lLCBzcmM6IHRleHR1cmUudXJsLCB0aXRsZTogdGV4dHVyZS5uYW1lfTtcblx0fSk7XG59O1xuXG5mdW5jdGlvbiBpbWFnZVRlbXBsYXRlKG9iaikge1xuXHRyZXR1cm4gXCI8ZGl2IGNsYXNzPSd0ZXh0dXJlLXByZXZpZXcnPjxpbWcgc3JjPSdcIiArIG9iai5zcmMgKyBcIicgY2xhc3M9J3RleHR1cmUtcHJldmlldy1jb250ZW50JyBvbmRyYWdzdGFydD0ncmV0dXJuIGZhbHNlJy8+PC9kaXY+XCI7XG59XG5cblxuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0TWVudTogcmVxdWlyZShcIi4vTWVudS5qc1wiKSxcblx0UHJvamVjdE1lbnU6IHJlcXVpcmUoXCIuL1Byb2plY3RNZW51LmpzXCIpXG59OyIsInZhciB1dGlsID0gcmVxdWlyZShcIi4uLy4uL3V0aWxcIik7XG52YXIgc2VydmljZSA9IHJlcXVpcmUoXCIuLi8uLi9zZXJ2aWNlXCIpO1xudmFyIFN0YWdlQmFja2dyb3VuZCA9IHJlcXVpcmUoXCIuL1N0YWdlQmFja2dyb3VuZC5qc1wiKTtcbnZhciBNYXJrZXIgPSByZXF1aXJlKFwiLi4vTWFya2VyLmpzXCIpO1xudmFyIHByb2plY3RNb2RlbCA9IHJlcXVpcmUoXCIuLi8uLi9tb2RlbFwiKS5wcm9qZWN0TW9kZWw7XG5cbmZ1bmN0aW9uIFN0YWdlKHJlY3QpIHtcblx0UElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcblx0dXRpbC5iaW5kKHRoaXMpO1xuXG5cdHRoaXMucmVjdCA9IHJlY3Q7XG5cdHRoaXMuaGl0QXJlYSA9IHJlY3Q7XG5cdHRoaXMuaW50ZXJhY3RpdmUgPSB0cnVlO1xuXHR0aGlzLmhhc0ZvY3VzID0gZmFsc2U7XG5cblx0dGhpcy5tb3VzZW92ZXIgPSBmdW5jdGlvbigpIHtcblx0XHRzZXJ2aWNlLm1zZy5lbWl0KFwic3RhZ2UvbW91c2VPdmVyXCIpO1xuXHR9O1xuXG5cdHRoaXMubW91c2VvdXQgPSBmdW5jdGlvbigpIHtcblx0XHRzZXJ2aWNlLm1zZy5lbWl0KFwic3RhZ2UvbW91c2VPdXRcIik7XG5cdH07XG5cblx0dmFyIGJhY2tncm91bmQgPSB0aGlzLmFkZENoaWxkKG5ldyBTdGFnZUJhY2tncm91bmQoKSk7XG5cdGJhY2tncm91bmQueCA9IHJlY3Qud2lkdGggLyAyO1xuXHRiYWNrZ3JvdW5kLnkgPSByZWN0LmhlaWdodCAvIDI7XG5cblx0dGhpcy5tYXJrZXIgPSB0aGlzLmFkZENoaWxkKG5ldyBNYXJrZXIodGhpcy5vbk1hcmtlckRyYWcpKTtcblx0cHJvamVjdE1vZGVsLm9uKFwibWFya2VyUG9zaXRpb24vY2hhbmdlZFwiLCB0aGlzLm9uTWFya2VyUG9zaXRpb25DaGFuZ2VkKTtcblxuXHR0aGlzLm9uTWFya2VyUG9zaXRpb25DaGFuZ2VkKCk7XG59XG5cbnV0aWwuaW5oZXJpdChTdGFnZSwgUElYSS5Db250YWluZXIpO1xuXG5TdGFnZS5wcm90b3R5cGUub25NYXJrZXJEcmFnID0gZnVuY3Rpb24ocG9zaXRpb24pIHtcblx0cHJvamVjdE1vZGVsLm1hcmtlclBvc2l0aW9uSW5TdGFnZUNvb3JkaW5hdGVzID0gcG9zaXRpb247XG59O1xuXG5TdGFnZS5wcm90b3R5cGUub25NYXJrZXJQb3NpdGlvbkNoYW5nZWQgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5tYXJrZXIucG9zaXRpb24gPSBwcm9qZWN0TW9kZWwubWFya2VyUG9zaXRpb25JblN0YWdlQ29vcmRpbmF0ZXM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN0YWdlOyIsInZhciB1dGlsID0gcmVxdWlyZShcIi4uLy4uL3V0aWxcIik7XG52YXIgc2VydmljZSA9IHJlcXVpcmUoXCIuLi8uLi9zZXJ2aWNlXCIpO1xudmFyIGJhY2tncm91bmRNb2RlbCA9IHJlcXVpcmUoXCIuLi8uLi9tb2RlbFwiKS5iYWNrZ3JvdW5kTW9kZWw7XG5cbmZ1bmN0aW9uIFN0YWdlQmFja2dyb3VuZCgpIHtcblx0UElYSS5Db250YWluZXIuY2FsbCh0aGlzKTtcblx0dXRpbC5iaW5kKHRoaXMpO1xuXG5cdGJhY2tncm91bmRNb2RlbC5vbihcImlzTG9ja2VkL2NoYW5nZWRcIiwgdGhpcy5vbklzTG9ja2VkQ2hhbmdlZCk7XG5cdGJhY2tncm91bmRNb2RlbC5vbihcInRleHR1cmUvY2hhbmdlZFwiLCB0aGlzLm9uVGV4dHVyZUNoYW5nZWQpO1xuXHRiYWNrZ3JvdW5kTW9kZWwub24oXCJpbWFnZVBvc2l0aW9uL2NoYW5nZWRcIiwgdGhpcy5vblBvc2l0aW9uQ2hhbmdlZCk7XG5cblx0dGhpcy5tb3VzZWRvd24gPSB0aGlzLnRvdWNoc3RhcnQgPSB0aGlzLm9uTW91c2VEb3duO1xuXHR0aGlzLm1vdXNldXAgPSB0aGlzLm1vdXNldXBvdXRzaWRlID0gdGhpcy50b3VjaGVuZCA9IHRoaXMudG91Y2hlbmRvdXRzaWRlID0gdGhpcy5vbk1vdXNlVXA7XG5cdHRoaXMubW91c2Vtb3ZlID0gdGhpcy50b3VjaG1vdmUgPSB0aGlzLm9uTW91c2VNb3ZlO1xuXG5cdHRoaXMub25Jc0xvY2tlZENoYW5nZWQoKTtcbn1cblxudXRpbC5pbmhlcml0KFN0YWdlQmFja2dyb3VuZCwgUElYSS5Db250YWluZXIpO1xuXG5TdGFnZUJhY2tncm91bmQucHJvdG90eXBlLm9uSXNMb2NrZWRDaGFuZ2VkID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuaW50ZXJhY3RpdmUgPSAhYmFja2dyb3VuZE1vZGVsLmlzTG9ja2VkO1xuXHR0aGlzLmJ1dHRvbk1vZGUgPSAhYmFja2dyb3VuZE1vZGVsLmlzTG9ja2VkO1xufTtcblxuU3RhZ2VCYWNrZ3JvdW5kLnByb3RvdHlwZS5vblRleHR1cmVDaGFuZ2VkID0gZnVuY3Rpb24oKSB7XG5cdGlmICghYmFja2dyb3VuZE1vZGVsLnRleHR1cmUgJiYgdGhpcy5pbWFnZSkge1xuXHRcdHRoaXMucmVtb3ZlQ2hpbGQodGhpcy5pbWFnZSk7XG5cdFx0dGhpcy5pbWFnZSA9IG51bGw7XG5cdH1cblx0ZWxzZSB7XG5cdFx0dGhpcy5pbWFnZSA9IHRoaXMuaW1hZ2UgfHwgdGhpcy5jcmVhdGVJbWFnZSgpO1xuXHRcdHRoaXMuaW1hZ2UudGV4dHVyZSA9IGJhY2tncm91bmRNb2RlbC50ZXh0dXJlO1xuXHRcdHRoaXMub25Qb3NpdGlvbkNoYW5nZWQoKTtcblx0fVxufTtcblxuU3RhZ2VCYWNrZ3JvdW5kLnByb3RvdHlwZS5vblBvc2l0aW9uQ2hhbmdlZCA9IGZ1bmN0aW9uKCkge1xuXHRpZiAodGhpcy5pbWFnZSkge1xuXHRcdHRoaXMuaW1hZ2UueCA9IGJhY2tncm91bmRNb2RlbC5pbWFnZVBvc2l0aW9uLng7XG5cdFx0dGhpcy5pbWFnZS55ID0gYmFja2dyb3VuZE1vZGVsLmltYWdlUG9zaXRpb24ueTtcblx0fVxufTtcblxuU3RhZ2VCYWNrZ3JvdW5kLnByb3RvdHlwZS5jcmVhdGVJbWFnZSA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgaW1hZ2UgPSBuZXcgUElYSS5TcHJpdGUoUElYSS5UZXh0dXJlLkVNUFRZKTtcblx0aW1hZ2UuYW5jaG9yLnNldCgwLjUsIDAuNSk7XG5cdHJldHVybiB0aGlzLmFkZENoaWxkKGltYWdlKTtcbn07XG5cblN0YWdlQmFja2dyb3VuZC5wcm90b3R5cGUub25Nb3VzZURvd24gPSBmdW5jdGlvbigpIHtcblx0dGhpcy5kcmFnZ2luZyA9IHRydWU7XG59O1xuXG5TdGFnZUJhY2tncm91bmQucHJvdG90eXBlLm9uTW91c2VVcCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLmRyYWdnaW5nID0gZmFsc2U7XG59O1xuXG5TdGFnZUJhY2tncm91bmQucHJvdG90eXBlLm9uTW91c2VNb3ZlID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0aWYgKHRoaXMuZHJhZ2dpbmcpIHtcblx0XHR2YXIgbmV3UG9zaXRpb24gPSBldmVudC5kYXRhLmdldExvY2FsUG9zaXRpb24odGhpcyk7XG5cdFx0YmFja2dyb3VuZE1vZGVsLmltYWdlUG9zaXRpb24gPSBuZXdQb3NpdGlvbi5jbG9uZSgpO1xuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN0YWdlQmFja2dyb3VuZDsiXX0=

//# sourceMappingURL=jupiter_designer.js.map
