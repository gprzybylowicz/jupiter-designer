(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.jupiter = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var jupiter = {
	Renderer: require("./Renderer.js")
};

module.exports = jupiter;

var engine = require("../../engine");
var Cache = require("../Cache.js");

jupiter.cache = new Cache();
Object.assign(jupiter, engine);

jupiter.create = function(configName, textureName) {
	var config = jupiter.cache.get(configName);
	var texture = PIXI.Texture.fromFrame(textureName);

	var emitter = new engine.Emitter();
	emitter.getParser().read(config);
	return new jupiter.Renderer(emitter, texture);
};


},{"../../engine":22,"../Cache.js":36,"./Renderer.js":37}],2:[function(require,module,exports){
(function (global){
; var __browserify_shim_require__=require;(function browserifyShim(module, exports, require, define, browserify_shim__define__module__export__) {

/*
  I've wrapped Makoto Matsumoto and Takuji Nishimura's code in a namespace
  so it's better encapsulated. Now you can have multiple random number generators
  and they won't stomp all over eachother's state.
  
  If you want to use this as a substitute for Math.random(), use the random()
  method like so:
  
  var m = new MersenneTwister();
  var randomNumber = m.random();
  
  You can also call the other genrand_{foo}() methods on the instance.

  If you want to use a specific seed in order to get a repeatable random
  sequence, pass an integer into the constructor:

  var m = new MersenneTwister(123);

  and that will always produce the same random sequence.

  Sean McCullough (banksean@gmail.com)
*/

/* 
   A C-program for MT19937, with initialization improved 2002/1/26.
   Coded by Takuji Nishimura and Makoto Matsumoto.
 
   Before using, initialize the state by using init_genrand(seed)  
   or init_by_array(init_key, key_length).
 
   Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
   All rights reserved.                          
 
   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions
   are met:
 
     1. Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.
 
     2. Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.
 
     3. The names of its contributors may not be used to endorse or promote 
        products derived from this software without specific prior written 
        permission.
 
   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
   A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
   CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
   EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
   PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
   PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 
 
   Any feedback is very welcome.
   http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
   email: m-mat @ math.sci.hiroshima-u.ac.jp (remove space)
*/

var MersenneTwister = function(seed) {
  if (seed == undefined) {
    seed = new Date().getTime();
  } 
  /* Period parameters */  
  this.N = 624;
  this.M = 397;
  this.MATRIX_A = 0x9908b0df;   /* constant vector a */
  this.UPPER_MASK = 0x80000000; /* most significant w-r bits */
  this.LOWER_MASK = 0x7fffffff; /* least significant r bits */
 
  this.mt = new Array(this.N); /* the array for the state vector */
  this.mti=this.N+1; /* mti==N+1 means mt[N] is not initialized */

  this.init_genrand(seed);
}  
 
/* initializes mt[N] with a seed */
MersenneTwister.prototype.init_genrand = function(s) {
  this.mt[0] = s >>> 0;
  for (this.mti=1; this.mti<this.N; this.mti++) {
      var s = this.mt[this.mti-1] ^ (this.mt[this.mti-1] >>> 30);
   this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253)
  + this.mti;
      /* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
      /* In the previous versions, MSBs of the seed affect   */
      /* only MSBs of the array mt[].                        */
      /* 2002/01/09 modified by Makoto Matsumoto             */
      this.mt[this.mti] >>>= 0;
      /* for >32 bit machines */
  }
}
 
/* initialize by an array with array-length */
/* init_key is the array for initializing keys */
/* key_length is its length */
/* slight change for C++, 2004/2/26 */
MersenneTwister.prototype.init_by_array = function(init_key, key_length) {
  var i, j, k;
  this.init_genrand(19650218);
  i=1; j=0;
  k = (this.N>key_length ? this.N : key_length);
  for (; k; k--) {
    var s = this.mt[i-1] ^ (this.mt[i-1] >>> 30)
    this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525)))
      + init_key[j] + j; /* non linear */
    this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
    i++; j++;
    if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
    if (j>=key_length) j=0;
  }
  for (k=this.N-1; k; k--) {
    var s = this.mt[i-1] ^ (this.mt[i-1] >>> 30);
    this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941))
      - i; /* non linear */
    this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
    i++;
    if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
  }

  this.mt[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */ 
}
 
/* generates a random number on [0,0xffffffff]-interval */
MersenneTwister.prototype.genrand_int32 = function() {
  var y;
  var mag01 = new Array(0x0, this.MATRIX_A);
  /* mag01[x] = x * MATRIX_A  for x=0,1 */

  if (this.mti >= this.N) { /* generate N words at one time */
    var kk;

    if (this.mti == this.N+1)   /* if init_genrand() has not been called, */
      this.init_genrand(5489); /* a default initial seed is used */

    for (kk=0;kk<this.N-this.M;kk++) {
      y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
      this.mt[kk] = this.mt[kk+this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
    }
    for (;kk<this.N-1;kk++) {
      y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
      this.mt[kk] = this.mt[kk+(this.M-this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
    }
    y = (this.mt[this.N-1]&this.UPPER_MASK)|(this.mt[0]&this.LOWER_MASK);
    this.mt[this.N-1] = this.mt[this.M-1] ^ (y >>> 1) ^ mag01[y & 0x1];

    this.mti = 0;
  }

  y = this.mt[this.mti++];

  /* Tempering */
  y ^= (y >>> 11);
  y ^= (y << 7) & 0x9d2c5680;
  y ^= (y << 15) & 0xefc60000;
  y ^= (y >>> 18);

  return y >>> 0;
}
 
/* generates a random number on [0,0x7fffffff]-interval */
MersenneTwister.prototype.genrand_int31 = function() {
  return (this.genrand_int32()>>>1);
}
 
/* generates a random number on [0,1]-real-interval */
MersenneTwister.prototype.genrand_real1 = function() {
  return this.genrand_int32()*(1.0/4294967295.0); 
  /* divided by 2^32-1 */ 
}

/* generates a random number on [0,1)-real-interval */
MersenneTwister.prototype.random = function() {
  return this.genrand_int32()*(1.0/4294967296.0); 
  /* divided by 2^32 */
}
 
/* generates a random number on (0,1)-real-interval */
MersenneTwister.prototype.genrand_real3 = function() {
  return (this.genrand_int32() + 0.5)*(1.0/4294967296.0); 
  /* divided by 2^32 */
}
 
/* generates a random number on [0,1) with 53-bit resolution*/
MersenneTwister.prototype.genrand_res53 = function() { 
  var a=this.genrand_int32()>>>5, b=this.genrand_int32()>>>6; 
  return(a*67108864.0+b)*(1.0/9007199254740992.0); 
} 

/* These real versions are due to Isaku Wada, 2002/01/09 added */

; browserify_shim__define__module__export__(typeof MersenneTwister != "undefined" ? MersenneTwister : window.MersenneTwister);

}).call(global, undefined, undefined, undefined, undefined, function defineExport(ex) { module.exports = ex; });

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
'use strict';

function ToObject(val) {
	if (val == null) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

module.exports = Object.assign || function (target, source) {
	var from;
	var keys;
	var to = ToObject(target);

	for (var s = 1; s < arguments.length; s++) {
		from = arguments[s];
		keys = Object.keys(Object(from));

		for (var i = 0; i < keys.length; i++) {
			to[keys[i]] = from[keys[i]];
		}
	}

	return to;
};

},{}],5:[function(require,module,exports){
var Point = require("./util").Point;
var Color = require("./util").Color;

Particle._UID = Particle._UID || {value: 0};

function Particle() {
	this.next = null;
	this.prev = null;

	this.uid = Particle._UID.value++;

	this.maxLifeTime = 0;
	this.lifeTime = 0;
	this.lifeProgress = 0;

	this.position = new Point();
	this.acceleration = new Point();
	this.velocity = new Point();

	this.angle = 0;
	this.radiansPerSecond = 0;
	this.radius = 0;
	this.radiusStart = 0;
	this.radiusEnd = 0;

	this.size = new Point();
	this.sizeStart = new Point();
	this.sizeEnd = new Point();

	this.color = new Color();
	this.colorStart = new Color();
	this.colorEnd = new Color();

	this.reset();
}

Particle.prototype.reset = function() {
	this.maxLifeTime = 0;
	this.lifeTime = 0;
	this.lifeProgress = 0;

	this.position.set(0, 0);
	this.acceleration.set(0, 0);
	this.velocity.set(0, 0);

	this.angle = 0;
	this.radiansPerSecond = 0;
	this.radius = 0;
	this.radiusStart = 0;
	this.radiusEnd = 0;

	this.size.set(1, 1);
	this.sizeStart.set(0, 0);
	this.sizeEnd.set(0, 0);

	this.color.set(255, 255, 255, 1);
	this.colorStart.set(0, 0, 0, 1);
	this.colorEnd.set(0, 0, 0, 1);
};

Particle.prototype.isDead = function() {
	return this.lifeTime >= this.maxLifeTime;
};

module.exports = Particle;

},{"./util":31}],6:[function(require,module,exports){
var Particle = require("./Particle.js");

ParticlePool.global = new ParticlePool();

function ParticlePool() {
	this.first = null;
}

ParticlePool.prototype.pop = function() {
	if (!this.first)
		return this.create();

	var current = this.first;
	this.first = current.next;
	current.next = null;
	return current;
};

ParticlePool.prototype.create = function() {
	return new Particle();
};

ParticlePool.prototype.push = function(particle) {
	particle.next = this.first;
	this.first = particle;
};

module.exports = ParticlePool;
},{"./Particle.js":5}],7:[function(require,module,exports){
var Behaviour = require("./Behaviour.js");
var util = require("../util");

AngularVelocityBehaviour.DEFAULT_PRIORITY = 100;

function AngularVelocityBehaviour() {
	Behaviour.call(this);

	this.priority = AngularVelocityBehaviour.DEFAULT_PRIORITY;

	this.degrees = 0;
	this.degreesVariance = 0;
	this.maxRadius = 0;
	this.maxRadiusVariance = 0;
	this.minRadius = 0;
	this.minRadiusVariance = 0;
}

AngularVelocityBehaviour.prototype = Object.create(Behaviour.prototype);
AngularVelocityBehaviour.prototype.constructor = AngularVelocityBehaviour;

AngularVelocityBehaviour.prototype.init = function(particle) {
	particle.radiansPerSecond = util.Math.degreesToRadians(this.degrees + this.varianceFrom(this.degreesVariance));
	particle.radiusStart = this.maxRadius + this.varianceFrom(this.maxRadiusVariance);
	particle.radiusEnd = this.minRadius + this.varianceFrom(this.minRadiusVariance);

	particle.radius = particle.radiusStart;
	particle.position.set(0, 0);
	particle.angle = 0;
};

AngularVelocityBehaviour.prototype.apply = function(particle, deltaTime) {
	particle.angle += particle.radiansPerSecond * deltaTime;
	particle.radius = particle.radiusStart + (particle.radiusEnd - particle.radiusStart) * particle.lifeProgress;

	particle.position.x = Math.cos(particle.angle) * particle.radius;
	particle.position.y = Math.sin(particle.angle) * particle.radius;
};
AngularVelocityBehaviour.prototype.getName = function() {
	return "AngularVelocityBehaviour";
};

module.exports = AngularVelocityBehaviour;
},{"../util":31,"./Behaviour.js":8}],8:[function(require,module,exports){
var Random = require("../util").Random;
var BehaviourParser = require("../parser/BehaviourParser.js");

function Behaviour() {
	this.priority = 0;

	//Todo: enable
	//Todo: easeing
}

Behaviour.prototype.init = function(particle) {
};

Behaviour.prototype.apply = function(particle, deltaTime) {
};

Behaviour.prototype.varianceFrom = function(value) {
	if (value === 0) return 0;
	return Random.uniform(-1.0, 1.0) * value;
};

Behaviour.prototype.getName = function() {
	throw new Error("This method has to be overridden in subclass");
};

Behaviour.prototype.getParser = function() {
	return new BehaviourParser(this);
};

module.exports = Behaviour;


},{"../parser/BehaviourParser.js":23,"../util":31}],9:[function(require,module,exports){
module.exports = {
	LIFE_BEHAVIOUR: "LifeBehaviour",
	COLOR_BEHAVIOUR: "ColorBehaviour",
	POSITION_BEHAVIOUR: "PositionBehaviour",
	SIZE_BEHAVIOUR: "SizeBehaviour"
};


},{}],10:[function(require,module,exports){
var Behaviour = require("./Behaviour.js");
var BehaviourNames = require("./BehaviourNames.js");
var Color = require("../util").Color;

ColorBehaviour.DEFAULT_PRIORITY = 0;

function ColorBehaviour() {
	Behaviour.call(this);

	this.priority = ColorBehaviour.DEFAULT_PRIORITY;

	this.start = new Color();
	this.end = new Color();
	this.startVariance = new Color(0, 0, 0, 0);
	this.endVariance = new Color(0, 0, 0, 0);
}

ColorBehaviour.prototype = Object.create(Behaviour.prototype);
ColorBehaviour.prototype.constructor = ColorBehaviour;

ColorBehaviour.prototype.init = function(particle) {
	//todo optimalization??

	particle.colorStart.copyFrom(this.start);
	particle.colorStart.r += this.varianceFrom(this.startVariance.r);
	particle.colorStart.g += this.varianceFrom(this.startVariance.g);
	particle.colorStart.b += this.varianceFrom(this.startVariance.b);
	particle.colorStart.alpha += this.varianceFrom(this.startVariance.alpha);

	particle.colorEnd.copyFrom(this.end);
	particle.colorEnd.r += this.varianceFrom(this.endVariance.r);
	particle.colorEnd.g += this.varianceFrom(this.endVariance.g);
	particle.colorEnd.b += this.varianceFrom(this.endVariance.b);
	particle.colorEnd.alpha += this.varianceFrom(this.endVariance.alpha);

	particle.color.copyFrom(particle.colorStart);
};

ColorBehaviour.prototype.apply = function(particle, deltaTime) {
	particle.color.copyFrom(particle.colorStart);

	particle.color.r += (particle.colorEnd.r - particle.colorStart.r) * particle.lifeProgress;
	particle.color.g += (particle.colorEnd.g - particle.colorStart.g) * particle.lifeProgress;
	particle.color.b += (particle.colorEnd.b - particle.colorStart.b) * particle.lifeProgress;
	particle.color.alpha += (particle.colorEnd.alpha - particle.colorStart.alpha) * particle.lifeProgress;

};

ColorBehaviour.prototype.getName = function() {
	return BehaviourNames.COLOR_BEHAVIOUR;
};

module.exports = ColorBehaviour;


},{"../util":31,"./Behaviour.js":8,"./BehaviourNames.js":9}],11:[function(require,module,exports){
function EmitterBehaviours() {
	this.behaviours = [];
}

EmitterBehaviours.prototype.getAll = function() {
	return this.behaviours;
};

EmitterBehaviours.prototype.isEmpty = function() {
	return this.getAll().length === 0;
};

EmitterBehaviours.prototype.clear = function() {
	this.behaviours = [];
};

EmitterBehaviours.prototype.add = function(behaviour) {
	if (this.getByName(behaviour.getName()) !== null) {
		throw new Error("Emitter duplicate");

	}

	this.behaviours.push(behaviour);
	this.behaviours.sort(function(a, b) {
		return b.priority - a.priority;
	});

	return behaviour;
};

EmitterBehaviours.prototype.getByName = function(name) {
	for (var i = 0; i < this.behaviours.length; ++i) {
		if (this.behaviours[i].getName() === name) {
			return this.behaviours[i];
		}
	}

	return null;
};

EmitterBehaviours.prototype.init = function(particle) {
	for (var i = 0; i < this.behaviours.length; ++i) {
		this.behaviours[i].init(particle);
	}
};

EmitterBehaviours.prototype.apply = function(particle, deltaTime) {
	for (var i = 0; i < this.behaviours.length; ++i) {
		this.behaviours[i].apply(particle, deltaTime);
	}
};

module.exports = EmitterBehaviours;
},{}],12:[function(require,module,exports){
var Behaviour = require("./Behaviour.js");
var BehaviourNames = require("./BehaviourNames.js");

LifeBehaviour.DEFAULT_PRIORITY = 10000;

function LifeBehaviour() {
	Behaviour.call(this);

	this.priority = LifeBehaviour.DEFAULT_PRIORITY;
	this.maxLifeTime = 0;
	this.timeVariance = 0;
}

LifeBehaviour.prototype = Object.create(Behaviour.prototype);
LifeBehaviour.prototype.constructor = LifeBehaviour;

LifeBehaviour.prototype.init = function(particle) {
	particle.lifeTime = 0;
	particle.lifeProgress = 0;

	particle.maxLifeTime = this.maxLifeTime + this.varianceFrom(this.timeVariance);
	particle.maxLifeTime = Math.max(particle.maxLifeTime, 0.0);
};

LifeBehaviour.prototype.apply = function(particle, deltaTime) {
	particle.lifeTime += deltaTime;

	if (particle.maxLifeTime > 0) {
		particle.lifeProgress = Math.min(1.0, particle.lifeTime / particle.maxLifeTime);
	}
};

LifeBehaviour.prototype.getName = function() {
	return BehaviourNames.LIFE_BEHAVIOUR;
};

module.exports = LifeBehaviour;
},{"./Behaviour.js":8,"./BehaviourNames.js":9}],13:[function(require,module,exports){
var Behaviour = require("./Behaviour.js");
var BehaviourNames = require("./BehaviourNames.js");

var Point = require("../util").Point;

PositionBehaviour.DEFAULT_PRIORITY = 100;

function PositionBehaviour() {
	Behaviour.call(this);

	this.priority = PositionBehaviour.DEFAULT_PRIORITY;

	this.position = new Point();
	this.positionVariance = new Point();
	this.velocity = new Point();
	this.velocityVariance = new Point();
	this.acceleration = new Point();
	this.accelerationVariance = new Point();
}

PositionBehaviour.prototype = Object.create(Behaviour.prototype);
PositionBehaviour.prototype.constructor = PositionBehaviour;

PositionBehaviour.prototype.init = function(particle) {
	particle.position.x = this.calculate(this.position.x, this.positionVariance.x);
	particle.position.y = this.calculate(this.position.y, this.positionVariance.y);

	particle.velocity.x = this.calculate(this.velocity.x, this.velocityVariance.x);
	particle.velocity.y = this.calculate(this.velocity.y, this.velocityVariance.y);

	particle.acceleration.x = this.calculate(this.acceleration.x, this.accelerationVariance.x);
	particle.acceleration.y = this.calculate(this.acceleration.y, this.accelerationVariance.y);
};

PositionBehaviour.prototype.calculate = function(value, variance) {
	return value + this.varianceFrom(variance);
};

PositionBehaviour.prototype.apply = function(particle, deltaTime) {
	particle.velocity.x += (particle.acceleration.x * deltaTime);
	particle.velocity.y += (particle.acceleration.y * deltaTime);

	particle.position.x += (particle.velocity.x * deltaTime);
	particle.position.y += (particle.velocity.y * deltaTime);
};

PositionBehaviour.prototype.getName = function() {
	return BehaviourNames.POSITION_BEHAVIOUR;
};

module.exports = PositionBehaviour;
},{"../util":31,"./Behaviour.js":8,"./BehaviourNames.js":9}],14:[function(require,module,exports){
var Behaviour = require("./Behaviour.js");
var BehaviourNames = require("./BehaviourNames.js");

var Point = require("../util").Point;

SizeBehaviour.DEFAULT_PRIORITY = 0;

function SizeBehaviour() {
	Behaviour.call(this);

	this.priority = SizeBehaviour.DEFAULT_PRIORITY;

	this.allowNegativeValues = false;

	this.sizeStart = new Point(1, 1);
	this.sizeEnd = new Point(1, 1);
	this.startVariance = 0;
	this.endVariance = 0;
}

SizeBehaviour.prototype = Object.create(Behaviour.prototype);
SizeBehaviour.prototype.constructor = SizeBehaviour;

SizeBehaviour.prototype.init = function(particle) {
	//todo optimalization??

	var variance = this.varianceFrom(this.startVariance);
	particle.sizeStart.x = this.sizeStart.x + variance;
	particle.sizeStart.y = this.sizeStart.y + variance;

	variance = this.varianceFrom(this.endVariance);
	particle.sizeEnd.x = this.sizeEnd.x + variance;
	particle.sizeEnd.y = this.sizeEnd.y + variance;

	if (!this.allowNegativeValues) {
		particle.sizeStart.x = Math.max(particle.sizeStart.x, 0);
		particle.sizeStart.y = Math.max(particle.sizeStart.y, 0);
		particle.sizeEnd.x = Math.max(particle.sizeEnd.x, 0);
		particle.sizeEnd.y = Math.max(particle.sizeEnd.y, 0);
	}

	particle.size.copyFrom(particle.sizeStart);
};

SizeBehaviour.prototype.apply = function(particle, deltaTime) {
	particle.size.copyFrom(particle.sizeStart);
	particle.size.x += (particle.sizeEnd.x - particle.sizeStart.x) * particle.lifeProgress;
	particle.size.y += (particle.sizeEnd.y - particle.sizeStart.y) * particle.lifeProgress;

	if(!this.allowNegativeValues){
		particle.size.x = Math.max(0, particle.size.x);
		particle.size.x = Math.max(0, particle.size.x);
	}
};

SizeBehaviour.prototype.getName = function() {
	return BehaviourNames.SIZE_BEHAVIOUR;
};

module.exports = SizeBehaviour;
},{"../util":31,"./Behaviour.js":8,"./BehaviourNames.js":9}],15:[function(require,module,exports){
module.exports = {
	EmitterBehaviours: require("./EmitterBehaviours.js"),
	Behaviour: require("./Behaviour.js"),
	LifeBehaviour: require("./LifeBehaviour.js"),
	PositionBehaviour: require("./PositionBehaviour.js"),
	ColorBehaviour: require("./ColorBehaviour.js"),
	SizeBehaviour: require("./SizeBehaviour.js"),
	AngularVelocityBehaviour: require("./AngularVelocityBehaviour.js"),
	BehaviourNames: require("./BehaviourNames.js")
};
},{"./AngularVelocityBehaviour.js":7,"./Behaviour.js":8,"./BehaviourNames.js":9,"./ColorBehaviour.js":10,"./EmitterBehaviours.js":11,"./LifeBehaviour.js":12,"./PositionBehaviour.js":13,"./SizeBehaviour.js":14}],16:[function(require,module,exports){
var util = require("../util");
var EmitController = require("./EmitController.js");

function DefaultEmitContoller() {
	EmitController.call(this);

	this._maxParticles = 0;
	this._maxLife = 1;
	this._emitPerSecond = 0;
	this._frames = 0;
}

util.inherit(DefaultEmitContoller, EmitController);

DefaultEmitContoller.prototype.howMany = function(deltaTime) {
	var ratio = this._emitPerSecond * deltaTime;
	this._frames += ratio;

	var numberToEmit = 0;
	if (this._frames >= 1.0) {
		numberToEmit = Math.round(this._frames);
		this._frames = 0;
	}

	this._durationGuard.update(deltaTime);
	return numberToEmit;
};

DefaultEmitContoller.prototype.refresh = function() {
	this.emitPerSecond = this._maxParticles / this._maxLife;
};

Object.defineProperty(DefaultEmitContoller.prototype, "maxLife", {
	set: function(value) {
		this._maxLife = Math.max(value, 1);
		this.refresh();
	}
});

Object.defineProperty(DefaultEmitContoller.prototype, "maxParticles", {
	set: function(value) {
		this._maxParticles = Math.max(value, 0);
		this.refresh();
	}
});

Object.defineProperty(DefaultEmitContoller.prototype, "emitPerSecond", {
	get: function() {
		return this._emitPerSecond;
	},
	set: function(value) {
		this._emitPerSecond = Math.max(value, 0);
	}
});

module.exports = DefaultEmitContoller;
},{"../util":31,"./EmitController.js":18}],17:[function(require,module,exports){
function DurationGuard() {
	this.maxTime = -1;
	this._elapsedTime = null;

	this.reset();
}

DurationGuard.prototype.isTimeElapsed = function() {
	return this.maxTime > 0 && this._elapsedTime >= this.maxTime;
};

DurationGuard.prototype.update = function(deltaTime) {
	this._elapsedTime += deltaTime;
};

DurationGuard.prototype.reset = function() {
	this._elapsedTime = 0;
};

module.exports = DurationGuard;
},{}],18:[function(require,module,exports){
var DurationGuard = require("./DurationGuard.js");

function EmitContoller() {
	this._durationGuard = new DurationGuard();
}

EmitContoller.prototype.howMany = function(deltaTime) {
	throw new Error("Abstract method");
};

EmitContoller.prototype.isEnd = function() {
	return this._durationGuard.isTimeElapsed();
};

EmitContoller.prototype.reset = function() {
	this._durationGuard.reset();
};

Object.defineProperty(EmitContoller.prototype, "duration", {
	get: function() {
		return this._durationGuard.maxTime;
	},
	set: function(value) {
		this._durationGuard.maxTime = value;
	}
});

module.exports = EmitContoller;
},{"./DurationGuard.js":17}],19:[function(require,module,exports){
module.exports = {
	EmitController: require("./EmitController.js"),
	DefaultEmitController: require("./DefaultEmitController.js"),
	DurationGuard: require("./DurationGuard.js")
};
},{"./DefaultEmitController.js":16,"./DurationGuard.js":17,"./EmitController.js":18}],20:[function(require,module,exports){
module.exports = Emitter;

var EmitterBehaviours = require("../behaviour").EmitterBehaviours;
var ParticlePool = require("../ParticlePool.js");
var util = require("../util");
var DefaultEmitController = require("../controller").DefaultEmitController;
var EmitterParser = require("../parser").EmitterParser;
var parser = require("../parser");
var EventEmitter = require("eventemitter3");

function Emitter() {
	EventEmitter.call(this);

	this.list = new util.List();
	this.behaviours = new EmitterBehaviours();
	this.emitController = new DefaultEmitController();

	this.play();
}

util.inherit(Emitter, EventEmitter);

Emitter.PLAY = "emitter/play";
Emitter.STOP = "emitter/stop";
Emitter.RESET = "emitter/reset";
Emitter.CREATE = "emitter/create";
Emitter.UPDATE = "emitter/update";
Emitter.REMOVE = "emitter/remove";
Emitter.COMPLETE = "emitter/complete";

Emitter.prototype.update = function(deltaTime) {
	if (!this._play) return;

	this.emitParticles(deltaTime);
	this.updateParticles(deltaTime);

	if (this.emitController.isEnd() && this.list.isEmpty()) {
		this.stop();
		this.emit(Emitter.COMPLETE);
	}
};

Emitter.prototype.emitParticles = function(deltaTime) {
	if (!this.emitController.isEnd()) {
		this.createParticles(deltaTime);
	}

};

Emitter.prototype.createParticles = function(deltaTime) {
	var particlesToEmit = this.emitController.howMany(deltaTime);

	for (var i = 0; i < particlesToEmit; ++i) {
		var particle = this.list.add(ParticlePool.global.pop());
		this.behaviours.init(particle);
		this.emit(Emitter.CREATE, particle);
	}
};

Emitter.prototype.updateParticles = function(deltaTime) {
	this.list.forEach(function(particle) {
		this.updateParticle(particle, deltaTime);
	}.bind(this));

};

Emitter.prototype.updateParticle = function(particle, deltaTime) {
	if (particle.isDead()) {
		this.removeParticle(particle);
	}
	else {
		this.behaviours.apply(particle, deltaTime);
		this.emit(Emitter.UPDATE, particle);
	}
};

Emitter.prototype.removeParticle = function(particle) {
	this.emit(Emitter.REMOVE, particle);
	this.list.remove(particle);
	particle.reset();
	ParticlePool.global.push(particle);
};

Emitter.prototype.getParser = function() {
	return new EmitterParser(this);
};

Emitter.prototype.play = function() {
	this._play = true;
	this.emit(Emitter.PLAY);
};

Emitter.prototype.resetAndPlay = function() {
	this.reset();
	this.play();
};

Emitter.prototype.reset = function() {
	this.emitController.reset();
	this.emit(Emitter.RESET);
};

Emitter.prototype.stop = function() {
	this._play = false;
	this.removeParticles();
	this.emit(Emitter.STOP);
};

Emitter.prototype.removeParticles = function() {
	this.list.forEach(function(particle) {
		this.removeParticle(particle);
	}.bind(this));
};

},{"../ParticlePool.js":6,"../behaviour":15,"../controller":19,"../parser":25,"../util":31,"eventemitter3":3}],21:[function(require,module,exports){
module.exports = {
	Emitter: require("./Emitter.js")
};
},{"./Emitter.js":20}],22:[function(require,module,exports){
var jupiter = {
	Particle: require("./Particle.js"),
	ParticlePool: require("./ParticlePool.js")
};

module.exports = jupiter;

require("../polyfill");
var controller = require("./controller");
var behaviour = require("./behaviour");
var util = require("./util");
var emitter = require("./emitter");
var parser = require("./parser");

Object.assign(jupiter, parser);
Object.assign(jupiter, controller);
Object.assign(jupiter, behaviour);
Object.assign(jupiter, util);
Object.assign(jupiter, emitter);
},{"../polyfill":34,"./Particle.js":5,"./ParticlePool.js":6,"./behaviour":15,"./controller":19,"./emitter":21,"./parser":25,"./util":31}],23:[function(require,module,exports){
var Point = require("../util").Point;
var Color = require("../util").Color;

function BehaviourParser(behaviour) {
	this._behaviour = behaviour;
}

BehaviourParser.prototype.write = function() {
	var config = JSON.parse(JSON.stringify(this._behaviour));
	config.name = this._behaviour.getName();
	return config;
};

BehaviourParser.prototype.read = function(config) {
	for (var key in config) {
		if (this._behaviour[key] instanceof Object) {
			this._behaviour[key].copyFromRawData(config[key]);
		}
		else {
			this._behaviour[key] = config[key];
		}
	}
};

BehaviourParser.prototype._writePoint = function(point) {
	return {x: point.x, y: point.y};
};

BehaviourParser.prototype._readPoint = function(rawData) {
	var point = new Point();
	if (rawData) {
		point.x = rawData.x || 0;
		point.y = rawData.y || 0;
	}
	return point;
};

BehaviourParser.prototype._writeColor = function(color) {
	return {hex: color.hex, alpha: color.alpha};
};

BehaviourParser.prototype._readColor = function(rawData) {
	var color = new Color();
	if (rawData) {
		color.hex = rawData.hex || 0;
		color.alpha = rawData.alpha || 0;
	}
	return color;
};

module.exports = BehaviourParser;
},{"../util":31}],24:[function(require,module,exports){
var behaviours = require("../behaviour");
var Emitter = require("../emitter").Emitter;

function EmitterParser(emitter) {
	this.emitter = emitter;
}

EmitterParser.prototype.write = function() {
	var config = {behaviours: []};
	var emitterBehavious = this.emitter.behaviours.getAll();

	for (var i = 0; i < emitterBehavious.length; i++) {
		var behaviourConfig = emitterBehavious[i].getParser().write();
		config.behaviours.push(behaviourConfig);
	}

	//todo: it's temporary solution - emit controller should have dedicated parser
	config.emitController = JSON.parse(JSON.stringify(this.emitter.emitController));
	config.meta = this.getMetadata();
	return config;
};

EmitterParser.prototype.getMetadata = function() {
	return {jupiter: "1.0.0"};
};

EmitterParser.prototype.read = function(config) {
	var behavioursConfig = config.behaviours;
	var existingBehaviours = this.emitter.behaviours.getAll();
	var alwaysCreate = this.emitter.behaviours.isEmpty();

	this.emitter.behaviours.clear();
	for (var i = 0; i < behavioursConfig.length; i++) {
		var name = behavioursConfig[i].name;
		var behaviour = alwaysCreate ? this.createBehaviour(name) : this.getExistingOrCreate(name, existingBehaviours);
		behaviour.getParser().read(behavioursConfig[i]);
		this.emitter.behaviours.add(behaviour);
	}

	//todo: it's temporaty solution - see above (line 18)
	this.emitter.emitController.maxLife = config.emitController._maxLife;
	this.emitter.emitController.maxParticles = config.emitController._maxParticles;
	this.emitter.emitController.emitPerSecond = config.emitController._emitPerSecond;

	var duration = !!config.emitController._durationGuard ? config.emitController._durationGuard.maxTime : -1;
	this.emitter.emitController.duration = duration;

	return this.emitter;
};

EmitterParser.prototype.getExistingOrCreate = function(name, existingBehaviours) {
	for (var i = 0; i < existingBehaviours.length; i++) {
		if (existingBehaviours[i].getName() === name) {
			return existingBehaviours[i];
		}
	}

	return this.createBehaviour(name);
};

EmitterParser.prototype.createBehaviour = function(name) {
	return new behaviours[name];
};

module.exports = EmitterParser;
},{"../behaviour":15,"../emitter":21}],25:[function(require,module,exports){
module.exports = {
	BehaviourParser: require("./BehaviourParser.js"),
	EmitterParser: require("./EmitterParser.js")
};
},{"./BehaviourParser.js":23,"./EmitterParser.js":24}],26:[function(require,module,exports){
var MathUtil = require("./Math.js");

function Color(r, g, b, alpha) {
	this.r = r || 0;
	this.g = g || 0;
	this.b = b || 0;
	this.alpha = alpha;
}

Color.prototype.copyFrom = function(color) {
	this.r = color.r;
	this.g = color.g;
	this.b = color.b;
	this.alpha = color.alpha;
};

Color.prototype.copyFromRawData = function(data) {
	this.r = data._r;
	this.g = data._g;
	this.b = data._b;
	this.alpha = data._alpha;
};

Color.prototype.add = function(color) {
	this.r += color.r;
	this.g += color.g;
	this.b += color.b;
	this.alpha += color.alpha;
};

Color.prototype.set = function(r, g, b, a) {
	this.r = r || 0;
	this.g = g || 0;
	this.b = b || 0;
	this.alpha = a;
};

Object.defineProperty(Color.prototype, "hex", {
	get: function() {
		var hex = this.r << 16;
		hex = hex | this.g << 8;
		hex = hex | this.b;
		return hex;
	},
	set: function(value) {
		this.r = (value & 0xFF0000) >> 16;
		this.g = (value & 0xFF00) >> 8;
		this.b = (value & 0xFF);
	}
});

Object.defineProperty(Color.prototype, "r", {
	get: function() {
		return this._r;
	},
	set: function(value) {
		this._r = MathUtil.clamp(value, 0, 255);
	}
});

Object.defineProperty(Color.prototype, "g", {
	get: function() {
		return this._g;
	},
	set: function(value) {
		this._g = MathUtil.clamp(value, 0, 255);
	}
});

Object.defineProperty(Color.prototype, "b", {
	get: function() {
		return this._b;
	},
	set: function(value) {
		this._b = MathUtil.clamp(value, 0, 255);
	}
});

Object.defineProperty(Color.prototype, "alpha", {
	get: function() {
		return this._alpha;
	},
	set: function(value) {
		value = (value === undefined) ? 1 : value;
		this._alpha = MathUtil.clamp(value, 0, 1);
	}
});

module.exports = Color;
},{"./Math.js":28}],27:[function(require,module,exports){
function List() {
	this.first = null;
	this.length = 0;
}

List.prototype.isEmpty = function() {
	return this.first === null;
};

List.prototype.add = function(item) {
	item.prev = null;
	item.next = null;
	if (this.first) {
		this.first.prev = item;
	}

	item.next = this.first;
	this.first = item;
	this.length++;
	return item;
};

List.prototype.forEach = function(callback) {
	var current = this.first;
	var next = null;
	while (current) {
		next = current.next;
		callback(current);
		current = next;
	}
};

List.prototype.remove = function(item) {
	var previous = item.prev;
	var next = item.next;

	if (previous)
		previous.next = next;

	if (next)
		next.prev = previous;

	if (this.first === item)
		this.first = item.next;

	item.prev = null;
	item.next = null;
	this.length--;
};

module.exports = List;

},{}],28:[function(require,module,exports){
module.exports = {
	EPSILON: 2.220446049250313e-16,

	clamp: function(value, min, max) {
		return Math.max(min, Math.min(value, max));
	},

	degreesToRadians: function(degrees) {
		return degrees * Math.PI / 180.0;
	}
};
},{}],29:[function(require,module,exports){

function Point(x, y) {
	this.x = x || 0;
	this.y = y || 0;
}

Point.prototype.set = function(x, y) {
	this.x = x;
	this.y = y === undefined ? this.y : y;
	return this;
};

Point.prototype.copyFrom = function(point) {
	this.x = point.x;
	this.y = point.y;
	return this;
};


Point.prototype.copyFromRawData = function(data) {
	this.copyFrom(data);
};

Point.prototype.multiplayByScalar = function(scalar) {
	this.x *= scalar;
	this.y *= scalar;
	return this;
};

Point.prototype.add = function(point) {
	this.x += point.x;
	this.y += point.y;
	return this;
};

module.exports = Point;
},{}],30:[function(require,module,exports){
var MersenneTwister = require("MersenneTwister");

Random.marsenneTwister = new MersenneTwister();
function Random() {
}

Random.get = function() {
	return Random.uniform(0.0, 1.0);
};

Random.uniform = function(min, max) {
	return Random.marsenneTwister.genrand_real1() * (max - min) + min; // jshint ignore:line
};

module.exports = Random;

},{"MersenneTwister":2}],31:[function(require,module,exports){
module.exports = {
	Color: require("./Color.js"),
	Point: require("./Point.js"),
	List: require("./List.js"),
	Math: require("./Math.js"),
	Random: require("./Random.js"),
	inherit: require("./inherit.js")
};
},{"./Color.js":26,"./List.js":27,"./Math.js":28,"./Point.js":29,"./Random.js":30,"./inherit.js":32}],32:[function(require,module,exports){
module.exports = function(childClass, baseClass) {
	childClass.prototype = Object.create(baseClass.prototype);
	childClass.prototype.constructor = childClass;
};
},{}],33:[function(require,module,exports){

// References:
// https://github.com/sindresorhus/object-assign
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign

if (!Object.assign)
{
	Object.assign = require("object-assign");
}
},{"object-assign":4}],34:[function(require,module,exports){
require("./Object.assign");
require("./performance.js");
},{"./Object.assign":33,"./performance.js":35}],35:[function(require,module,exports){
(function (global){
// Date.now
if (!(Date.now && Date.prototype.getTime)) {
	Date.now = function now() {
		return new Date().getTime();
	};
}

// performance.now
if (!(global.performance && global.performance.now)) {
	var startTime = Date.now();
	if (!global.performance) {
		global.performance = {};
	}
	global.performance.now = function () {
		return Date.now() - startTime;
	};
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],36:[function(require,module,exports){
function Cache() {
	this.data = {};
}

Cache.prototype.add = function(name, config) {
	this.data[name] = config;
};

Cache.prototype.get = function(name) {
	if (!this.has(name)) {
		throw new Error("\"" + name + "\" config doesn't exist in cache");
	}

	return this.data[name];
};

Cache.prototype.has = function(name) {
	return !!this.data[name];
};

module.exports = Cache;
},{}],37:[function(require,module,exports){
function Renderer(emitter, texture) {
	PIXI.Container.call(this);

	this.emitter = emitter;
	this.sprites = {};
	this.unusedSprites = [];
	this.texture = texture;

	this.currentTime = 0;
	this.lastTime = 0;

	emitter.on("emitter/create", this.onCreate, this);
	emitter.on("emitter/update", this.onUpdate, this);
	emitter.on("emitter/remove", this.onRemove, this);
	emitter.on("emitter/play", this.onPlay, this);
}

Renderer.prototype = Object.create(PIXI.Container.prototype);
Renderer.prototype.constructor = Renderer;

Renderer.prototype.updateTransform = function() {
	this.currentTime = performance.now();

	if (this.lastTime === 0) {
		this.lastTime = this.currentTime;
	}

	this.emitter.update((this.currentTime - this.lastTime) / 1000);
	PIXI.Container.prototype.updateTransform.call(this);

	this.lastTime = this.currentTime;
};

Renderer.prototype.onPlay = function() {
	this.currentTime = 0;
	this.lastTime = 0;
};

Renderer.prototype.onCreate = function(particle) {
	var sprite = this.getOrCreateSprite();
	sprite.visible = true;
	if (this.blendMode) {
		sprite.blendMode = this.blendMode;
	}
	particle.sprite = sprite;
};

Renderer.prototype.getOrCreateSprite = function() {
	if (this.unusedSprites.length > 0) {
		return this.unusedSprites.pop();
	}

	var sprite = new PIXI.Sprite(this.texture);
	sprite.anchor.set(0.5, 0.5);
	return this.addChild(sprite);
};

Renderer.prototype.onUpdate = function(particle) {
	var sprite = particle.sprite;

	sprite.x = particle.position.x;
	sprite.y = particle.position.y;

	sprite.scale.x = particle.size.x;
	sprite.scale.y = particle.size.y;

	sprite.tint = particle.color.hex;
	sprite.alpha = particle.color.alpha;
	sprite.rotation = particle.angle;
};

Renderer.prototype.onRemove = function(particle) {
	var sprite = particle.sprite;
	particle.sprite = null;
	sprite.visible = false;
	this.unusedSprites.push(sprite);
};

Object.defineProperty(Renderer.prototype, "texture", {
	get: function() {
		return this._texture;
	},
	set: function(value) {
		this._texture = value;
		this.updateTexture();
	}
});

Renderer.prototype.updateTexture = function() {
	for (var i = 0; i < this.unusedSprites.length; ++i) {
		this.unusedSprites[i].texture = this.texture;
	}

	for (i = 0; i < this.children.length; ++i) {
		this.children[i].texture = this.texture;
	}
};

Renderer.prototype.playEmitter = function() {
	this.emitter.play();
};

Renderer.prototype.stopEmitter = function() {
	this.emitter.stop();
};

Renderer.prototype.resetEmitter = function() {
	this.emitter.reset();
};

Renderer.prototype.getEmitterBehaviourByName = function(name) {
	return this.emitter.behaviours.getByName(name);

};

module.exports = Renderer;
},{}]},{},[1])(1)
});


//# sourceMappingURL=jupiter_pixi.js.map