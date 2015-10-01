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




},{"./model":15,"./view":26}],2:[function(require,module,exports){
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
},{"../model":15,"../service":17}],4:[function(require,module,exports){
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

},{"../model":15,"../service":17,"../util":19}],5:[function(require,module,exports){
var file = require("../service").file;
var service = require("../service");
var projectModel = require("../model").projectModel;
var predefinedModel = require("../model").predefinedModel;
var behaviourModel = require("../model").behaviourModel;
var texturesModel = require("../model").texturesModel;
var backgroundModel = require("../model").backgroundModel;

function ProjectMenuController() {
	service.msg.on("project/save", this.onSaveProject, this);
	service.msg.on("project/load", this.onLoadProject, this);
	service.msg.on("project/exportConfig", this.onExportConfig, this);
	service.msg.on("project/loadConfig", this.onLoadConfig, this);
	service.msg.on("project/loadPredefined", this.onLoadPredefined, this);

	projectModel.on("emitterConfig/changed", this.refreshBehaviours);
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
	//projectModel.setEmitterConfig(predefinedModel.getByName(name));
};

ProjectMenuController.prototype.refreshBehaviours = function() {
	var behaviours = projectModel.emitter.behaviours.getAll();
	for (var i = 0; i < behaviours.length; i++) {
		behaviourModel.addBehaviour(behaviours[i]);
	}
	service.msg.emit("emitter/changed");
};

module.exports = ProjectMenuController;
},{"../model":15,"../service":17}],6:[function(require,module,exports){
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
},{"../model":15,"../service":17}],7:[function(require,module,exports){
var ProjectMenuController = require("./ProjectMenuController.js");
var TextureMenuController = require("./TextureMenuController.js");
var BackgroundMenuController = require("./BackgroundMenuController.js");
var BehaviourController = require("./BehaviourController.js");

module.exports = {
	projectMenuController: new ProjectMenuController(),
	textureMenuController: new TextureMenuController(),
	backgroundMenuController: new BackgroundMenuController(),
	behaviourController: new BehaviourController()
};
},{"./BackgroundMenuController.js":3,"./BehaviourController.js":4,"./ProjectMenuController.js":5,"./TextureMenuController.js":6}],8:[function(require,module,exports){
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
},{"../util":19,"./Model.js":10}],9:[function(require,module,exports){
function BehaviourModel() {

	this.behaviours = {};
	this.addBehaviour(new jupiter.LifeBehaviour());
	this.addBehaviour(new jupiter.PositionBehaviour());
	this.addBehaviour(new jupiter.ColorBehaviour());
	this.addBehaviour(new jupiter.SizeBehaviour());
	this.addBehaviour(new jupiter.AngularVelocityBehaviour());
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
},{}],10:[function(require,module,exports){
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
},{"../util":19,"eventemitter3":2}],11:[function(require,module,exports){
function ParticleModel(){
	this.texture = null;
	this.name = null;
	this.predefined = false;
}


module.exports = ParticleModel;
},{}],12:[function(require,module,exports){
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
		"assets/config/radial.jup"
	];
};

module.exports = PredefinedModel;
},{}],13:[function(require,module,exports){
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
},{"../util":19,"./Model.js":10}],14:[function(require,module,exports){
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
},{"../util":19,"./Model.js":10}],15:[function(require,module,exports){
var ProjectModel = require("./ProjectModel.js");
var BackgroundModel = require("./BackgroundModel.js");
var ParticleModel = require("./ParticleModel.js");
var BehaviourModel = require("./BehaviourModel.js");
var PredefinedModel = require("./PredefinedModel.js");
var TexturesModel = require("./TexturesModel.js");

module.exports = {
	projectModel: new ProjectModel(),
	particleModel: new ParticleModel(),
	behaviourModel: new BehaviourModel(),
	predefinedModel: new PredefinedModel(),
	texturesModel: new TexturesModel(),
	backgroundModel: new BackgroundModel()
};
},{"./BackgroundModel.js":8,"./BehaviourModel.js":9,"./ParticleModel.js":11,"./PredefinedModel.js":12,"./ProjectModel.js":13,"./TexturesModel.js":14}],16:[function(require,module,exports){
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
},{}],17:[function(require,module,exports){
var FileService = require("./FileService.js");
var EventEmitter = require("eventemitter3");

module.exports = {
	msg: new EventEmitter(),
	file: new FileService()
};
},{"./FileService.js":16,"eventemitter3":2}],18:[function(require,module,exports){
module.exports = function(scope) {
	for (var i in scope) {
		if (typeof scope[i] === "function") {
			scope[i] = scope[i].bind(scope);
		}
	}
};
},{}],19:[function(require,module,exports){
module.exports = {
	inherit: require("./inherit.js"),
	bind: require("./bind.js")
};
},{"./bind.js":18,"./inherit.js":20}],20:[function(require,module,exports){
module.exports = function(childClass, baseClass) {
	childClass.prototype = Object.create(baseClass.prototype);
	childClass.prototype.constructor = childClass;
};
},{}],21:[function(require,module,exports){
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
},{"../model":15,"../service":17,"./ParticleView.js":23,"./menu/Menu.js":32,"./stage/Stage.js":39}],22:[function(require,module,exports){
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
},{"../service":17,"../util":19}],23:[function(require,module,exports){
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


},{"../model":15,"../service":17,"../util":19}],24:[function(require,module,exports){
module.exports = {
	slider: require("./slider.js")
};
},{"./slider.js":25}],25:[function(require,module,exports){
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
},{}],26:[function(require,module,exports){
module.exports = {
	menu: require("./menu"),
	MainView: require("./MainView.js")
};
},{"./MainView.js":21,"./menu":38}],27:[function(require,module,exports){
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
			this.rangedSlider("degrees_variance", "Degrees variance/sec:")
		]
	};
}

inherit(AngularVelocityMenu, SubMenu);

AngularVelocityMenu.prototype.rangedSlider = function(id, label) {
	var slider = this.slider(label, {
		id: id,
		labelWidth: 30,
		min: -500,
		max: 500,
		step: 0.01,
		value: 0
	});

	return slider;
};

AngularVelocityMenu.prototype.onMenuCreated = function() {
	this.bind("degrees", "degrees");
	this.bind("degrees", "degreesVariance");
	//this.bind("position_variance_x", "x", this.getPositionVariance);
	//this.bind("position_variance_y", "y", this.getPositionVariance);
	//
	//this.bind("velocity_x", "x", this.getVelocity);
	//this.bind("velocity_y", "y", this.getVelocity);
	//this.bind("velocity_variance_x", "x", this.getVelocityVariance);
	//this.bind("velocity_variance_y", "y", this.getVelocityVariance);
	//
	//this.bind("acceleration_x", "x", this.getAcceleration);
	//this.bind("acceleration_y", "y", this.getAcceleration);
	//this.bind("acceleration_variance_x", "x", this.getAccelerationVariance);
	//this.bind("acceleration_variance_y", "y", this.getAccelerationVariance);
	//
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



},{"../../model":15,"../../service":17,"../../util":19,"./SubMenu.js":36}],28:[function(require,module,exports){
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
},{"../../model":15,"../../service":17,"../../util":19,"./SubMenu.js":36}],29:[function(require,module,exports){
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



},{"../../model":15,"../../service":17,"../../util":19,"./SubMenu.js":36}],30:[function(require,module,exports){
var SubMenu = require("./SubMenu.js");
var LifeMenu = require("./LifeMenu.js");
var util = require("../../util");
var service = require("../../service");
var projectModel = require("../../model").projectModel;

function GeneralMenu() {
	SubMenu.call(this);
	util.bind(this);

	this.lifeMenu = new LifeMenu();

	this.ui = {
		rows: [
			this.section("Emitter:"),
			this.counter("Emit/sec:", {
				id: "emit_per_second",
				step: 0.1, value: 20, min: 0, max: 200, align: "center", format: webix.i18n.numberFormat
			}),
			{id: "duration", view: "text", value: -1, label: "Duration", labelAlign: "left"},
			this.section("Life:"),
			this.lifeMenu.ui,
			this.section("Emission Angle:"),

		]

	};
}

util.inherit(GeneralMenu, SubMenu);

GeneralMenu.prototype.onActive = function() {
	SubMenu.prototype.onActive.call(this);
	this.lifeMenu.onActive();
};

GeneralMenu.prototype.onMenuCreated = function() {
	$$("emit_per_second").attachEvent("onChange", this.onEmitPerSecondChanged);
	$$("duration").attachEvent("onChange", this.onDurationChanged);
	service.msg.on("emitter/changed", this.onEmitterChanged);
};

GeneralMenu.prototype.onEmitPerSecondChanged = function(value) {
	projectModel.emitter.emitController.emitPerSecond = value;
};

GeneralMenu.prototype.onDurationChanged = function(value) {
	value = parseFloat(value);
	if (!isNaN(value)) {
		projectModel.emitter.emitController.duration = value;
	}

	$$("duration").setValue(projectModel.emitter.emitController.duration);
};

GeneralMenu.prototype.onEmitterChanged = function() {
	$$("emit_per_second").setValue(projectModel.emitter.emitController.emitPerSecond);
	$$("duration").setValue(projectModel.emitter.emitController.duration);
};

module.exports = GeneralMenu;
},{"../../model":15,"../../service":17,"../../util":19,"./LifeMenu.js":31,"./SubMenu.js":36}],31:[function(require,module,exports){
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
},{"../../model":15,"../../service":17,"../../util":19,"./SubMenu.js":36}],32:[function(require,module,exports){
var ProjectMenu = require("./ProjectMenu.js");
var TextureMenu = require("./TextureMenu.js");
var BackgroundMenu = require("./BackgroundMenu.js");
var ColorMenu = require("./ColorMenu.js");
var AngularVelocityMenu = require("./AngularVelocityMenu.js");
var PositionMenu = require("./PositionMenu.js");
var SizeMenu = require("./SizeMenu.js");
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
		{value: "Size", view: new SizeMenu()}
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
},{"../../service":17,"./AngularVelocityMenu.js":27,"./BackgroundMenu.js":28,"./ColorMenu.js":29,"./GeneralMenu.js":30,"./PositionMenu.js":33,"./ProjectMenu.js":34,"./SizeMenu.js":35,"./TextureMenu.js":37}],33:[function(require,module,exports){
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



},{"../../model":15,"../../service":17,"../../util":19,"./SubMenu.js":36}],34:[function(require,module,exports){
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
},{"../../controller":7,"../../model":15,"../../service":17,"../../util":19}],35:[function(require,module,exports){
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
		value: 1
	});

	return slider;
};

SizeMenu.prototype.varianceSlider = function(id, label) {
	var slider = this.slider(label, {
		id: id,
		labelWidth: 30,
		min: 0,
		max: 10,
		value: 0
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



},{"../../model":15,"../../service":17,"../../util":19,"./SubMenu.js":36}],36:[function(require,module,exports){
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
},{"../../service":17,"../extension":24}],37:[function(require,module,exports){
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




},{"../../controller":7,"../../model":15,"../../service":17,"../../util":19,"./SubMenu.js":36}],38:[function(require,module,exports){
module.exports = {
	Menu: require("./Menu.js"),
	ProjectMenu: require("./ProjectMenu.js")
};
},{"./Menu.js":32,"./ProjectMenu.js":34}],39:[function(require,module,exports){
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
},{"../../model":15,"../../service":17,"../../util":19,"../Marker.js":22,"./StageBackground.js":40}],40:[function(require,module,exports){
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
},{"../../model":15,"../../service":17,"../../util":19}]},{},[1])


//# sourceMappingURL=jupiter_designer.js.map