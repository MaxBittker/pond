/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _world = __webpack_require__(1);

	var _world2 = _interopRequireDefault(_world);

	var _creature = __webpack_require__(10);

	var _creature2 = _interopRequireDefault(_creature);

	var _food = __webpack_require__(11);

	var _food2 = _interopRequireDefault(_food);

	var _vector = __webpack_require__(2);

	var _vector2 = _interopRequireDefault(_vector);

	var _genetics = __webpack_require__(12);

	var _render = __webpack_require__(13);

	var _ui = __webpack_require__(16);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var start = null;
	var UI = new _ui.ui();

	var c = document.getElementById("canvas");
	var ctx = c.getContext("2d");

	var _ctx$canvas = ctx.canvas;
	var width = _ctx$canvas.width;
	var height = _ctx$canvas.height;


	var t = 1;
	var population = 50;
	var creatures = [];
	var foods = [];
	c.onmousedown = function (e) {
	  var p = new _vector2.default(e.offsetX, e.offsetY);
	  for (var i = 0; i < 8; i++) {
	    foods.push(new _food2.default(p.copy().mul(0.95).add(randomLoc().mul(0.05)))); //.sub(randomLoc().mul(0.024))))
	  }
	  e.preventDefault();
	};

	var foodMap = new _world2.default(width, height, 50);
	var creatureMap = new _world2.default(width, height, 50);

	var randomLoc = function randomLoc() {
	  return new _vector2.default((0.04 + 0.92 * Math.random()) * width, (0.04 + 0.92 * Math.random()) * height);
	};
	var genFood = function genFood() {
	  return new _food2.default(randomLoc());
	};

	var everyNFrames = function everyNFrames(n, callback) {
	  if (t % n === 0) {
	    callback();
	  }
	};

	var updateMap = function updateMap(emap, entityArray) {
	  emap.initializeMap();
	  emap.buildMap(entityArray);
	};

	for (var i = 0; i < 100; i += 1) {
	  creatures.push(new _creature2.default(randomLoc()));
	}
	var gTime = 3000;
	var deadFramesN = 0;
	var lastGeneration = t;
	var snapshots = [];

	var newGeneration = function newGeneration(eBounds) {
	  deadFramesN = 0;
	  lastGeneration = t;

	  var g = t / gTime | 0;
	  UI.incGeneration();
	  console.log("generation: " + g + " f: " + eBounds.max / (eBounds.min + 0.1));
	  creatures = (0, _genetics.nBest)(creatures, population / 3 | 0);
	  // console.log(creatures[0].getGenome())
	  creatures = creatures.concat((0, _genetics.buildGeneration)(creatures, randomLoc, UI.mutationRate, snapshots));
	  creatures = creatures.map(function (c) {
	    c.energy = 0;c.p = new _vector2.default(width / 2, height / 2);return c;
	  });
	  snapshots = [];
	};
	var step = function step() {

	  while (foods.length < 350) {
	    foods.push(genFood());
	  }
	  var foodRespawn = Math.random() > 0.85;
	  foods[Math.random() * foods.length | 0].marked = foodRespawn;
	  updateMap(foodMap, foods);
	  updateMap(creatureMap, creatures);

	  var eBounds = (0, _genetics.energyBounds)(creatures);

	  if (UI.shouldNG() || deadFramesN > 200 || t - lastGeneration > gTime) {
	    newGeneration(eBounds);
	  }
	  creatures.forEach(function (c, i) {
	    var fBin = foodMap.getNeighbors(c.p);
	    var cBin = creatureMap.getNeighbors(c.p);

	    if (snapshots.length < 2500 && t % 50 === 25) {
	      snapshots.push(c.getInputs({ fBin: fBin, cBin: cBin }, { x: width, y: height }));
	    }

	    c.tick({ x: width, y: height }, { fBin: fBin, cBin: cBin }, UI.speed > 1 ? 2 : 1);
	  });
	  var foodsNum = foods.length;
	  foods = foods.filter(function (f) {
	    return !f.marked;
	  });
	  if (foodsNum - foods.length < (foodRespawn ? 2 : 1)) {
	    deadFramesN++;
	    // console.log(deadFramesN)
	  } else {
	      deadFramesN = 0;
	    }
	  everyNFrames(UI.speed, function () {
	    (0, _render.render)(ctx, creatures, foods, foodMap, eBounds);
	  });
	};

	var frame = function frame(timestamp) {
	  if (!start) start = timestamp;
	  var progress = timestamp - start;
	  for (var s = 0; s < UI.speed; s++) {
	    step();
	    t++;
	  }
	  window.requestAnimationFrame(frame);
	};

	window.requestAnimationFrame(frame);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.World = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _vector = __webpack_require__(2);

	var _vector2 = _interopRequireDefault(_vector);

	var _synaptic = __webpack_require__(3);

	var _synaptic2 = _interopRequireDefault(_synaptic);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var World = function () {
	  function World(width, height, tileSize) {
	    _classCallCheck(this, World);

	    this.worldsize = new _vector2.default(width, height);
	    this.tileSize = tileSize;
	    this.maxTiles = new _vector2.default(this.worldsize.x / tileSize | 0, this.worldsize.y / tileSize | 0);
	    this.tiles = this.initializeMap();
	  }

	  _createClass(World, [{
	    key: 'initializeMap',
	    value: function initializeMap() {
	      this.tiles = new Array(this.maxTiles.x);
	      for (var x = 0; x < this.maxTiles.x; x += 1) {
	        this.tiles[x] = new Array(this.maxTiles.y);
	      }
	    }
	  }, {
	    key: 'hashLoc',
	    value: function hashLoc(p) {
	      var hx = p.x / this.tileSize | 0;
	      var hy = p.y / this.tileSize | 0;
	      return new _vector2.default(hx, hy);
	    }
	  }, {
	    key: 'getBin',
	    value: function getBin(p, prehashed) {
	      var hp = this.hashLoc(p);
	      if (prehashed === true) {
	        hp = p;
	      }
	      var bin = this.tiles[hp.x][hp.y];
	      if (bin !== undefined) return bin;
	      return [];
	    }
	  }, {
	    key: 'getNeighbors',
	    value: function getNeighbors(p) {
	      var hp = this.hashLoc(p);
	      var neighbors = [];
	      for (var dx = -1; dx <= 1; dx++) {
	        for (var dy = -1; dy <= 1; dy++) {
	          var np = hp.copy().add(new _vector2.default(dx, dy)).wrap(this.maxTiles);
	          var nBin = this.getBin(np, true);
	          neighbors = neighbors.concat(nBin);
	        }
	      }
	      return neighbors;
	    }
	  }, {
	    key: 'buildMap',
	    value: function buildMap(entities) {
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = entities[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var e = _step.value;

	          var hp = this.hashLoc(e.p);
	          if (this.tiles[hp.x][hp.y] === undefined) this.tiles[hp.x][hp.y] = [e];else this.tiles[hp.x][hp.y].push(e);
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	    }
	  }]);

	  return World;
	}();

	exports.World = World;
	exports.default = World;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	/*https://github.com/cazala/synaptic/blob/gh-pages/scripts/homepage/vector.js */

	function Vector(x, y) {
		this.x = x;
		this.y = y;
	}

	Vector.prototype = {
		set: function set(x, y) {
			this.x = x;
			this.y = y;

			return this;
		},
		add: function add(v) {
			this.x += v.x;
			this.y += v.y;

			return this;
		},
		sub: function sub(v) {
			this.x -= v.x;
			this.y -= v.y;

			return this;
		},
		mul: function mul(s) {
			this.x *= s;
			this.y *= s;

			return this;
		},
		div: function div(s) {
			!s && console.log("Division by zero!");

			this.x /= s;
			this.y /= s;

			return this;
		},
		mag: function mag() {
			return Math.sqrt(this.x * this.x + this.y * this.y);
		},
		normalize: function normalize() {
			var mag = this.mag();
			mag && this.div(mag);
			return this;
		},
		angle: function angle() {
			return Math.atan2(this.y, this.x);
		},
		setMag: function setMag(m) {
			var angle = this.angle();
			this.x = m * Math.cos(angle);
			this.y = m * Math.sin(angle);
			return this;
		},
		setAngle: function setAngle(a) {
			var mag = this.mag();
			this.x = mag * Math.cos(a);
			this.y = mag * Math.sin(a);
			return this;
		},
		rotate: function rotate(a) {
			this.setAngle(this.angle() + a);
			return this;
		},
		limit: function limit(l) {
			var mag = this.mag();
			if (mag > l) this.setMag(l);
			return this;
		},
		angleBetween: function angleBetween(v) {
			return this.angle() - v.angle();
		},
		dot: function dot(v) {
			return this.x * v.x + this.y * v.y;
		},
		lerp: function lerp(v, amt) {
			this.x += (v.x - this.x) * amt;
			this.y += (v.y - this.y) * amt;
			return this;
		},
		wrap: function wrap(_ref) {
			var x = _ref.x;
			var y = _ref.y;

			var wr = function wr(d, l) {
				return (d + l) % l;
			};
			this.set(wr(this.x, x), wr(this.y, y));
			return this;
		},
		dist: function dist(v) {
			var dx = this.x - v.x;
			var dy = this.y - v.y;
			return Math.sqrt(dx * dx + dy * dy);
		},
		copy: function copy() {
			return new Vector(this.x, this.y);
		},
		random: function random() {
			this.set(1, 1);
			this.setAngle(Math.random() * Math.PI * 2);
			return this;
		}
	};

	exports.default = Vector;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*

	The MIT License (MIT)

	Copyright (c) 2014 Juan Cazala - juancazala.com

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE



	********************************************************************************************
	                                         SYNAPTIC
	********************************************************************************************

	Synaptic is a javascript neural network library for node.js and the browser, its generalized
	algorithm is architecture-free, so you can build and train basically any type of first order
	or even second order neural network architectures.

	http://en.wikipedia.org/wiki/Recurrent_neural_network#Second_Order_Recurrent_Neural_Network

	The library includes a few built-in architectures like multilayer perceptrons, multilayer
	long-short term memory networks (LSTM) or liquid state machines, and a trainer capable of
	training any given network, and includes built-in training tasks/tests like solving an XOR,
	passing a Distracted Sequence Recall test or an Embeded Reber Grammar test.

	The algorithm implemented by this library has been taken from Derek D. Monner's paper:

	A generalized LSTM-like training algorithm for second-order recurrent neural networks
	http://www.overcomplete.net/papers/nn2012.pdf

	There are references to the equations in that paper commented through the source code.


	********************************************************************************************/

	var Synaptic = {
	    Neuron: __webpack_require__(4),
	    Layer: __webpack_require__(6),
	    Network: __webpack_require__(7),
	    Trainer: __webpack_require__(8),
	    Architect: __webpack_require__(9)
	};

	// CommonJS & AMD
	if (true)
	{
	  !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function(){ return Synaptic }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}

	// Node.js
	if (typeof module !== 'undefined' && module.exports)
	{
	  module.exports = Synaptic;
	}

	// Browser
	if (typeof window == 'object')
	{
	  (function(){ 
	    var oldSynaptic = window['synaptic'];
	    Synaptic.ninja = function(){ 
	      window['synaptic'] = oldSynaptic; 
	      return Synaptic;
	    };	
	  })();

	  window['synaptic'] = Synaptic;
	}


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {// export
	if (module) module.exports = Neuron;

	/******************************************************************************************
	                                         NEURON
	*******************************************************************************************/

	function Neuron() {
	  this.ID = Neuron.uid();
	  this.label = null;
	  this.connections = {
	    inputs: {},
	    projected: {},
	    gated: {}
	  };
	  this.error = {
	    responsibility: 0,
	    projected: 0,
	    gated: 0
	  };
	  this.trace = {
	    elegibility: {},
	    extended: {},
	    influences: {}
	  };
	  this.state = 0;
	  this.old = 0;
	  this.activation = 0;
	  this.selfconnection = new Neuron.connection(this, this, 0); // weight = 0 -> not connected
	  this.squash = Neuron.squash.LOGISTIC;
	  this.neighboors = {};
	  this.bias = Math.random() * 2.0 - 1.0;
	}

	Neuron.prototype = {

	  // activate the neuron
	  activate: function(input) {
	    // activation from enviroment (for input neurons)
	    if (typeof input != 'undefined') {
	      this.activation = input;
	      this.derivative = 0;
	      this.bias = 0;
	      return this.activation;
	    }

	    // old state
	    this.old = this.state;

	    // eq. 15
	    this.state = this.selfconnection.gain * this.selfconnection.weight *
	      this.state + this.bias;

	    for (var i in this.connections.inputs) {
	      var input = this.connections.inputs[i];
	      this.state += input.from.activation * input.weight * input.gain;
	    }

	    // eq. 16
	    this.activation = this.squash(this.state);

	    // f'(s)
	    this.derivative = this.squash(this.state, true);

	    // update traces
	    var influences = [];
	    for (var id in this.trace.extended) {
	      // extended elegibility trace
	      var xtrace = this.trace.extended[id];
	      var neuron = this.neighboors[id];

	      // if gated neuron's selfconnection is gated by this unit, the influence keeps track of the neuron's old state
	      var influence = neuron.selfconnection.gater == this ? neuron.old : 0;

	      // index runs over all the incoming connections to the gated neuron that are gated by this unit
	      for (var incoming in this.trace.influences[neuron.ID]) { // captures the effect that has an input connection to this unit, on a neuron that is gated by this unit
	        influence += this.trace.influences[neuron.ID][incoming].weight *
	          this.trace.influences[neuron.ID][incoming].from.activation;
	      }
	      influences[neuron.ID] = influence;
	    }

	    for (var i in this.connections.inputs) {
	      var input = this.connections.inputs[i];

	      // elegibility trace - Eq. 17
	      this.trace.elegibility[input.ID] = this.selfconnection.gain * this.selfconnection
	        .weight * this.trace.elegibility[input.ID] + input.gain * input.from
	        .activation;

	      for (var id in this.trace.extended) {
	        // extended elegibility trace
	        var xtrace = this.trace.extended[id];
	        var neuron = this.neighboors[id];
	        var influence = influences[neuron.ID];

	        // eq. 18
	        xtrace[input.ID] = neuron.selfconnection.gain * neuron.selfconnection
	          .weight * xtrace[input.ID] + this.derivative * this.trace.elegibility[
	            input.ID] * influence;
	      }
	    }

	    //  update gated connection's gains
	    for (var connection in this.connections.gated) {
	      this.connections.gated[connection].gain = this.activation;
	    }

	    return this.activation;
	  },

	  // back-propagate the error
	  propagate: function(rate, target) {
	    // error accumulator
	    var error = 0;

	    // whether or not this neuron is in the output layer
	    var isOutput = typeof target != 'undefined';

	    // output neurons get their error from the enviroment
	    if (isOutput)
	      this.error.responsibility = this.error.projected = target - this.activation; // Eq. 10

	    else // the rest of the neuron compute their error responsibilities by backpropagation
	    {
	      // error responsibilities from all the connections projected from this neuron
	      for (var id in this.connections.projected) {
	        var connection = this.connections.projected[id];
	        var neuron = connection.to;
	        // Eq. 21
	        error += neuron.error.responsibility * connection.gain * connection.weight;
	      }

	      // projected error responsibility
	      this.error.projected = this.derivative * error;

	      error = 0;
	      // error responsibilities from all the connections gated by this neuron
	      for (var id in this.trace.extended) {
	        var neuron = this.neighboors[id]; // gated neuron
	        var influence = neuron.selfconnection.gater == this ? neuron.old : 0; // if gated neuron's selfconnection is gated by this neuron

	        // index runs over all the connections to the gated neuron that are gated by this neuron
	        for (var input in this.trace.influences[id]) { // captures the effect that the input connection of this neuron have, on a neuron which its input/s is/are gated by this neuron
	          influence += this.trace.influences[id][input].weight * this.trace.influences[
	            neuron.ID][input].from.activation;
	        }
	        // eq. 22
	        error += neuron.error.responsibility * influence;
	      }

	      // gated error responsibility
	      this.error.gated = this.derivative * error;

	      // error responsibility - Eq. 23
	      this.error.responsibility = this.error.projected + this.error.gated;
	    }

	    // learning rate
	    rate = rate || .1;

	    // adjust all the neuron's incoming connections
	    for (var id in this.connections.inputs) {
	      var input = this.connections.inputs[id];

	      // Eq. 24
	      var gradient = this.error.projected * this.trace.elegibility[input.ID];
	      for (var id in this.trace.extended) {
	        var neuron = this.neighboors[id];
	        gradient += neuron.error.responsibility * this.trace.extended[
	          neuron.ID][input.ID];
	      }
	      input.weight += rate * gradient; // adjust weights - aka learn
	    }

	    // adjust bias
	    this.bias += rate * this.error.responsibility;
	  },

	  project: function(neuron, weight) {
	    // self-connection
	    if (neuron == this) {
	      this.selfconnection.weight = 1;
	      return this.selfconnection;
	    }

	    // check if connection already exists
	    var connected = this.connected(neuron);
	    if (connected && connected.type == "projected") {
	      // update connection
	      if (typeof weight != 'undefined')
	        connected.connection.weight = weight;
	      // return existing connection
	      return connected.connection;
	    } else {
	      // create a new connection
	      var connection = new Neuron.connection(this, neuron, weight);
	    }

	    // reference all the connections and traces
	    this.connections.projected[connection.ID] = connection;
	    this.neighboors[neuron.ID] = neuron;
	    neuron.connections.inputs[connection.ID] = connection;
	    neuron.trace.elegibility[connection.ID] = 0;

	    for (var id in neuron.trace.extended) {
	      var trace = neuron.trace.extended[id];
	      trace[connection.ID] = 0;
	    }

	    return connection;
	  },

	  gate: function(connection) {
	    // add connection to gated list
	    this.connections.gated[connection.ID] = connection;

	    var neuron = connection.to;
	    if (!(neuron.ID in this.trace.extended)) {
	      // extended trace
	      this.neighboors[neuron.ID] = neuron;
	      var xtrace = this.trace.extended[neuron.ID] = {};
	      for (var id in this.connections.inputs) {
	        var input = this.connections.inputs[id];
	        xtrace[input.ID] = 0;
	      }
	    }

	    // keep track
	    if (neuron.ID in this.trace.influences)
	      this.trace.influences[neuron.ID].push(connection);
	    else
	      this.trace.influences[neuron.ID] = [connection];

	    // set gater
	    connection.gater = this;
	  },

	  // returns true or false whether the neuron is self-connected or not
	  selfconnected: function() {
	    return this.selfconnection.weight !== 0;
	  },

	  // returns true or false whether the neuron is connected to another neuron (parameter)
	  connected: function(neuron) {
	    var result = {
	      type: null,
	      connection: false
	    };

	    if (this == neuron) {
	      if (this.selfconnected()) {
	        result.type = 'selfconnection';
	        result.connection = this.selfconnection;
	        return result;
	      } else
	        return false;
	    }

	    for (var type in this.connections) {
	      for (var connection in this.connections[type]) {
	        var connection = this.connections[type][connection];
	        if (connection.to == neuron) {
	          result.type = type;
	          result.connection = connection;
	          return result;
	        } else if (connection.from == neuron) {
	          result.type = type;
	          result.connection = connection;
	          return result;
	        }
	      }
	    }

	    return false;
	  },

	  // clears all the traces (the neuron forgets it's context, but the connections remain intact)
	  clear: function() {

	    for (var trace in this.trace.elegibility)
	      this.trace.elegibility[trace] = 0;

	    for (var trace in this.trace.extended)
	      for (var extended in this.trace.extended[trace])
	        this.trace.extended[trace][extended] = 0;

	    this.error.responsibility = this.error.projected = this.error.gated = 0;
	  },

	  // all the connections are randomized and the traces are cleared
	  reset: function() {
	    this.clear();

	    for (var type in this.connections)
	      for (var connection in this.connections[type])
	        this.connections[type][connection].weight = Math.random() * 2.0 - 1.0;
	    this.bias = Math.random() * 2.0 - 1.0;

	    this.old = this.state = this.activation = 0;
	  },

	  // hardcodes the behaviour of the neuron into an optimized function
	  optimize: function(optimized, layer) {

	    optimized = optimized || {};
	    var that = this;
	    var store_activation = [];
	    var store_trace = [];
	    var store_propagation = [];
	    var varID = optimized.memory || 0;
	    var neurons = optimized.neurons || 1;
	    var inputs = optimized.inputs || [];
	    var targets = optimized.targets || [];
	    var outputs = optimized.outputs || [];
	    var variables = optimized.variables || {};
	    var activation_sentences = optimized.activation_sentences || [];
	    var trace_sentences = optimized.trace_sentences || [];
	    var propagation_sentences = optimized.propagation_sentences || [];
	    var layers = optimized.layers || { __count: 0, __neuron: 0 };

	    // allocate sentences
	    var allocate = function(store){
	      var allocated = layer in layers && store[layers.__count];
	      if (!allocated)
	      {
	        layers.__count = store.push([]) - 1;
	        layers[layer] = layers.__count;
	      }
	    }
	    allocate(activation_sentences);
	    allocate(trace_sentences);
	    allocate(propagation_sentences);
	    var currentLayer = layers.__count;

	    // get/reserve space in memory by creating a unique ID for a variablel
	    var getVar = function() {
	      var args = Array.prototype.slice.call(arguments);

	      if (args.length == 1) {
	        if (args[0] == 'target') {
	          var id = 'target_' + targets.length;
	          targets.push(varID);
	        } else
	          var id = args[0];
	        if (id in variables)
	          return variables[id];
	        return variables[id] = {
	          value: 0,
	          id: varID++
	        };
	      } else {
	        var extended = args.length > 2;
	        if (extended)
	          var value = args.pop();

	        var unit = args.shift();
	        var prop = args.pop();

	        if (!extended)
	          var value = unit[prop];

	        var id = prop + '_';
	        for (var property in args)
	          id += args[property] + '_';
	        id += unit.ID;
	        if (id in variables)
	          return variables[id];

	        return variables[id] = {
	          value: value,
	          id: varID++
	        };
	      }
	    };

	    // build sentence
	    var buildSentence = function() {
	      var args = Array.prototype.slice.call(arguments);
	      var store = args.pop();
	      var sentence = "";
	      for (var i in args)
	        if (typeof args[i] == 'string')
	          sentence += args[i];
	        else
	          sentence += 'F[' + args[i].id + ']';

	      store.push(sentence + ';');
	    }

	    // helper to check if an object is empty
	    var isEmpty = function(obj) {
	      for (var prop in obj) {
	        if (obj.hasOwnProperty(prop))
	          return false;
	      }
	      return true;
	    };

	    // characteristics of the neuron
	    var noProjections = isEmpty(this.connections.projected);
	    var noGates = isEmpty(this.connections.gated);
	    var isInput = layer == 'input' ? true : isEmpty(this.connections.inputs);
	    var isOutput = layer == 'output' ? true : noProjections && noGates;

	    // optimize neuron's behaviour
	    var rate = getVar('rate');
	    var activation = getVar(this, 'activation');
	    if (isInput)
	      inputs.push(activation.id);
	    else {
	      activation_sentences[currentLayer].push(store_activation);
	      trace_sentences[currentLayer].push(store_trace);
	      propagation_sentences[currentLayer].push(store_propagation);
	      var old = getVar(this, 'old');
	      var state = getVar(this, 'state');
	      var bias = getVar(this, 'bias');
	      if (this.selfconnection.gater)
	        var self_gain = getVar(this.selfconnection, 'gain');
	      if (this.selfconnected())
	        var self_weight = getVar(this.selfconnection, 'weight');
	      buildSentence(old, ' = ', state, store_activation);
	      if (this.selfconnected())
	        if (this.selfconnection.gater)
	          buildSentence(state, ' = ', self_gain, ' * ', self_weight, ' * ',
	            state, ' + ', bias, store_activation);
	        else
	          buildSentence(state, ' = ', self_weight, ' * ', state, ' + ',
	            bias, store_activation);
	      else
	        buildSentence(state, ' = ', bias, store_activation);
	      for (var i in this.connections.inputs) {
	        var input = this.connections.inputs[i];
	        var input_activation = getVar(input.from, 'activation');
	        var input_weight = getVar(input, 'weight');
	        if (input.gater)
	          var input_gain = getVar(input, 'gain');
	        if (this.connections.inputs[i].gater)
	          buildSentence(state, ' += ', input_activation, ' * ',
	            input_weight, ' * ', input_gain, store_activation);
	        else
	          buildSentence(state, ' += ', input_activation, ' * ',
	            input_weight, store_activation);
	      }
	      var derivative = getVar(this, 'derivative');
	      switch (this.squash) {
	        case Neuron.squash.LOGISTIC:
	          buildSentence(activation, ' = (1 / (1 + Math.exp(-', state, ')))',
	            store_activation);
	          buildSentence(derivative, ' = ', activation, ' * (1 - ',
	            activation, ')', store_activation);
	          break;
	        case Neuron.squash.TANH:
	          var eP = getVar('aux');
	          var eN = getVar('aux_2');
	          buildSentence(eP, ' = Math.exp(', state, ')', store_activation);
	          buildSentence(eN, ' = 1 / ', eP, store_activation);
	          buildSentence(activation, ' = (', eP, ' - ', eN, ') / (', eP, ' + ', eN, ')', store_activation);
	          buildSentence(derivative, ' = 1 - (', activation, ' * ', activation, ')', store_activation);
	          break;
	        case Neuron.squash.IDENTITY:
	          buildSentence(activation, ' = ', state, store_activation);
	          buildSentence(derivative, ' = 1', store_activation);
	          break;
	        case Neuron.squash.HLIM:
	          buildSentence(activation, ' = +(', state, ' > 0)', store_activation);
	          buildSentence(derivative, ' = 1', store_activation);
	        case Neuron.squash.RELU:
	          buildSentence(activation, ' = ', state, ' > 0 ? ', state, ' : 0', store_activation);
	          buildSentence(derivative, ' = ', state, ' > 0 ? 1 : 0', store_activation);
	          break;
	      }

	      for (var id in this.trace.extended) {
	        // calculate extended elegibility traces in advance

	        var xtrace = this.trace.extended[id];
	        var neuron = this.neighboors[id];
	        var influence = getVar('influences[' + neuron.ID + ']');
	        var neuron_old = getVar(neuron, 'old');
	        var initialized = false;
	        if (neuron.selfconnection.gater == this)
	        {
	          buildSentence(influence, ' = ', neuron_old, store_trace);
	          initialized = true;
	        }
	        for (var incoming in this.trace.influences[neuron.ID]) {
	          var incoming_weight = getVar(this.trace.influences[neuron.ID]
	            [incoming], 'weight');
	          var incoming_activation = getVar(this.trace.influences[neuron.ID]
	            [incoming].from, 'activation');

	          if (initialized)
	            buildSentence(influence, ' += ', incoming_weight, ' * ', incoming_activation, store_trace);
	          else {
	            buildSentence(influence, ' = ', incoming_weight, ' * ', incoming_activation, store_trace);
	            initialized = true;
	          }
	        }
	      }

	      for (var i in this.connections.inputs) {
	        var input = this.connections.inputs[i];
	        if (input.gater)
	          var input_gain = getVar(input, 'gain');
	        var input_activation = getVar(input.from, 'activation');
	        var trace = getVar(this, 'trace', 'elegibility', input.ID, this.trace
	          .elegibility[input.ID]);
	        if (this.selfconnected()) {
	          if (this.selfconnection.gater) {
	            if (input.gater)
	              buildSentence(trace, ' = ', self_gain, ' * ', self_weight,
	                ' * ', trace, ' + ', input_gain, ' * ', input_activation,
	                store_trace);
	            else
	              buildSentence(trace, ' = ', self_gain, ' * ', self_weight,
	                ' * ', trace, ' + ', input_activation, store_trace);
	          } else {
	            if (input.gater)
	              buildSentence(trace, ' = ', self_weight, ' * ', trace, ' + ',
	                input_gain, ' * ', input_activation, store_trace);
	            else
	              buildSentence(trace, ' = ', self_weight, ' * ', trace, ' + ',
	                input_activation, store_trace);
	          }
	        } else {
	          if (input.gater)
	            buildSentence(trace, ' = ', input_gain, ' * ', input_activation,
	              store_trace);
	          else
	            buildSentence(trace, ' = ', input_activation, store_trace);
	        }
	        for (var id in this.trace.extended) {
	          // extended elegibility trace
	          var xtrace = this.trace.extended[id];
	          var neuron = this.neighboors[id];
	          var influence = getVar('influences[' + neuron.ID + ']');
	          var neuron_old = getVar(neuron, 'old');

	          var trace = getVar(this, 'trace', 'elegibility', input.ID, this.trace
	            .elegibility[input.ID]);
	          var xtrace = getVar(this, 'trace', 'extended', neuron.ID, input.ID,
	            this.trace.extended[neuron.ID][input.ID]);
	          if (neuron.selfconnected())
	            var neuron_self_weight = getVar(neuron.selfconnection, 'weight');
	          if (neuron.selfconnection.gater)
	            var neuron_self_gain = getVar(neuron.selfconnection, 'gain');
	          if (neuron.selfconnected())
	            if (neuron.selfconnection.gater)
	              buildSentence(xtrace, ' = ', neuron_self_gain, ' * ',
	                neuron_self_weight, ' * ', xtrace, ' + ', derivative, ' * ',
	                trace, ' * ', influence, store_trace);
	            else
	              buildSentence(xtrace, ' = ', neuron_self_weight, ' * ',
	                xtrace, ' + ', derivative, ' * ', trace, ' * ',
	                influence, store_trace);
	          else
	            buildSentence(xtrace, ' = ', derivative, ' * ', trace, ' * ',
	              influence, store_trace);
	        }
	      }
	      for (var connection in this.connections.gated) {
	        var gated_gain = getVar(this.connections.gated[connection], 'gain');
	        buildSentence(gated_gain, ' = ', activation, store_activation);
	      }
	    }
	    if (!isInput) {
	      var responsibility = getVar(this, 'error', 'responsibility', this.error
	        .responsibility);
	      if (isOutput) {
	        var target = getVar('target');
	        buildSentence(responsibility, ' = ', target, ' - ', activation,
	          store_propagation);
	        for (var id in this.connections.inputs) {
	          var input = this.connections.inputs[id];
	          var trace = getVar(this, 'trace', 'elegibility', input.ID, this.trace
	            .elegibility[input.ID]);
	          var input_weight = getVar(input, 'weight');
	          buildSentence(input_weight, ' += ', rate, ' * (', responsibility,
	            ' * ', trace, ')', store_propagation);
	        }
	        outputs.push(activation.id);
	      } else {
	        if (!noProjections && !noGates) {
	          var error = getVar('aux');
	          for (var id in this.connections.projected) {
	            var connection = this.connections.projected[id];
	            var neuron = connection.to;
	            var connection_weight = getVar(connection, 'weight');
	            var neuron_responsibility = getVar(neuron, 'error',
	              'responsibility', neuron.error.responsibility);
	            if (connection.gater) {
	              var connection_gain = getVar(connection, 'gain');
	              buildSentence(error, ' += ', neuron_responsibility, ' * ',
	                connection_gain, ' * ', connection_weight,
	                store_propagation);
	            } else
	              buildSentence(error, ' += ', neuron_responsibility, ' * ',
	                connection_weight, store_propagation);
	          }
	          var projected = getVar(this, 'error', 'projected', this.error.projected);
	          buildSentence(projected, ' = ', derivative, ' * ', error,
	            store_propagation);
	          buildSentence(error, ' = 0', store_propagation);
	          for (var id in this.trace.extended) {
	            var neuron = this.neighboors[id];
	            var influence = getVar('aux_2');
	            var neuron_old = getVar(neuron, 'old');
	            if (neuron.selfconnection.gater == this)
	              buildSentence(influence, ' = ', neuron_old, store_propagation);
	            else
	              buildSentence(influence, ' = 0', store_propagation);
	            for (var input in this.trace.influences[neuron.ID]) {
	              var connection = this.trace.influences[neuron.ID][input];
	              var connection_weight = getVar(connection, 'weight');
	              var neuron_activation = getVar(connection.from, 'activation');
	              buildSentence(influence, ' += ', connection_weight, ' * ',
	                neuron_activation, store_propagation);
	            }
	            var neuron_responsibility = getVar(neuron, 'error',
	              'responsibility', neuron.error.responsibility);
	            buildSentence(error, ' += ', neuron_responsibility, ' * ',
	              influence, store_propagation);
	          }
	          var gated = getVar(this, 'error', 'gated', this.error.gated);
	          buildSentence(gated, ' = ', derivative, ' * ', error,
	            store_propagation);
	          buildSentence(responsibility, ' = ', projected, ' + ', gated,
	            store_propagation);
	          for (var id in this.connections.inputs) {
	            var input = this.connections.inputs[id];
	            var gradient = getVar('aux');
	            var trace = getVar(this, 'trace', 'elegibility', input.ID, this
	              .trace.elegibility[input.ID]);
	            buildSentence(gradient, ' = ', projected, ' * ', trace,
	              store_propagation);
	            for (var id in this.trace.extended) {
	              var neuron = this.neighboors[id];
	              var neuron_responsibility = getVar(neuron, 'error',
	                'responsibility', neuron.error.responsibility);
	              var xtrace = getVar(this, 'trace', 'extended', neuron.ID,
	                input.ID, this.trace.extended[neuron.ID][input.ID]);
	              buildSentence(gradient, ' += ', neuron_responsibility, ' * ',
	                xtrace, store_propagation);
	            }
	            var input_weight = getVar(input, 'weight');
	            buildSentence(input_weight, ' += ', rate, ' * ', gradient,
	              store_propagation);
	          }

	        } else if (noGates) {
	          buildSentence(responsibility, ' = 0', store_propagation);
	          for (var id in this.connections.projected) {
	            var connection = this.connections.projected[id];
	            var neuron = connection.to;
	            var connection_weight = getVar(connection, 'weight');
	            var neuron_responsibility = getVar(neuron, 'error',
	              'responsibility', neuron.error.responsibility);
	            if (connection.gater) {
	              var connection_gain = getVar(connection, 'gain');
	              buildSentence(responsibility, ' += ', neuron_responsibility,
	                ' * ', connection_gain, ' * ', connection_weight,
	                store_propagation);
	            } else
	              buildSentence(responsibility, ' += ', neuron_responsibility,
	                ' * ', connection_weight, store_propagation);
	          }
	          buildSentence(responsibility, ' *= ', derivative,
	            store_propagation);
	          for (var id in this.connections.inputs) {
	            var input = this.connections.inputs[id];
	            var trace = getVar(this, 'trace', 'elegibility', input.ID, this
	              .trace.elegibility[input.ID]);
	            var input_weight = getVar(input, 'weight');
	            buildSentence(input_weight, ' += ', rate, ' * (',
	              responsibility, ' * ', trace, ')', store_propagation);
	          }
	        } else if (noProjections) {
	          buildSentence(responsibility, ' = 0', store_propagation);
	          for (var id in this.trace.extended) {
	            var neuron = this.neighboors[id];
	            var influence = getVar('aux');
	            var neuron_old = getVar(neuron, 'old');
	            if (neuron.selfconnection.gater == this)
	              buildSentence(influence, ' = ', neuron_old, store_propagation);
	            else
	              buildSentence(influence, ' = 0', store_propagation);
	            for (var input in this.trace.influences[neuron.ID]) {
	              var connection = this.trace.influences[neuron.ID][input];
	              var connection_weight = getVar(connection, 'weight');
	              var neuron_activation = getVar(connection.from, 'activation');
	              buildSentence(influence, ' += ', connection_weight, ' * ',
	                neuron_activation, store_propagation);
	            }
	            var neuron_responsibility = getVar(neuron, 'error',
	              'responsibility', neuron.error.responsibility);
	            buildSentence(responsibility, ' += ', neuron_responsibility,
	              ' * ', influence, store_propagation);
	          }
	          buildSentence(responsibility, ' *= ', derivative,
	            store_propagation);
	          for (var id in this.connections.inputs) {
	            var input = this.connections.inputs[id];
	            var gradient = getVar('aux');
	            buildSentence(gradient, ' = 0', store_propagation);
	            for (var id in this.trace.extended) {
	              var neuron = this.neighboors[id];
	              var neuron_responsibility = getVar(neuron, 'error',
	                'responsibility', neuron.error.responsibility);
	              var xtrace = getVar(this, 'trace', 'extended', neuron.ID,
	                input.ID, this.trace.extended[neuron.ID][input.ID]);
	              buildSentence(gradient, ' += ', neuron_responsibility, ' * ',
	                xtrace, store_propagation);
	            }
	            var input_weight = getVar(input, 'weight');
	            buildSentence(input_weight, ' += ', rate, ' * ', gradient,
	              store_propagation);
	          }
	        }
	      }
	      buildSentence(bias, ' += ', rate, ' * ', responsibility,
	        store_propagation);
	    }
	    return {
	      memory: varID,
	      neurons: neurons + 1,
	      inputs: inputs,
	      outputs: outputs,
	      targets: targets,
	      variables: variables,
	      activation_sentences: activation_sentences,
	      trace_sentences: trace_sentences,
	      propagation_sentences: propagation_sentences,
	      layers: layers
	    }
	  }
	}


	// represents a connection between two neurons
	Neuron.connection = function Connection(from, to, weight) {

	  if (!from || !to)
	    throw new Error("Connection Error: Invalid neurons");

	  this.ID = Neuron.connection.uid();
	  this.from = from;
	  this.to = to;
	  this.weight = typeof weight == 'undefined' ? Math.random() * 2.0 - 1.0 :
	    weight;
	  this.gain = 1;
	  this.gater = null;
	}


	// squashing functions
	Neuron.squash = {};

	// eq. 5 & 5'
	Neuron.squash.LOGISTIC = function(x, derivate) {
	  if (!derivate)
	    return 1 / (1 + Math.exp(-x));
	  var fx = Neuron.squash.LOGISTIC(x);
	  return fx * (1 - fx);
	};
	Neuron.squash.TANH = function(x, derivate) {
	  if (derivate)
	    return 1 - Math.pow(Neuron.squash.TANH(x), 2);
	  var eP = Math.exp(x);
	  var eN = 1 / eP;
	  return (eP - eN) / (eP + eN);
	};
	Neuron.squash.IDENTITY = function(x, derivate) {
	  return derivate ? 1 : x;
	};
	Neuron.squash.HLIM = function(x, derivate) {
	  return derivate ? 1 : x > 0 ? 1 : 0;
	};
	Neuron.squash.RELU = function(x, derivate) {
	  if (derivate)
	    return x > 0 ? 1 : 0;
	  return x > 0 ? x : 0;
	};

	// unique ID's
	(function() {
	  var neurons = 0;
	  var connections = 0;
	  Neuron.uid = function() {
	    return neurons++;
	  }
	  Neuron.connection.uid = function() {
	    return connections++;
	  }
	  Neuron.quantity = function() {
	    return {
	      neurons: neurons,
	      connections: connections
	    }
	  }
	})();

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)(module)))

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {// export
	if (module) module.exports = Layer;

	// import
	var Neuron  = __webpack_require__(4)
	,   Network = __webpack_require__(7)

	/*******************************************************************************************
	                                            LAYER
	*******************************************************************************************/

	function Layer(size, label) {
	  this.size = size | 0;
	  this.list = [];
	  this.label = label || null;
	  this.connectedTo = [];

	  while (size--) {
	    var neuron = new Neuron();
	    this.list.push(neuron);
	  }
	}

	Layer.prototype = {

	  // activates all the neurons in the layer
	  activate: function(input) {

	    var activations = [];

	    if (typeof input != 'undefined') {
	      if (input.length != this.size)
	        throw new Error("INPUT size and LAYER size must be the same to activate!");

	      for (var id in this.list) {
	        var neuron = this.list[id];
	        var activation = neuron.activate(input[id]);
	        activations.push(activation);
	      }
	    } else {
	      for (var id in this.list) {
	        var neuron = this.list[id];
	        var activation = neuron.activate();
	        activations.push(activation);
	      }
	    }
	    return activations;
	  },

	  // propagates the error on all the neurons of the layer
	  propagate: function(rate, target) {

	    if (typeof target != 'undefined') {
	      if (target.length != this.size)
	        throw new Error("TARGET size and LAYER size must be the same to propagate!");

	      for (var id = this.list.length - 1; id >= 0; id--) {
	        var neuron = this.list[id];
	        neuron.propagate(rate, target[id]);
	      }
	    } else {
	      for (var id = this.list.length - 1; id >= 0; id--) {
	        var neuron = this.list[id];
	        neuron.propagate(rate);
	      }
	    }
	  },

	  // projects a connection from this layer to another one
	  project: function(layer, type, weights) {

	    if (layer instanceof Network)
	      layer = layer.layers.input;

	    if (layer instanceof Layer) {
	      if (!this.connected(layer))
	        return new Layer.connection(this, layer, type, weights);
	    } else
	      throw new Error("Invalid argument, you can only project connections to LAYERS and NETWORKS!");


	  },

	  // gates a connection betwenn two layers
	  gate: function(connection, type) {

	    if (type == Layer.gateType.INPUT) {
	      if (connection.to.size != this.size)
	        throw new Error("GATER layer and CONNECTION.TO layer must be the same size in order to gate!");

	      for (var id in connection.to.list) {
	        var neuron = connection.to.list[id];
	        var gater = this.list[id];
	        for (var input in neuron.connections.inputs) {
	          var gated = neuron.connections.inputs[input];
	          if (gated.ID in connection.connections)
	            gater.gate(gated);
	        }
	      }
	    } else if (type == Layer.gateType.OUTPUT) {
	      if (connection.from.size != this.size)
	        throw new Error("GATER layer and CONNECTION.FROM layer must be the same size in order to gate!");

	      for (var id in connection.from.list) {
	        var neuron = connection.from.list[id];
	        var gater = this.list[id];
	        for (var projected in neuron.connections.projected) {
	          var gated = neuron.connections.projected[projected];
	          if (gated.ID in connection.connections)
	            gater.gate(gated);
	        }
	      }
	    } else if (type == Layer.gateType.ONE_TO_ONE) {
	      if (connection.size != this.size)
	        throw new Error("The number of GATER UNITS must be the same as the number of CONNECTIONS to gate!");

	      for (var id in connection.list) {
	        var gater = this.list[id];
	        var gated = connection.list[id];
	        gater.gate(gated);
	      }
	    }
	    connection.gatedfrom.push({layer: this, type: type});
	  },

	  // true or false whether the whole layer is self-connected or not
	  selfconnected: function() {

	    for (var id in this.list) {
	      var neuron = this.list[id];
	      if (!neuron.selfconnected())
	        return false;
	    }
	    return true;
	  },

	  // true of false whether the layer is connected to another layer (parameter) or not
	  connected: function(layer) {
	    // Check if ALL to ALL connection
	    var connections = 0;
	    for (var here in this.list) {
	      for (var there in layer.list) {
	        var from = this.list[here];
	        var to = layer.list[there];
	        var connected = from.connected(to);
	        if (connected.type == 'projected')
	          connections++;
	      }
	    }
	    if (connections == this.size * layer.size)
	      return Layer.connectionType.ALL_TO_ALL;

	    // Check if ONE to ONE connection
	    connections = 0;
	    for (var neuron in this.list) {
	      var from = this.list[neuron];
	      var to = layer.list[neuron];
	      var connected = from.connected(to);
	      if (connected.type == 'projected')
	        connections++;
	    }
	    if (connections == this.size)
	      return Layer.connectionType.ONE_TO_ONE;
	  },

	  // clears all the neuorns in the layer
	  clear: function() {
	    for (var id in this.list) {
	      var neuron = this.list[id];
	      neuron.clear();
	    }
	  },

	  // resets all the neurons in the layer
	  reset: function() {
	    for (var id in this.list) {
	      var neuron = this.list[id];
	      neuron.reset();
	    }
	  },

	  // returns all the neurons in the layer (array)
	  neurons: function() {
	    return this.list;
	  },

	  // adds a neuron to the layer
	  add: function(neuron) {
	    this.neurons[neuron.ID] = neuron || new Neuron();
	    this.list.push(neuron);
	    this.size++;
	  },

	  set: function(options) {
	    options = options || {};

	    for (var i in this.list) {
	      var neuron = this.list[i];
	      if (options.label)
	        neuron.label = options.label + '_' + neuron.ID;
	      if (options.squash)
	        neuron.squash = options.squash;
	      if (options.bias)
	        neuron.bias = options.bias;
	    }
	    return this;
	  }
	}

	// represents a connection from one layer to another, and keeps track of its weight and gain
	Layer.connection = function LayerConnection(fromLayer, toLayer, type, weights) {
	  this.ID = Layer.connection.uid();
	  this.from = fromLayer;
	  this.to = toLayer;
	  this.selfconnection = toLayer == fromLayer;
	  this.type = type;
	  this.connections = {};
	  this.list = [];
	  this.size = 0;
	  this.gatedfrom = [];

	  if (typeof this.type == 'undefined')
	  {
	    if (fromLayer == toLayer)
	      this.type = Layer.connectionType.ONE_TO_ONE;
	    else
	      this.type = Layer.connectionType.ALL_TO_ALL;
	  }

	  if (this.type == Layer.connectionType.ALL_TO_ALL ||
	      this.type == Layer.connectionType.ALL_TO_ELSE) {
	    for (var here in this.from.list) {
	      for (var there in this.to.list) {
	        var from = this.from.list[here];
	        var to = this.to.list[there];
	        if(this.type == Layer.connectionType.ALL_TO_ELSE && from == to)
	          continue;
	        var connection = from.project(to, weights);

	        this.connections[connection.ID] = connection;
	        this.size = this.list.push(connection);
	      }
	    }
	  } else if (this.type == Layer.connectionType.ONE_TO_ONE) {

	    for (var neuron in this.from.list) {
	      var from = this.from.list[neuron];
	      var to = this.to.list[neuron];
	      var connection = from.project(to, weights);

	      this.connections[connection.ID] = connection;
	      this.size = this.list.push(connection);
	    }
	  }

	  fromLayer.connectedTo.push(this);
	}

	// types of connections
	Layer.connectionType = {};
	Layer.connectionType.ALL_TO_ALL = "ALL TO ALL";
	Layer.connectionType.ONE_TO_ONE = "ONE TO ONE";
	Layer.connectionType.ALL_TO_ELSE = "ALL TO ELSE";

	// types of gates
	Layer.gateType = {};
	Layer.gateType.INPUT = "INPUT";
	Layer.gateType.OUTPUT = "OUTPUT";
	Layer.gateType.ONE_TO_ONE = "ONE TO ONE";

	(function() {
	  var connections = 0;
	  Layer.connection.uid = function() {
	    return connections++;
	  }
	})();

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)(module)))

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {// export
	if (module) module.exports = Network;

	// import
	var Neuron  = __webpack_require__(4)
	,   Layer   = __webpack_require__(6)

	/*******************************************************************************************
	                                         NETWORK
	*******************************************************************************************/

	function Network(layers) {
	  if (typeof layers != 'undefined') {
	    this.layers = layers || {
	      input: null,
	      hidden: {},
	      output: null
	    };
	    this.optimized = null;
	  }
	}
	Network.prototype = {

	  // feed-forward activation of all the layers to produce an ouput
	  activate: function(input) {

	    if (this.optimized === false)
	    {
	      this.layers.input.activate(input);
	      for (var layer in this.layers.hidden)
	        this.layers.hidden[layer].activate();
	      return this.layers.output.activate();
	    }
	    else
	    {
	      if (this.optimized == null)
	        this.optimize();
	      return this.optimized.activate(input);
	    }
	  },

	  // back-propagate the error thru the network
	  propagate: function(rate, target) {

	    if (this.optimized === false)
	    {
	      this.layers.output.propagate(rate, target);
	      var reverse = [];
	      for (var layer in this.layers.hidden)
	        reverse.push(this.layers.hidden[layer]);
	      reverse.reverse();
	      for (var layer in reverse)
	        reverse[layer].propagate(rate);
	    }
	    else
	    {
	      if (this.optimized == null)
	        this.optimize();
	      this.optimized.propagate(rate, target);
	    }
	  },

	  // project a connection to another unit (either a network or a layer)
	  project: function(unit, type, weights) {

	    if (this.optimized)
	      this.optimized.reset();

	    if (unit instanceof Network)
	      return this.layers.output.project(unit.layers.input, type, weights);

	    if (unit instanceof Layer)
	      return this.layers.output.project(unit, type, weights);

	    throw new Error("Invalid argument, you can only project connections to LAYERS and NETWORKS!");
	  },

	  // let this network gate a connection
	  gate: function(connection, type) {
	    if (this.optimized)
	      this.optimized.reset();
	    this.layers.output.gate(connection, type);
	  },

	  // clear all elegibility traces and extended elegibility traces (the network forgets its context, but not what was trained)
	  clear: function() {

	    this.restore();

	    var inputLayer = this.layers.input,
	      outputLayer = this.layers.output;

	    inputLayer.clear();
	    for (var layer in this.layers.hidden) {
	      var hiddenLayer = this.layers.hidden[layer];
	      hiddenLayer.clear();
	    }
	    outputLayer.clear();

	    if (this.optimized)
	      this.optimized.reset();
	  },

	  // reset all weights and clear all traces (ends up like a new network)
	  reset: function() {

	    this.restore();

	    var inputLayer = this.layers.input,
	      outputLayer = this.layers.output;

	    inputLayer.reset();
	    for (var layer in this.layers.hidden) {
	      var hiddenLayer = this.layers.hidden[layer];
	      hiddenLayer.reset();
	    }
	    outputLayer.reset();

	    if (this.optimized)
	      this.optimized.reset();
	  },

	  // hardcodes the behaviour of the whole network into a single optimized function
	  optimize: function() {

	    var that = this;
	    var optimized = {};
	    var neurons = this.neurons();

	    for (var i in neurons) {
	      var neuron = neurons[i].neuron;
	      var layer = neurons[i].layer;
	      while (neuron.neuron)
	        neuron = neuron.neuron;
	      optimized = neuron.optimize(optimized, layer);
	    }
	    for (var i in optimized.propagation_sentences)
	      optimized.propagation_sentences[i].reverse();
	    optimized.propagation_sentences.reverse();

	    var hardcode = "";
	    hardcode += "var F = Float64Array ? new Float64Array(" + optimized.memory +
	      ") : []; ";
	    for (var i in optimized.variables)
	      hardcode += "F[" + optimized.variables[i].id + "] = " + (optimized.variables[
	        i].value || 0) + "; ";
	    hardcode += "var activate = function(input){\n";
	    for (var i in optimized.inputs)
	      hardcode += "F[" + optimized.inputs[i] + "] = input[" + i + "]; ";
	    for (var currentLayer in optimized.activation_sentences) {
	      if (optimized.activation_sentences[currentLayer].length > 0) {
	        for (var currentNeuron in optimized.activation_sentences[currentLayer]) {
	          hardcode += optimized.activation_sentences[currentLayer][currentNeuron].join(" ");
	          hardcode += optimized.trace_sentences[currentLayer][currentNeuron].join(" ");
	        }
	      }
	    }
	    hardcode += " var output = []; "
	    for (var i in optimized.outputs)
	      hardcode += "output[" + i + "] = F[" + optimized.outputs[i] + "]; ";
	    hardcode += "return output; }; "
	    hardcode += "var propagate = function(rate, target){\n";
	    hardcode += "F[" + optimized.variables.rate.id + "] = rate; ";
	    for (var i in optimized.targets)
	      hardcode += "F[" + optimized.targets[i] + "] = target[" + i + "]; ";
	    for (var currentLayer in optimized.propagation_sentences)
	      for (var currentNeuron in optimized.propagation_sentences[currentLayer])
	        hardcode += optimized.propagation_sentences[currentLayer][currentNeuron].join(" ") + " ";
	    hardcode += " };\n";
	    hardcode +=
	      "var ownership = function(memoryBuffer){\nF = memoryBuffer;\nthis.memory = F;\n};\n";
	    hardcode +=
	      "return {\nmemory: F,\nactivate: activate,\npropagate: propagate,\nownership: ownership\n};";
	    hardcode = hardcode.split(";").join(";\n");

	    var constructor = new Function(hardcode);

	    var network = constructor();
	    network.data = {
	      variables: optimized.variables,
	      activate: optimized.activation_sentences,
	      propagate: optimized.propagation_sentences,
	      trace: optimized.trace_sentences,
	      inputs: optimized.inputs,
	      outputs: optimized.outputs,
	      check_activation: this.activate,
	      check_propagation: this.propagate
	    }

	    network.reset = function() {
	      if (that.optimized) {
	        that.optimized = null;
	        that.activate = network.data.check_activation;
	        that.propagate = network.data.check_propagation;
	      }
	    }

	    this.optimized = network;
	    this.activate = network.activate;
	    this.propagate = network.propagate;
	  },

	  // restores all the values from the optimized network the their respective objects in order to manipulate the network
	  restore: function() {
	    if (!this.optimized)
	      return;

	    var optimized = this.optimized;

	    var getValue = function() {
	      var args = Array.prototype.slice.call(arguments);

	      var unit = args.shift();
	      var prop = args.pop();

	      var id = prop + '_';
	      for (var property in args)
	        id += args[property] + '_';
	      id += unit.ID;

	      var memory = optimized.memory;
	      var variables = optimized.data.variables;

	      if (id in variables)
	        return memory[variables[id].id];
	      return 0;
	    }

	    var list = this.neurons();

	    // link id's to positions in the array
	    var ids = {};
	    for (var i in list) {
	      var neuron = list[i].neuron;
	      while (neuron.neuron)
	        neuron = neuron.neuron;

	      neuron.state = getValue(neuron, 'state');
	      neuron.old = getValue(neuron, 'old');
	      neuron.activation = getValue(neuron, 'activation');
	      neuron.bias = getValue(neuron, 'bias');

	      for (var input in neuron.trace.elegibility)
	        neuron.trace.elegibility[input] = getValue(neuron, 'trace',
	          'elegibility', input);

	      for (var gated in neuron.trace.extended)
	        for (var input in neuron.trace.extended[gated])
	          neuron.trace.extended[gated][input] = getValue(neuron, 'trace',
	            'extended', gated, input);
	    }

	    // get connections
	    for (var i in list) {
	      var neuron = list[i].neuron;
	      while (neuron.neuron)
	        neuron = neuron.neuron;

	      for (var j in neuron.connections.projected) {
	        var connection = neuron.connections.projected[j];
	        connection.weight = getValue(connection, 'weight');
	        connection.gain = getValue(connection, 'gain');
	      }
	    }
	  },

	  // returns all the neurons in the network
	  neurons: function() {

	    var neurons = [];

	    var inputLayer = this.layers.input.neurons(),
	      outputLayer = this.layers.output.neurons();

	    for (var neuron in inputLayer)
	      neurons.push({
	        neuron: inputLayer[neuron],
	        layer: 'input'
	      });

	    for (var layer in this.layers.hidden) {
	      var hiddenLayer = this.layers.hidden[layer].neurons();
	      for (var neuron in hiddenLayer)
	        neurons.push({
	          neuron: hiddenLayer[neuron],
	          layer: layer
	        });
	    }
	    for (var neuron in outputLayer)
	      neurons.push({
	        neuron: outputLayer[neuron],
	        layer: 'output'
	      });

	    return neurons;
	  },

	  // returns number of inputs of the network
	  inputs: function() {
	    return this.layers.input.size;
	  },

	  // returns number of outputs of hte network
	  outputs: function() {
	    return this.layers.output.size;
	  },

	  // sets the layers of the network
	  set: function(layers) {

	    this.layers = layers;
	    if (this.optimized)
	      this.optimized.reset();
	  },

	  setOptimize: function(bool){
	    this.restore();
	    if (this.optimized)
	      this.optimized.reset();
	    this.optimized = bool? null : false;
	  },

	  // returns a json that represents all the neurons and connections of the network
	  toJSON: function(ignoreTraces) {

	    this.restore();

	    var list = this.neurons();
	    var neurons = [];
	    var connections = [];

	    // link id's to positions in the array
	    var ids = {};
	    for (var i in list) {
	      var neuron = list[i].neuron;
	      while (neuron.neuron)
	        neuron = neuron.neuron;
	      ids[neuron.ID] = i;

	      var copy = {
	        trace: {
	          elegibility: {},
	          extended: {}
	        },
	        state: neuron.state,
	        old: neuron.old,
	        activation: neuron.activation,
	        bias: neuron.bias,
	        layer: list[i].layer
	      };

	      copy.squash = neuron.squash == Neuron.squash.LOGISTIC ? "LOGISTIC" :
	        neuron.squash == Neuron.squash.TANH ? "TANH" :
	        neuron.squash == Neuron.squash.IDENTITY ? "IDENTITY" :
	        neuron.squash == Neuron.squash.HLIM ? "HLIM" :
	        null;

	      neurons.push(copy);
	    }

	    // get connections
	    for (var i in list) {
	      var neuron = list[i].neuron;
	      while (neuron.neuron)
	        neuron = neuron.neuron;

	      for (var j in neuron.connections.projected) {
	        var connection = neuron.connections.projected[j];
	        connections.push({
	          from: ids[connection.from.ID],
	          to: ids[connection.to.ID],
	          weight: connection.weight,
	          gater: connection.gater ? ids[connection.gater.ID] : null,
	        });
	      }
	      if (neuron.selfconnected())
	        connections.push({
	          from: ids[neuron.ID],
	          to: ids[neuron.ID],
	          weight: neuron.selfconnection.weight,
	          gater: neuron.selfconnection.gater ? ids[neuron.selfconnection.gater.ID] : null,
	        });
	    }

	    return {
	      neurons: neurons,
	      connections: connections
	    }
	  },

	  // export the topology into dot language which can be visualized as graphs using dot
	  /* example: ... console.log(net.toDotLang());
	              $ node example.js > example.dot
	              $ dot example.dot -Tpng > out.png
	  */
	  toDot: function(edgeConnection) {
	    if (! typeof edgeConnection)
	      edgeConnection = false;
	    var code = "digraph nn {\n    rankdir = BT\n";
	    var layers = [this.layers.input].concat(this.layers.hidden, this.layers.output);
	    for (var layer in layers) {
	      for (var to in layers[layer].connectedTo) { // projections
	        var connection = layers[layer].connectedTo[to];
	        var layerTo = connection.to;
	        var size = connection.size;
	        var layerID = layers.indexOf(layers[layer]);
	        var layerToID = layers.indexOf(layerTo);
	        /* http://stackoverflow.com/questions/26845540/connect-edges-with-graph-dot
	         * DOT does not support edge-to-edge connections
	         * This workaround produces somewhat weird graphs ...
	        */
	        if ( edgeConnection) {
	          if (connection.gatedfrom.length) {
	            var fakeNode = "fake" + layerID + "_" + layerToID;
	            code += "    " + fakeNode +
	              " [label = \"\", shape = point, width = 0.01, height = 0.01]\n";
	            code += "    " + layerID + " -> " + fakeNode + " [label = " + size + ", arrowhead = none]\n";
	            code += "    " + fakeNode + " -> " + layerToID + "\n";
	          } else
	            code += "    " + layerID + " -> " + layerToID + " [label = " + size + "]\n";
	          for (var from in connection.gatedfrom) { // gatings
	            var layerfrom = connection.gatedfrom[from].layer;
	            var type = connection.gatedfrom[from].type;
	            var layerfromID = layers.indexOf(layerfrom);
	            code += "    " + layerfromID + " -> " + fakeNode + " [color = blue]\n";
	          }
	        } else {
	          code += "    " + layerID + " -> " + layerToID + " [label = " + size + "]\n";
	          for (var from in connection.gatedfrom) { // gatings
	            var layerfrom = connection.gatedfrom[from].layer;
	            var type = connection.gatedfrom[from].type;
	            var layerfromID = layers.indexOf(layerfrom);
	            code += "    " + layerfromID + " -> " + layerToID + " [color = blue]\n";
	          }
	        }
	      }
	    }
	    code += "}\n";
	    return {
	      code: code,
	      link: "https://chart.googleapis.com/chart?chl=" + escape(code.replace("/ /g", "+")) + "&cht=gv"
	    }
	  },

	  // returns a function that works as the activation of the network and can be used without depending on the library
	  standalone: function() {
	    if (!this.optimized)
	      this.optimize();

	    var data = this.optimized.data;

	    // build activation function
	    var activation = "function (input) {\n";

	    // build inputs
	    for (var i in data.inputs)
	      activation += "F[" + data.inputs[i] + "] = input[" + i + "];\n";

	    // build network activation
	    for (var neuron in data.activate) { // shouldn't this be layer?
	      for (var sentence in data.activate[neuron])
	        activation += data.activate[neuron][sentence].join('') + "\n";
	    }

	    // build outputs
	    activation += "var output = [];\n";
	    for (var i in data.outputs)
	      activation += "output[" + i + "] = F[" + data.outputs[i] + "];\n";
	    activation += "return output;\n}";

	    // reference all the positions in memory
	    var memory = activation.match(/F\[(\d+)\]/g);
	    var dimension = 0;
	    var ids = {};
	    for (var address in memory) {
	      var tmp = memory[address].match(/\d+/)[0];
	      if (!(tmp in ids)) {
	        ids[tmp] = dimension++;
	      }
	    }
	    var hardcode = "F = {\n";
	    for (var i in ids)
	      hardcode += ids[i] + ": " + this.optimized.memory[i] + ",\n";
	    hardcode = hardcode.substring(0, hardcode.length - 2) + "\n};\n";
	    hardcode = "var run = " + activation.replace(/F\[(\d+)]/g, function(
	      index) {
	      return 'F[' + ids[index.match(/\d+/)[0]] + ']'
	    }).replace("{\n", "{\n" + hardcode + "") + ";\n";
	    hardcode += "return run";

	    // return standalone function
	    return new Function(hardcode)();
	  },

	  worker: function() {
	    if (!this.optimized)
	      this.optimize();

	    var hardcode = "var inputs = " + this.optimized.data.inputs.length +
	      ";\n";
	    hardcode += "var outputs = " + this.optimized.data.outputs.length +
	      ";\n";
	    hardcode += "var F = null;\n";
	    hardcode += "var activate = " + this.optimized.activate.toString() +
	      ";\n";
	    hardcode += "var propagate = " + this.optimized.propagate.toString() +
	      ";\n";
	    hardcode += "onmessage = function(e){\n";
	    hardcode += "F = e.data.memoryBuffer;\n";
	    hardcode += "if (e.data.action == 'activate'){\n";
	    hardcode += "if (e.data.input.length == inputs){\n";
	    hardcode +=
	      "postMessage( { action: 'activate', output: activate(e.data.input), memoryBuffer: F }, [F.buffer]);\n";
	    hardcode += "}\n}\nelse if (e.data.action == 'propagate'){\n";
	    hardcode += "propagate(e.data.rate, e.data.target);\n";
	    hardcode +=
	      "postMessage({ action: 'propagate', memoryBuffer: F }, [F.buffer]);\n";
	    hardcode += "}\n}\n";

	    var blob = new Blob([hardcode]);
	    var blobURL = window.URL.createObjectURL(blob);

	    return new Worker(blobURL);
	  },

	  // returns a copy of the network
	  clone: function() {
	    return Network.fromJSON(this.toJSON());
	  }
	}

	// rebuild a network that has been stored in a json using the method toJSON()
	Network.fromJSON = function(json) {

	  var neurons = [];

	  var layers = {
	    input: new Layer(),
	    hidden: [],
	    output: new Layer()
	  }

	  for (var i in json.neurons) {
	    var config = json.neurons[i];

	    var neuron = new Neuron();
	    neuron.trace.elegibility = {};
	    neuron.trace.extended = {};
	    neuron.state = config.state;
	    neuron.old = config.old;
	    neuron.activation = config.activation;
	    neuron.bias = config.bias;
	    neuron.squash = config.squash in Neuron.squash ? Neuron.squash[config.squash] : Neuron.squash.LOGISTIC;
	    neurons.push(neuron);

	    if (config.layer == 'input')
	      layers.input.add(neuron);
	    else if (config.layer == 'output')
	      layers.output.add(neuron);
	    else {
	      if (typeof layers.hidden[config.layer] == 'undefined')
	        layers.hidden[config.layer] = new Layer();
	      layers.hidden[config.layer].add(neuron);
	    }
	  }

	  for (var i in json.connections) {
	    var config = json.connections[i];
	    var from = neurons[config.from];
	    var to = neurons[config.to];
	    var weight = config.weight
	    var gater = neurons[config.gater];

	    var connection = from.project(to, weight);
	    if (gater)
	      gater.gate(connection);
	  }

	  return new Network(layers);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)(module)))

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {// export
	if (module) module.exports = Trainer;

	/*******************************************************************************************
	                                        TRAINER
	*******************************************************************************************/

	function Trainer(network, options) {
	  options = options || {};
	  this.network = network;
	  this.rate = options.rate || .2;
	  this.iterations = options.iterations || 100000;
	  this.error = options.error || .005
	  this.cost = options.cost || null;
	  this.crossValidate = options.crossValidate || null;
	}

	Trainer.prototype = {

	  // trains any given set to a network
	  train: function(set, options) {

	    var error = 1;
	    var iterations = bucketSize = 0;
	    var abort = false;
	    var input, output, target, currentRate;
	    var cost = options && options.cost || this.cost || Trainer.cost.MSE;
	    var crossValidate = false, testSet, trainSet;

	    var start = Date.now();

	    if (options) {
	      if (options.shuffle) {
	        //+ Jonas Raoni Soares Silva
	        //@ http://jsfromhell.com/array/shuffle [v1.0]
	        function shuffle(o) { //v1.0
	          for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	          return o;
	        };
	      }
	      if (options.iterations)
	        this.iterations = options.iterations;
	      if (options.error)
	        this.error = options.error;
	      if (options.rate)
	        this.rate = options.rate;
	      if (options.cost)
	        this.cost = options.cost;
	      if (options.schedule)
	        this.schedule = options.schedule;
	      if (options.customLog){
	        // for backward compatibility with code that used customLog
	        console.log('Deprecated: use schedule instead of customLog')
	        this.schedule = options.customLog;
	      }
	      if (this.crossValidate) {
	        crossValidate = true;
	        if (options.crossValidate.testSize)
	          this.crossValidate.testSize = options.crossValidate.testSize;
	        if (options.crossValidate.testError)
	          this.crossValidate.testError = options.crossValidate.testError;
	      }
	    }

	    currentRate = this.rate;
	    if(Array.isArray(this.rate)) {
	      bucketSize = Math.floor(this.iterations / this.rate.length);
	    }

	    if(crossValidate) {
	      var numTrain = Math.ceil((1 - this.crossValidate.testSize) * set.length);
	      trainSet = set.slice(0, numTrain);
	      testSet = set.slice(numTrain);
	    }

	    while ((!abort && iterations < this.iterations && error > this.error)) {
	      if (crossValidate && error <= this.crossValidate.testError) {
	        break;
	      }

	      var currentSetSize = set.length;
	      error = 0;

	      if(bucketSize > 0) {
	        var currentBucket = Math.floor(iterations / bucketSize);
	        currentRate = this.rate[currentBucket] || currentRate;
	      }

	      if (crossValidate) {
	        this._trainSet(trainSet, currentRate, cost);
	        error += this.test(testSet).error;
	        currentSetSize = 1;
	      } else {
	        error += this._trainSet(set, currentRate, cost);
	        currentSetSize = set.length;
	      }

	      // check error
	      iterations++;
	      error /= currentSetSize;

	      if (options) {
	        if (this.schedule && this.schedule.every && iterations %
	          this.schedule.every == 0)
	          abort = this.schedule.do({
	            error: error,
	            iterations: iterations,
	            rate: currentRate
	          });
	        else if (options.log && iterations % options.log == 0) {
	          console.log('iterations', iterations, 'error', error, 'rate', currentRate);
	        };
	        if (options.shuffle)
	          shuffle(set);
	      }
	    }

	    var results = {
	      error: error,
	      iterations: iterations,
	      time: Date.now() - start
	    }

	    return results;
	  },

	  // preforms one training epoch and returns the error (private function used in this.train)
	  _trainSet: function(set, currentRate, costFunction) {
	    var errorSum = 0;
	    for (var train in set) {
	      input = set[train].input;
	      target = set[train].output;

	      output = this.network.activate(input);
	      this.network.propagate(currentRate, target);

	      errorSum += costFunction(target, output);
	    }
	    return errorSum;
	  },

	  // tests a set and returns the error and elapsed time
	  test: function(set, options) {

	    var error = 0;
	    var abort = false;
	    var input, output, target;
	    var cost = options && options.cost || this.cost || Trainer.cost.MSE;

	    var start = Date.now();

	    for (var test in set) {
	      input = set[test].input;
	      target = set[test].output;
	      output = this.network.activate(input);
	      error += cost(target, output);
	    }

	    error /= set.length;

	    var results = {
	      error: error,
	      time: Date.now() - start
	    }

	    return results;
	  },

	  // trains any given set to a network using a WebWorker
	  workerTrain: function(set, callback, options) {

	    var that = this;
	    var error = 1;
	    var iterations = bucketSize = 0;
	    var input, output, target, currentRate;
	    var length = set.length;
	    var abort = false;
	    var cost = options && options.cost || that.cost || Trainer.cost.MSE;

	    var start = Date.now();

	    if (options) {
	      if (options.shuffle) {
	        //+ Jonas Raoni Soares Silva
	        //@ http://jsfromhell.com/array/shuffle [v1.0]
	        function shuffle(o) { //v1.0
	          for (var j, x, i = o.length; i; j = Math.floor(Math.random() *
	              i), x = o[--i], o[i] = o[j], o[j] = x);
	          return o;
	        };
	      }
	      if (options.iterations)
	        that.iterations = options.iterations;
	      if (options.error)
	        that.error = options.error;
	      if (options.rate)
	        that.rate = options.rate;
	      if (options.cost)
	        that.cost = options.cost;
	      if (options.schedule)
	        that.schedule = options.schedule;
	      if (options.customLog)
	      {
	        // for backward compatibility with code that used customLog
	        console.log('Deprecated: use schedule instead of customLog')
	        that.schedule = options.customLog;
	      }
	    }

	    // dynamic learning rate
	    currentRate = that.rate;
	    if(Array.isArray(that.rate)) {
	      bucketSize = Math.floor(that.iterations / that.rate.length);
	    }

	    // create a worker
	    var worker = that.network.worker();

	    // activate the network
	    function activateWorker(input)
	    {
	        worker.postMessage({
	            action: "activate",
	            input: input,
	            memoryBuffer: that.network.optimized.memory
	        }, [that.network.optimized.memory.buffer]);
	    }

	    // backpropagate the network
	    function propagateWorker(target){
	        if(bucketSize > 0) {
	          var currentBucket = Math.floor(iterations / bucketSize);
	          currentRate = that.rate[currentBucket] || currentRate;
	        }
	        worker.postMessage({
	            action: "propagate",
	            target: target,
	            rate: currentRate,
	            memoryBuffer: that.network.optimized.memory
	        }, [that.network.optimized.memory.buffer]);
	    }

	    // train the worker
	    worker.onmessage = function(e){
	        // give control of the memory back to the network
	        that.network.optimized.ownership(e.data.memoryBuffer);

	        if (e.data.action == "propagate")
	        {
	            if (index >= length)
	            {
	                index = 0;
	                iterations++;
	                error /= set.length;

	                // log
	                if (options) {
	                  if (that.schedule && that.schedule.every && iterations % that.schedule.every == 0)
	                    abort = that.schedule.do({
	                      error: error,
	                      iterations: iterations,
	                      rate: currentRate
	                    });
	                  else if (options.log && iterations % options.log == 0) {
	                    console.log('iterations', iterations, 'error', error);
	                  };
	                  if (options.shuffle)
	                    shuffle(set);
	                }

	                if (!abort && iterations < that.iterations && error > that.error)
	                {
	                    activateWorker(set[index].input);
	                } else {
	                    // callback
	                    callback({
	                      error: error,
	                      iterations: iterations,
	                      time: Date.now() - start
	                    })
	                }
	                error = 0;
	            } else {
	                activateWorker(set[index].input);
	            }
	        }

	        if (e.data.action == "activate")
	        {
	            error += cost(set[index].output, e.data.output);
	            propagateWorker(set[index].output);
	            index++;
	        }
	    }

	    // kick it
	    var index = 0;
	    var iterations = 0;
	    activateWorker(set[index].input);
	  },

	  // trains an XOR to the network
	  XOR: function(options) {

	    if (this.network.inputs() != 2 || this.network.outputs() != 1)
	      throw new Error("Incompatible network (2 inputs, 1 output)");

	    var defaults = {
	      iterations: 100000,
	      log: false,
	      shuffle: true,
	      cost: Trainer.cost.MSE
	    }

	    if (options)
	      for (var i in options)
	        defaults[i] = options[i];

	    return this.train([{
	      input: [0, 0],
	      output: [0]
	    }, {
	      input: [1, 0],
	      output: [1]
	    }, {
	      input: [0, 1],
	      output: [1]
	    }, {
	      input: [1, 1],
	      output: [0]
	    }], defaults);
	  },

	  // trains the network to pass a Distracted Sequence Recall test
	  DSR: function(options) {
	    options = options || {};

	    var targets = options.targets || [2, 4, 7, 8];
	    var distractors = options.distractors || [3, 5, 6, 9];
	    var prompts = options.prompts || [0, 1];
	    var length = options.length || 24;
	    var criterion = options.success || 0.95;
	    var iterations = options.iterations || 100000;
	    var rate = options.rate || .1;
	    var log = options.log || 0;
	    var schedule = options.schedule || {};
	    var cost = options.cost || this.cost || Trainer.cost.CROSS_ENTROPY;

	    var trial = correct = i = j = success = 0,
	      error = 1,
	      symbols = targets.length + distractors.length + prompts.length;

	    var noRepeat = function(range, avoid) {
	      var number = Math.random() * range | 0;
	      var used = false;
	      for (var i in avoid)
	        if (number == avoid[i])
	          used = true;
	      return used ? noRepeat(range, avoid) : number;
	    }

	    var equal = function(prediction, output) {
	      for (var i in prediction)
	        if (Math.round(prediction[i]) != output[i])
	          return false;
	      return true;
	    }

	    var start = Date.now();

	    while (trial < iterations && (success < criterion || trial % 1000 != 0)) {
	      // generate sequence
	      var sequence = [],
	        sequenceLength = length - prompts.length;
	      for (i = 0; i < sequenceLength; i++) {
	        var any = Math.random() * distractors.length | 0;
	        sequence.push(distractors[any]);
	      }
	      var indexes = [],
	        positions = [];
	      for (i = 0; i < prompts.length; i++) {
	        indexes.push(Math.random() * targets.length | 0);
	        positions.push(noRepeat(sequenceLength, positions));
	      }
	      positions = positions.sort();
	      for (i = 0; i < prompts.length; i++) {
	        sequence[positions[i]] = targets[indexes[i]];
	        sequence.push(prompts[i]);
	      }

	      //train sequence
	      var targetsCorrect = distractorsCorrect = 0;
	      error = 0;
	      for (i = 0; i < length; i++) {
	        // generate input from sequence
	        var input = [];
	        for (j = 0; j < symbols; j++)
	          input[j] = 0;
	        input[sequence[i]] = 1;

	        // generate target output
	        var output = [];
	        for (j = 0; j < targets.length; j++)
	          output[j] = 0;

	        if (i >= sequenceLength) {
	          var index = i - sequenceLength;
	          output[indexes[index]] = 1;
	        }

	        // check result
	        var prediction = this.network.activate(input);

	        if (equal(prediction, output))
	          if (i < sequenceLength)
	            distractorsCorrect++;
	          else
	            targetsCorrect++;
	        else {
	          this.network.propagate(rate, output);
	        }

	        error += cost(output, prediction);

	        if (distractorsCorrect + targetsCorrect == length)
	          correct++;
	      }

	      // calculate error
	      if (trial % 1000 == 0)
	        correct = 0;
	      trial++;
	      var divideError = trial % 1000;
	      divideError = divideError == 0 ? 1000 : divideError;
	      success = correct / divideError;
	      error /= length;

	      // log
	      if (log && trial % log == 0)
	        console.log("iterations:", trial, " success:", success, " correct:",
	          correct, " time:", Date.now() - start, " error:", error);
	      if (schedule.do && schedule.every && trial % schedule.every == 0)
	        schedule.do({
	          iterations: trial,
	          success: success,
	          error: error,
	          time: Date.now() - start,
	          correct: correct
	        });
	    }

	    return {
	      iterations: trial,
	      success: success,
	      error: error,
	      time: Date.now() - start
	    }
	  },

	  // train the network to learn an Embeded Reber Grammar
	  ERG: function(options) {

	    options = options || {};
	    var iterations = options.iterations || 150000;
	    var criterion = options.error || .05;
	    var rate = options.rate || .1;
	    var log = options.log || 500;
	    var cost = options.cost || this.cost || Trainer.cost.CROSS_ENTROPY;

	    // gramar node
	    var Node = function() {
	      this.paths = [];
	    }
	    Node.prototype = {
	      connect: function(node, value) {
	        this.paths.push({
	          node: node,
	          value: value
	        });
	        return this;
	      },
	      any: function() {
	        if (this.paths.length == 0)
	          return false;
	        var index = Math.random() * this.paths.length | 0;
	        return this.paths[index];
	      },
	      test: function(value) {
	        for (var i in this.paths)
	          if (this.paths[i].value == value)
	            return this.paths[i];
	        return false;
	      }
	    }

	    var reberGrammar = function() {

	      // build a reber grammar
	      var output = new Node();
	      var n1 = (new Node()).connect(output, "E");
	      var n2 = (new Node()).connect(n1, "S");
	      var n3 = (new Node()).connect(n1, "V").connect(n2, "P");
	      var n4 = (new Node()).connect(n2, "X")
	      n4.connect(n4, "S");
	      var n5 = (new Node()).connect(n3, "V")
	      n5.connect(n5, "T");
	      n2.connect(n5, "X")
	      var n6 = (new Node()).connect(n4, "T").connect(n5, "P");
	      var input = (new Node()).connect(n6, "B")

	      return {
	        input: input,
	        output: output
	      }
	    }

	    // build an embeded reber grammar
	    var embededReberGrammar = function() {
	      var reber1 = reberGrammar();
	      var reber2 = reberGrammar();

	      var output = new Node();
	      var n1 = (new Node).connect(output, "E");
	      reber1.output.connect(n1, "T");
	      reber2.output.connect(n1, "P");
	      var n2 = (new Node).connect(reber1.input, "P").connect(reber2.input,
	        "T");
	      var input = (new Node).connect(n2, "B");

	      return {
	        input: input,
	        output: output
	      }

	    }

	    // generate an ERG sequence
	    var generate = function() {
	      var node = embededReberGrammar().input;
	      var next = node.any();
	      var str = "";
	      while (next) {
	        str += next.value;
	        next = next.node.any();
	      }
	      return str;
	    }

	    // test if a string matches an embeded reber grammar
	    var test = function(str) {
	      var node = embededReberGrammar().input;
	      var i = 0;
	      var ch = str.charAt(i);
	      while (i < str.length) {
	        var next = node.test(ch);
	        if (!next)
	          return false;
	        node = next.node;
	        ch = str.charAt(++i);
	      }
	      return true;
	    }

	    // helper to check if the output and the target vectors match
	    var different = function(array1, array2) {
	      var max1 = 0;
	      var i1 = -1;
	      var max2 = 0;
	      var i2 = -1;
	      for (var i in array1) {
	        if (array1[i] > max1) {
	          max1 = array1[i];
	          i1 = i;
	        }
	        if (array2[i] > max2) {
	          max2 = array2[i];
	          i2 = i;
	        }
	      }

	      return i1 != i2;
	    }

	    var iteration = 0;
	    var error = 1;
	    var table = {
	      "B": 0,
	      "P": 1,
	      "T": 2,
	      "X": 3,
	      "S": 4,
	      "E": 5
	    }

	    var start = Date.now();
	    while (iteration < iterations && error > criterion) {
	      var i = 0;
	      error = 0;

	      // ERG sequence to learn
	      var sequence = generate();

	      // input
	      var read = sequence.charAt(i);
	      // target
	      var predict = sequence.charAt(i + 1);

	      // train
	      while (i < sequence.length - 1) {
	        var input = [];
	        var target = [];
	        for (var j = 0; j < 6; j++) {
	          input[j] = 0;
	          target[j] = 0;
	        }
	        input[table[read]] = 1;
	        target[table[predict]] = 1;

	        var output = this.network.activate(input);

	        if (different(output, target))
	          this.network.propagate(rate, target);

	        read = sequence.charAt(++i);
	        predict = sequence.charAt(i + 1);

	        error += cost(target, output);
	      }
	      error /= sequence.length;
	      iteration++;
	      if (iteration % log == 0) {
	        console.log("iterations:", iteration, " time:", Date.now() - start,
	          " error:", error);
	      }
	    }

	    return {
	      iterations: iteration,
	      error: error,
	      time: Date.now() - start,
	      test: test,
	      generate: generate
	    }
	  },

	  timingTask: function(options){

	    if (this.network.inputs() != 2 || this.network.outputs() != 1)
	      throw new Error("Invalid Network: must have 2 inputs and one output");

	    if (typeof options == 'undefined')
	      var options = {};

	    // helper
	    function getSamples (trainingSize, testSize){

	      // sample size
	      var size = trainingSize + testSize;

	      // generate samples
	      var t = 0;
	      var set  = [];
	      for (var i = 0; i < size; i++) {
	        set.push({ input: [0,0], output: [0] });
	      }
	      while(t < size - 20) {
	          var n = Math.round(Math.random() * 20);
	          set[t].input[0] = 1;
	          for (var j = t; j <= t + n; j++){
	              set[j].input[1] = n / 20;
	              set[j].output[0] = 0.5;
	          }
	          t += n;
	          n = Math.round(Math.random() * 20);
	          for (var k = t+1; k <= (t + n) &&  k < size; k++)
	              set[k].input[1] = set[t].input[1];
	          t += n;
	      }

	      // separate samples between train and test sets
	      var trainingSet = []; var testSet = [];
	      for (var l = 0; l < size; l++)
	          (l < trainingSize ? trainingSet : testSet).push(set[l]);

	      // return samples
	      return {
	          train: trainingSet,
	          test: testSet
	      }
	    }

	    var iterations = options.iterations || 200;
	    var error = options.error || .005;
	    var rate = options.rate || [.03, .02];
	    var log = options.log === false ? false : options.log || 10;
	    var cost = options.cost || this.cost || Trainer.cost.MSE;
	    var trainingSamples = options.trainSamples || 7000;
	    var testSamples = options.trainSamples || 1000;

	    // samples for training and testing
	    var samples = getSamples(trainingSamples, testSamples);

	    // train
	    var result = this.train(samples.train, {
	      rate: rate,
	      log: log,
	      iterations: iterations,
	      error: error,
	      cost: cost
	    });

	    return {
	      train: result,
	      test: this.test(samples.test)
	    }
	  }
	};

	// Built-in cost functions
	Trainer.cost = {
	  // Eq. 9
	  CROSS_ENTROPY: function(target, output)
	  {
	    var crossentropy = 0;
	    for (var i in output)
	      crossentropy -= (target[i] * Math.log(output[i]+1e-15)) + ((1-target[i]) * Math.log((1+1e-15)-output[i])); // +1e-15 is a tiny push away to avoid Math.log(0)
	    return crossentropy;
	  },
	  MSE: function(target, output)
	  {
	    var mse = 0;
	    for (var i in output)
	      mse += Math.pow(target[i] - output[i], 2);
	    return mse / output.length;
	  },
	  BINARY: function(target, output){
	    var misses = 0;
	    for (var i in output)
	      misses += Math.round(target[i] * 2) != Math.round(output[i] * 2);
	    return misses;
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)(module)))

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {// import
	var Layer   = __webpack_require__(6)
	,   Network = __webpack_require__(7)
	,   Trainer = __webpack_require__(8)

	/*******************************************************************************************
	                                        ARCHITECT
	*******************************************************************************************/

	// Colection of useful built-in architectures
	var Architect = {

	  // Multilayer Perceptron
	  Perceptron: function Perceptron() {

	    var args = Array.prototype.slice.call(arguments); // convert arguments to Array
	    if (args.length < 3)
	      throw new Error("not enough layers (minimum 3) !!");

	    var inputs = args.shift(); // first argument
	    var outputs = args.pop(); // last argument
	    var layers = args; // all the arguments in the middle

	    var input = new Layer(inputs);
	    var hidden = [];
	    var output = new Layer(outputs);

	    var previous = input;

	    // generate hidden layers
	    for (level in layers) {
	      var size = layers[level];
	      var layer = new Layer(size);
	      hidden.push(layer);
	      previous.project(layer);
	      previous = layer;
	    }
	    previous.project(output);

	    // set layers of the neural network
	    this.set({
	      input: input,
	      hidden: hidden,
	      output: output
	    });

	    // trainer for the network
	    this.trainer = new Trainer(this);
	  },

	  // Multilayer Long Short-Term Memory
	  LSTM: function LSTM() {

	    var args = Array.prototype.slice.call(arguments); // convert arguments to array
	    if (args.length < 3)
	      throw new Error("not enough layers (minimum 3) !!");

	    var last = args.pop();
	    var option = {
	      peepholes: Layer.connectionType.ALL_TO_ALL,
	      hiddenToHidden: false,
	      outputToHidden: false,
	      outputToGates: false,
	      inputToOutput: true,
	    };
	    if (typeof last != 'number') {
	      var outputs = args.pop();
	      if (last.hasOwnProperty('peepholes'))
	        option.peepholes = last.peepholes;
	      if (last.hasOwnProperty('hiddenToHidden'))
	        option.hiddenToHidden = last.hiddenToHidden;
	      if (last.hasOwnProperty('outputToHidden'))
	        option.outputToHidden = last.outputToHidden;
	      if (last.hasOwnProperty('outputToGates'))
	        option.outputToGates = last.outputToGates;
	      if (last.hasOwnProperty('inputToOutput'))
	        option.inputToOutput = last.inputToOutput;
	    } else
	      var outputs = last;

	    var inputs = args.shift();
	    var layers = args;

	    var inputLayer = new Layer(inputs);
	    var hiddenLayers = [];
	    var outputLayer = new Layer(outputs);

	    var previous = null;

	    // generate layers
	    for (var layer in layers) {
	      // generate memory blocks (memory cell and respective gates)
	      var size = layers[layer];

	      var inputGate = new Layer(size).set({
	        bias: 1
	      });
	      var forgetGate = new Layer(size).set({
	        bias: 1
	      });
	      var memoryCell = new Layer(size);
	      var outputGate = new Layer(size).set({
	        bias: 1
	      });

	      hiddenLayers.push(inputGate);
	      hiddenLayers.push(forgetGate);
	      hiddenLayers.push(memoryCell);
	      hiddenLayers.push(outputGate);

	      // connections from input layer
	      var input = inputLayer.project(memoryCell);
	      inputLayer.project(inputGate);
	      inputLayer.project(forgetGate);
	      inputLayer.project(outputGate);

	      // connections from previous memory-block layer to this one
	      if (previous != null) {
	        var cell = previous.project(memoryCell);
	        previous.project(inputGate);
	        previous.project(forgetGate);
	        previous.project(outputGate);
	      }

	      // connections from memory cell
	      var output = memoryCell.project(outputLayer);

	      // self-connection
	      var self = memoryCell.project(memoryCell);

	      // hidden to hidden recurrent connection
	      if (option.hiddenToHidden)
	        memoryCell.project(memoryCell, Layer.connectionType.ALL_TO_ELSE);

	      // out to hidden recurrent connection
	      if (option.outputToHidden)
	        outputLayer.project(memoryCell);

	      // out to gates recurrent connection
	      if (option.outputToGates) {
	        outputLayer.project(inputGate);
	        outputLayer.project(outputGate);
	        outputLayer.project(forgetGate);
	      }

	      // peepholes
	      memoryCell.project(inputGate, option.peepholes);
	      memoryCell.project(forgetGate, option.peepholes);
	      memoryCell.project(outputGate, option.peepholes);

	      // gates
	      inputGate.gate(input, Layer.gateType.INPUT);
	      forgetGate.gate(self, Layer.gateType.ONE_TO_ONE);
	      outputGate.gate(output, Layer.gateType.OUTPUT);
	      if (previous != null)
	        inputGate.gate(cell, Layer.gateType.INPUT);

	      previous = memoryCell;
	    }

	    // input to output direct connection
	    if (option.inputToOutput)
	      inputLayer.project(outputLayer);

	    // set the layers of the neural network
	    this.set({
	      input: inputLayer,
	      hidden: hiddenLayers,
	      output: outputLayer
	    });

	    // trainer
	    this.trainer = new Trainer(this);
	  },

	  // Liquid State Machine
	  Liquid: function Liquid(inputs, hidden, outputs, connections, gates) {

	    // create layers
	    var inputLayer = new Layer(inputs);
	    var hiddenLayer = new Layer(hidden);
	    var outputLayer = new Layer(outputs);

	    // make connections and gates randomly among the neurons
	    var neurons = hiddenLayer.neurons();
	    var connectionList = [];

	    for (var i = 0; i < connections; i++) {
	      // connect two random neurons
	      var from = Math.random() * neurons.length | 0;
	      var to = Math.random() * neurons.length | 0;
	      var connection = neurons[from].project(neurons[to]);
	      connectionList.push(connection);
	    }

	    for (var j = 0; j < gates; j++) {
	      // pick a random gater neuron
	      var gater = Math.random() * neurons.length | 0;
	      // pick a random connection to gate
	      var connection = Math.random() * connectionList.length | 0;
	      // let the gater gate the connection
	      neurons[gater].gate(connectionList[connection]);
	    }

	    // connect the layers
	    inputLayer.project(hiddenLayer);
	    hiddenLayer.project(outputLayer);

	    // set the layers of the network
	    this.set({
	      input: inputLayer,
	      hidden: [hiddenLayer],
	      output: outputLayer
	    });

	    // trainer
	    this.trainer = new Trainer(this);
	  },

	  Hopfield: function Hopfield(size)
	  {
	    var inputLayer = new Layer(size);
	    var outputLayer = new Layer(size);

	    inputLayer.project(outputLayer, Layer.connectionType.ALL_TO_ALL);

	    this.set({
	      input: inputLayer,
	      hidden: [],
	      output: outputLayer
	    });

	    var trainer = new Trainer(this);

	    var proto = Architect.Hopfield.prototype;

	    proto.learn = proto.learn || function(patterns)
	    {
	      var set = [];
	      for (var p in patterns)
	        set.push({
	          input: patterns[p],
	          output: patterns[p]
	        });

	      return trainer.train(set, {
	        iterations: 500000,
	        error: .00005,
	        rate: 1
	      });
	    }

	    proto.feed = proto.feed || function(pattern)
	    {
	      var output = this.activate(pattern);

	      var pattern = [];
	      for (var i in output)
	        pattern[i] = output[i] > .5 ? 1 : 0;

	      return pattern;
	    }
	  }
	}

	// Extend prototype chain (so every architectures is an instance of Network)
	for (var architecture in Architect) {
	  Architect[architecture].prototype = new Network();
	  Architect[architecture].prototype.constructor = Architect[architecture];
	}

	// export
	if (module) module.exports = Architect;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)(module)))

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Creature = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _vector = __webpack_require__(2);

	var _vector2 = _interopRequireDefault(_vector);

	var _synaptic = __webpack_require__(3);

	var _synaptic2 = _interopRequireDefault(_synaptic);

	var _food = __webpack_require__(11);

	var _food2 = _interopRequireDefault(_food);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Creature = function () {
	  function Creature(p) {
	    _classCallCheck(this, Creature);

	    this.p = p;
	    this.v = new _vector2.default().random();
	    this.network = new _synaptic2.default.Architect.Perceptron(9, 16, 6, 1);
	    this.energy = 0;
	    this.radius = 6;
	    this.hue = 0;
	    this.setColor();
	  }

	  _createClass(Creature, [{
	    key: 'tick',
	    value: function tick(bounds, _ref, speed) {
	      var fBin = _ref.fBin;
	      var cBin = _ref.cBin;

	      var packedInputs = this.getInputs({ fBin: fBin, cBin: cBin }, bounds);

	      var activation = this.activate(packedInputs);
	      this.move(activation, speed, bounds);
	      this.p.wrap(bounds);
	      this.eat(fBin);
	    }
	  }, {
	    key: 'eat',
	    value: function eat(neighbors) {
	      var _this = this;

	      neighbors.length;
	      var com = new _vector2.default();
	      neighbors.forEach(function (n) {
	        if (n instanceof _food2.default && _this.p.dist(n.p) < _this.radius) {
	          n.marked = true;
	          _this.energy += 1;
	        }
	      });
	    }
	  }, {
	    key: 'getClosestWall',
	    value: function getClosestWall(bounds) {
	      var _this2 = this;

	      var wallpoints = [new _vector2.default(this.p.x, 0), new _vector2.default(this.p.x, bounds.y), new _vector2.default(0, this.p.y), new _vector2.default(bounds.x, this.p.y)];

	      var closestwall = wallpoints.reduce(function (min, wp) {
	        if (_this2.p.dist(wp) < _this2.p.dist(min)) {
	          return wp;
	        }
	        return min;
	      });
	      return closestwall;
	    }
	  }, {
	    key: 'getInputs',
	    value: function getInputs(_ref2, bounds) {
	      var fBin = _ref2.fBin;
	      var cBin = _ref2.cBin;

	      var inputs = this.getFoodInputs(fBin);
	      Object.assign(inputs, this.getCreatureInputs(cBin));
	      inputs.cw = this.getClosestWall(bounds).sub(this.p).normalize();
	      inputs.wd = Math.min(this.getClosestWall(bounds).dist(this.p) / 200, 0.99);

	      var xInputs = [];
	      var yInputs = [];
	      xInputs.push(0.1); //0
	      yInputs.push(0.9); //1

	      xInputs.push(inputs.COM.x); //0
	      yInputs.push(inputs.COM.y); //1
	      xInputs.push(inputs.f1.x); //2
	      yInputs.push(inputs.f1.y); //3
	      xInputs.push(inputs.f1d); //4
	      yInputs.push(inputs.f1d);

	      //
	      xInputs.push(inputs.c1p.x);
	      yInputs.push(inputs.c1p.y);
	      xInputs.push(inputs.c1v.x);
	      yInputs.push(inputs.c1v.y);
	      xInputs.push(inputs.c1d); //9
	      yInputs.push(inputs.c1d);

	      xInputs.push(inputs.cw.x); //5//10
	      yInputs.push(inputs.cw.y); //6//11
	      xInputs.push(inputs.wd);
	      yInputs.push(inputs.wd); //7//12
	      xInputs = xInputs.map(function (i) {
	        return (i + 1) / 2;
	      });
	      yInputs = yInputs.map(function (i) {
	        return (i + 1) / 2;
	      });

	      // packedInputs.push(Math.random());

	      return { x: xInputs, y: yInputs };
	    }
	  }, {
	    key: 'getCreatureInputs',
	    value: function getCreatureInputs(creatures) {
	      var _this3 = this;

	      if (creatures.length < 2) {
	        return { c1p: new _vector2.default(0, 0),
	          c1v: new _vector2.default(0, 0),
	          c1d: 1.0 };
	      }
	      var noSelf = creatures.filter(function (e) {
	        return e !== _this3;
	      });
	      var closestCreature = noSelf.reduce(function (clostest, e) {
	        if (_this3.p.dist(e.p) < _this3.p.dist(clostest.p)) {
	          return e;
	        }
	        return clostest;
	      });
	      return { c1p: closestCreature.p.copy().sub(this.p).normalize(),
	        c1v: closestCreature.v.copy().normalize(),
	        c1d: closestCreature.p.copy().sub(this.p).mag() / 141
	      };
	    }
	  }, {
	    key: 'getFoodInputs',
	    value: function getFoodInputs(entities) {
	      var _this4 = this;

	      if (entities.length === 0) {
	        return { COM: new _vector2.default(0, 0),
	          f1: new _vector2.default(0, 0),
	          f1d: 1.0 };
	      }
	      var closestfood = entities[0].p.copy();
	      var sum = entities.reduce(function (avg, e) {
	        avg.add(e.p);
	        if (_this4.p.dist(e.p) < _this4.p.dist(closestfood)) {
	          closestfood = e.p.copy();
	        }
	        return avg;
	      }, new _vector2.default(0, 0));
	      return { COM: sum.div(entities.length).sub(this.p).normalize(),
	        f1: closestfood.copy().sub(this.p).normalize(),
	        f1d: closestfood.copy().sub(this.p).mag() / 141
	      };
	    }
	  }, {
	    key: 'activate',
	    value: function activate(packedInputs) {
	      var output = this.network.activate(packedInputs.x).concat(this.network.activate(packedInputs.y));
	      // var learningRate = .01;
	      // var target = [Math.random(),Math.random()];
	      // this.network.propagate(learningRate, target);
	      return new _vector2.default(output[0] - 0.5, output[1] - 0.5).normalize();
	    }
	  }, {
	    key: 'move',
	    value: function move(a, d, bounds) {
	      var aV = a.normalize();
	      aV.div(2);
	      this.v.add(aV);
	      this.v.normalize();

	      var nextP = this.p.copy().add(this.v.copy().mul(d));
	      if (nextP.dist(this.getClosestWall(bounds)) > this.radius) {
	        this.p = nextP;
	      } else {
	        this.p = this.p.copy().add(this.v.copy().mul(d * -2));
	        // this.v.mul(-1)
	      }
	    }
	  }, {
	    key: 'getGenome',
	    value: function getGenome() {
	      var genome = [];
	      this.network.neurons().forEach(function (o) {
	        for (var type in o.neuron.connections) {
	          if (type !== 'projected') continue;
	          var connection = o.neuron.connections[type];
	          for (var id in connection) {
	            var weight = connection[id].weight;
	            genome.push(weight);
	          }
	        }
	        if (o.layer !== 'input') genome.push(o.neuron.selfconnection.weight);
	      });
	      return genome;
	    }
	  }, {
	    key: 'setGenome',
	    value: function setGenome(genome) {
	      var genome = genome.slice(0); //clone, TODO: find better solution, not efficient
	      this.network.neurons().forEach(function (o) {
	        for (var type in o.neuron.connections) {
	          if (type !== 'projected') continue;
	          var connection = o.neuron.connections[type];
	          for (var id in connection) {
	            var c = connection[id];
	            var weight = genome.shift();
	            c.weight = weight;
	          }
	        }
	        if (o.layer !== 'input') o.neuron.selfconnection.weight = genome.shift();
	      });
	      this.setColor();
	    }
	  }, {
	    key: 'setColor',
	    value: function setColor() {
	      var c = this.getGenome().reduce(function (sum, w, i) {
	        return sum + Math.pow(1.04, i) * w;
	      }, 0);
	      this.hue = Math.abs(c / 500) | 0;
	    }
	  }, {
	    key: 'angle',
	    get: function get() {
	      return this.v.angle();
	    }
	  }]);

	  return Creature;
	}();

	exports.Creature = Creature;
	exports.default = Creature;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.food = undefined;

	var _vector = __webpack_require__(2);

	var _vector2 = _interopRequireDefault(_vector);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var food = function food(p) {
	  _classCallCheck(this, food);

	  this.p = p;
	  this.marked = false;
	};

	exports.food = food;
	exports.default = food;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.buildGeneration = exports.nBest = exports.energyBounds = undefined;

	var _vector = __webpack_require__(2);

	var _vector2 = _interopRequireDefault(_vector);

	var _synaptic = __webpack_require__(3);

	var _synaptic2 = _interopRequireDefault(_synaptic);

	var _creature = __webpack_require__(10);

	var _creature2 = _interopRequireDefault(_creature);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var energyBounds = function energyBounds(entities) {
	  var max = entities.reduce(function (max, e) {
	    return Math.max(max, e.energy);
	  }, 0);
	  var min = entities.reduce(function (min, e) {
	    return Math.min(min, e.energy);
	  }, Infinity);
	  return { max: max, min: min };
	};

	var nBest = function nBest(entities, n) {
	  entities.sort(function (a, b) {
	    return b.energy - a.energy;
	  });
	  var genString = entities.map(function (e, i) {
	    var s = e.energy;
	    if (i === n) {
	      s += ">Cutoff>";
	    }
	    return s;
	  });
	  console.log(genString.join("|"));
	  return entities.slice(0, n);
	};

	var buildGeneration = function buildGeneration(entities, randLoc, factor, snapshots) {
	  // let crossovers = generateCrossovers(entities)
	  // let newborns =crossovers.map(genome=>{
	  //   let newborn = new creature(randLoc())
	  //   newborn.setGenome(genome)
	  //   return newborn
	  // })
	  var asNewborns = distributeChildren(entities, entities.length, factor, randLoc);
	  var PhenoNewborns = generatePhenoChildren(entities, entities.length, factor, randLoc, snapshots);

	  return PhenoNewborns.concat(asNewborns);
	};

	var distributeChildren = function distributeChildren(entities, c, factor, randLoc) {
	  var minEnergy = energyBounds(entities).min;
	  var totalEnergy = entities.reduce(function (sum, e) {
	    return sum + (e.energy - minEnergy);
	  }, 0);
	  var ePc = totalEnergy / c;

	  var children = [];
	  var etoSpend = totalEnergy;
	  var i = 0;
	  while (totalEnergy > 1) {
	    var eEngery = entities[i].energy - minEnergy;
	    while (eEngery > 1) {
	      eEngery -= ePc;
	      var newborn = new _creature2.default(randLoc());
	      newborn.setGenome(mutateGenome(entities[i].getGenome(), factor));
	      children.push(newborn);
	    }
	    totalEnergy -= entities[i].energy - minEnergy;
	    i++;
	  }
	  return children;
	};

	// const generateCrossovers = (entities)=>{
	//   let crossovers = entities.map(e=>{
	//     return crossGenomes(e.getGenome(),
	//                         entities[0].getGenome(),
	//                         Math.random()*0.3)
	//   })
	//   return crossovers
	// }

	var generatePhenoChildren = function generatePhenoChildren(entities, c, factor, randLoc, snapshots) {
	  var minEnergy = energyBounds(entities).min;
	  var totalEnergy = entities.reduce(function (sum, e) {
	    return sum + (e.energy - minEnergy);
	  }, 0);
	  var ePc = totalEnergy / c;

	  var children = [];
	  var etoSpend = totalEnergy;
	  var i = 0;
	  while (totalEnergy > 1) {
	    var eEngery = entities[i].energy - minEnergy;
	    while (eEngery > 1) {
	      eEngery -= ePc;

	      var newborn = new _creature2.default(randLoc());
	      newborn.setGenome(entities[Math.random() * entities.length | 0].getGenome());
	      trainApprentice(entities[i], newborn, snapshots); //todo by reference?
	      children.push(newborn);
	    }
	    totalEnergy -= entities[i].energy - minEnergy;
	    i++;
	  }
	  return children;
	};

	var trainApprentice = function trainApprentice(teacher, apprentice, snapshots) {
	  snapshots.forEach(function (snap) {
	    var learningRate = .01;
	    var xtarget = teacher.network.activate(snap.x);
	    var xresult = apprentice.network.activate(snap.x);
	    apprentice.network.propagate(learningRate, xtarget);

	    var ytarget = teacher.network.activate(snap.y);
	    var yresult = apprentice.network.activate(snap.y);
	    apprentice.network.propagate(learningRate, ytarget);
	  });
	};
	var mutateGenome = function mutateGenome(genome, factor) {
	  var mutated = genome.map(function (weight) {
	    if (weight === undefined) return 0.0;
	    if (Math.random() > factor) return weight;
	    var mW = weight + (Math.random() * factor - factor / 2);
	    mW = Math.max(mW, -.999999);
	    mW = Math.min(mW, .999999);
	    return mW;
	  });
	  return mutated;
	};
	//
	// const crossGenomes = (g1, g2, factor) => {
	//   let glength = g1.length
	//   let crossPoint = Math.random()*glength|0
	//   let newGenomes = [new Array(glength),new Array(glength)]
	//
	//   for(var i =0; i<glength;i++){
	//       let l = 0;
	//       let r = 1;
	//       if(i<crossPoint){
	//         let l = 1;
	//         let r = 0;
	//       }
	//       newGenomes[l][i]= g1[i]
	//       newGenomes[r][i]= g1[i]
	//   }
	//   return mutateGenome(newGenomes[0],factor)
	// }

	exports.energyBounds = energyBounds;
	exports.nBest = nBest;
	exports.buildGeneration = buildGeneration;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.render = undefined;

	var _husl = __webpack_require__(14);

	var _husl2 = _interopRequireDefault(_husl);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var render = function render(ctx, creatures, foods, world, _ref) {
	  var maxEnergy = _ref.max;
	  var minEnergy = _ref.min;
	  var _ctx$canvas = ctx.canvas;
	  var height = _ctx$canvas.height;
	  var width = _ctx$canvas.width;


	  for (var x = 0; x < world.maxTiles.x; x += 1) {
	    for (var y = 0; y < world.maxTiles.y; y += 1) {
	      var bin = world.tiles[x][y];
	      if (bin !== undefined) {
	        ctx.fillStyle = "hsla(" + (180 + bin.length * 10) + ",30%,30%,0.2)";
	      } else ctx.fillStyle = "hsla(180,30%,30%,0.2)";

	      ctx.fillRect(x * world.tileSize, y * world.tileSize, world.tileSize, world.tileSize);
	    }
	  }
	  var sweep = Math.PI / 1.6;
	  ctx.lineWidth = 0.2;

	  ctx.strokeStyle = "#daa";
	  ctx.fillStyle = "#afa";
	  foods.forEach(function (e) {
	    ctx.beginPath();
	    ctx.arc(e.p.x | 0, e.p.y | 0, 2 + 0.5 * Math.random(), 0, Math.PI * 2);
	    ctx.stroke();
	  });
	  // ctx.fill();
	  ctx.lineWidth = 1.7;
	  ctx.strokeStyle = "#aad";
	  creatures.forEach(function (e) {
	    ctx.beginPath();
	    var fitness = Math.max(Math.min((e.energy - minEnergy) / (maxEnergy - minEnergy), 1), 0.1);
	    ctx.fillStyle = _husl2.default.toHex(e.hue | 0, fitness * 99 | 0, 60);
	    // try{}
	    // catch(a){
	    // debugger
	    // }
	    // `hsl(${e.hue},${fitness*99}%,50%)`
	    ctx.arc(e.p.x | 0, e.p.y | 0, e.radius, e.angle - sweep, e.angle + sweep);
	    ctx.stroke();
	    ctx.fill();
	  });
	};

	exports.render = render;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {// Generated by CoffeeScript 1.9.3
	(function() {
	  var L_to_Y, Y_to_L, conv, distanceFromPole, dotProduct, epsilon, fromLinear, getBounds, intersectLineLine, kappa, lengthOfRayUntilIntersect, m, m_inv, maxChromaForLH, maxSafeChromaForL, refU, refV, root, toLinear;

	  m = {
	    R: [3.2409699419045214, -1.5373831775700935, -0.49861076029300328],
	    G: [-0.96924363628087983, 1.8759675015077207, 0.041555057407175613],
	    B: [0.055630079696993609, -0.20397695888897657, 1.0569715142428786]
	  };

	  m_inv = {
	    X: [0.41239079926595948, 0.35758433938387796, 0.18048078840183429],
	    Y: [0.21263900587151036, 0.71516867876775593, 0.072192315360733715],
	    Z: [0.019330818715591851, 0.11919477979462599, 0.95053215224966058]
	  };

	  refU = 0.19783000664283681;

	  refV = 0.468319994938791;

	  kappa = 903.2962962962963;

	  epsilon = 0.0088564516790356308;

	  getBounds = function(L) {
	    var bottom, channel, j, k, len1, len2, m1, m2, m3, ref, ref1, ref2, ret, sub1, sub2, t, top1, top2;
	    sub1 = Math.pow(L + 16, 3) / 1560896;
	    sub2 = sub1 > epsilon ? sub1 : L / kappa;
	    ret = [];
	    ref = ['R', 'G', 'B'];
	    for (j = 0, len1 = ref.length; j < len1; j++) {
	      channel = ref[j];
	      ref1 = m[channel], m1 = ref1[0], m2 = ref1[1], m3 = ref1[2];
	      ref2 = [0, 1];
	      for (k = 0, len2 = ref2.length; k < len2; k++) {
	        t = ref2[k];
	        top1 = (284517 * m1 - 94839 * m3) * sub2;
	        top2 = (838422 * m3 + 769860 * m2 + 731718 * m1) * L * sub2 - 769860 * t * L;
	        bottom = (632260 * m3 - 126452 * m2) * sub2 + 126452 * t;
	        ret.push([top1 / bottom, top2 / bottom]);
	      }
	    }
	    return ret;
	  };

	  intersectLineLine = function(line1, line2) {
	    return (line1[1] - line2[1]) / (line2[0] - line1[0]);
	  };

	  distanceFromPole = function(point) {
	    return Math.sqrt(Math.pow(point[0], 2) + Math.pow(point[1], 2));
	  };

	  lengthOfRayUntilIntersect = function(theta, line) {
	    var b1, len, m1;
	    m1 = line[0], b1 = line[1];
	    len = b1 / (Math.sin(theta) - m1 * Math.cos(theta));
	    if (len < 0) {
	      return null;
	    }
	    return len;
	  };

	  maxSafeChromaForL = function(L) {
	    var b1, j, len1, lengths, m1, ref, ref1, x;
	    lengths = [];
	    ref = getBounds(L);
	    for (j = 0, len1 = ref.length; j < len1; j++) {
	      ref1 = ref[j], m1 = ref1[0], b1 = ref1[1];
	      x = intersectLineLine([m1, b1], [-1 / m1, 0]);
	      lengths.push(distanceFromPole([x, b1 + x * m1]));
	    }
	    return Math.min.apply(Math, lengths);
	  };

	  maxChromaForLH = function(L, H) {
	    var hrad, j, l, len1, lengths, line, ref;
	    hrad = H / 360 * Math.PI * 2;
	    lengths = [];
	    ref = getBounds(L);
	    for (j = 0, len1 = ref.length; j < len1; j++) {
	      line = ref[j];
	      l = lengthOfRayUntilIntersect(hrad, line);
	      if (l !== null) {
	        lengths.push(l);
	      }
	    }
	    return Math.min.apply(Math, lengths);
	  };

	  dotProduct = function(a, b) {
	    var i, j, ref, ret;
	    ret = 0;
	    for (i = j = 0, ref = a.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
	      ret += a[i] * b[i];
	    }
	    return ret;
	  };

	  fromLinear = function(c) {
	    if (c <= 0.0031308) {
	      return 12.92 * c;
	    } else {
	      return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
	    }
	  };

	  toLinear = function(c) {
	    var a;
	    a = 0.055;
	    if (c > 0.04045) {
	      return Math.pow((c + a) / (1 + a), 2.4);
	    } else {
	      return c / 12.92;
	    }
	  };

	  conv = {
	    'xyz': {},
	    'luv': {},
	    'lch': {},
	    'husl': {},
	    'huslp': {},
	    'rgb': {},
	    'hex': {}
	  };

	  conv.xyz.rgb = function(tuple) {
	    var B, G, R;
	    R = fromLinear(dotProduct(m.R, tuple));
	    G = fromLinear(dotProduct(m.G, tuple));
	    B = fromLinear(dotProduct(m.B, tuple));
	    return [R, G, B];
	  };

	  conv.rgb.xyz = function(tuple) {
	    var B, G, R, X, Y, Z, rgbl;
	    R = tuple[0], G = tuple[1], B = tuple[2];
	    rgbl = [toLinear(R), toLinear(G), toLinear(B)];
	    X = dotProduct(m_inv.X, rgbl);
	    Y = dotProduct(m_inv.Y, rgbl);
	    Z = dotProduct(m_inv.Z, rgbl);
	    return [X, Y, Z];
	  };

	  Y_to_L = function(Y) {
	    if (Y <= epsilon) {
	      return Y * kappa;
	    } else {
	      return 116 * Math.pow(Y, 1 / 3) - 16;
	    }
	  };

	  L_to_Y = function(L) {
	    if (L <= 8) {
	      return L / kappa;
	    } else {
	      return Math.pow((L + 16) / 116, 3);
	    }
	  };

	  conv.xyz.luv = function(tuple) {
	    var L, U, V, X, Y, Z, varU, varV;
	    X = tuple[0], Y = tuple[1], Z = tuple[2];
	    if (Y === 0) {
	      return [0, 0, 0];
	    }
	    L = Y_to_L(Y);
	    varU = (4 * X) / (X + (15 * Y) + (3 * Z));
	    varV = (9 * Y) / (X + (15 * Y) + (3 * Z));
	    U = 13 * L * (varU - refU);
	    V = 13 * L * (varV - refV);
	    return [L, U, V];
	  };

	  conv.luv.xyz = function(tuple) {
	    var L, U, V, X, Y, Z, varU, varV;
	    L = tuple[0], U = tuple[1], V = tuple[2];
	    if (L === 0) {
	      return [0, 0, 0];
	    }
	    varU = U / (13 * L) + refU;
	    varV = V / (13 * L) + refV;
	    Y = L_to_Y(L);
	    X = 0 - (9 * Y * varU) / ((varU - 4) * varV - varU * varV);
	    Z = (9 * Y - (15 * varV * Y) - (varV * X)) / (3 * varV);
	    return [X, Y, Z];
	  };

	  conv.luv.lch = function(tuple) {
	    var C, H, Hrad, L, U, V;
	    L = tuple[0], U = tuple[1], V = tuple[2];
	    C = Math.sqrt(Math.pow(U, 2) + Math.pow(V, 2));
	    if (C < 0.00000001) {
	      H = 0;
	    } else {
	      Hrad = Math.atan2(V, U);
	      H = Hrad * 360 / 2 / Math.PI;
	      if (H < 0) {
	        H = 360 + H;
	      }
	    }
	    return [L, C, H];
	  };

	  conv.lch.luv = function(tuple) {
	    var C, H, Hrad, L, U, V;
	    L = tuple[0], C = tuple[1], H = tuple[2];
	    Hrad = H / 360 * 2 * Math.PI;
	    U = Math.cos(Hrad) * C;
	    V = Math.sin(Hrad) * C;
	    return [L, U, V];
	  };

	  conv.husl.lch = function(tuple) {
	    var C, H, L, S, max;
	    H = tuple[0], S = tuple[1], L = tuple[2];
	    if (L > 99.9999999 || L < 0.00000001) {
	      C = 0;
	    } else {
	      max = maxChromaForLH(L, H);
	      C = max / 100 * S;
	    }
	    return [L, C, H];
	  };

	  conv.lch.husl = function(tuple) {
	    var C, H, L, S, max;
	    L = tuple[0], C = tuple[1], H = tuple[2];
	    if (L > 99.9999999 || L < 0.00000001) {
	      S = 0;
	    } else {
	      max = maxChromaForLH(L, H);
	      S = C / max * 100;
	    }
	    return [H, S, L];
	  };

	  conv.huslp.lch = function(tuple) {
	    var C, H, L, S, max;
	    H = tuple[0], S = tuple[1], L = tuple[2];
	    if (L > 99.9999999 || L < 0.00000001) {
	      C = 0;
	    } else {
	      max = maxSafeChromaForL(L);
	      C = max / 100 * S;
	    }
	    return [L, C, H];
	  };

	  conv.lch.huslp = function(tuple) {
	    var C, H, L, S, max;
	    L = tuple[0], C = tuple[1], H = tuple[2];
	    if (L > 99.9999999 || L < 0.00000001) {
	      S = 0;
	    } else {
	      max = maxSafeChromaForL(L);
	      S = C / max * 100;
	    }
	    return [H, S, L];
	  };

	  conv.rgb.hex = function(tuple) {
	    var ch, hex, j, len1;
	    hex = "#";
	    for (j = 0, len1 = tuple.length; j < len1; j++) {
	      ch = tuple[j];
	      ch = Math.round(ch * 1e6) / 1e6;
	      if (ch < 0 || ch > 1) {
	        throw new Error("Illegal rgb value: " + ch);
	      }
	      ch = Math.round(ch * 255).toString(16);
	      if (ch.length === 1) {
	        ch = "0" + ch;
	      }
	      hex += ch;
	    }
	    return hex;
	  };

	  conv.hex.rgb = function(hex) {
	    var b, g, j, len1, n, r, ref, results;
	    if (hex.charAt(0) === "#") {
	      hex = hex.substring(1, 7);
	    }
	    r = hex.substring(0, 2);
	    g = hex.substring(2, 4);
	    b = hex.substring(4, 6);
	    ref = [r, g, b];
	    results = [];
	    for (j = 0, len1 = ref.length; j < len1; j++) {
	      n = ref[j];
	      results.push(parseInt(n, 16) / 255);
	    }
	    return results;
	  };

	  conv.lch.rgb = function(tuple) {
	    return conv.xyz.rgb(conv.luv.xyz(conv.lch.luv(tuple)));
	  };

	  conv.rgb.lch = function(tuple) {
	    return conv.luv.lch(conv.xyz.luv(conv.rgb.xyz(tuple)));
	  };

	  conv.husl.rgb = function(tuple) {
	    return conv.lch.rgb(conv.husl.lch(tuple));
	  };

	  conv.rgb.husl = function(tuple) {
	    return conv.lch.husl(conv.rgb.lch(tuple));
	  };

	  conv.huslp.rgb = function(tuple) {
	    return conv.lch.rgb(conv.huslp.lch(tuple));
	  };

	  conv.rgb.huslp = function(tuple) {
	    return conv.lch.huslp(conv.rgb.lch(tuple));
	  };

	  root = {};

	  root.fromRGB = function(R, G, B) {
	    return conv.rgb.husl([R, G, B]);
	  };

	  root.fromHex = function(hex) {
	    return conv.rgb.husl(conv.hex.rgb(hex));
	  };

	  root.toRGB = function(H, S, L) {
	    return conv.husl.rgb([H, S, L]);
	  };

	  root.toHex = function(H, S, L) {
	    return conv.rgb.hex(conv.husl.rgb([H, S, L]));
	  };

	  root.p = {};

	  root.p.toRGB = function(H, S, L) {
	    return conv.xyz.rgb(conv.luv.xyz(conv.lch.luv(conv.huslp.lch([H, S, L]))));
	  };

	  root.p.toHex = function(H, S, L) {
	    return conv.rgb.hex(conv.xyz.rgb(conv.luv.xyz(conv.lch.luv(conv.huslp.lch([H, S, L])))));
	  };

	  root.p.fromRGB = function(R, G, B) {
	    return conv.lch.huslp(conv.luv.lch(conv.xyz.luv(conv.rgb.xyz([R, G, B]))));
	  };

	  root.p.fromHex = function(hex) {
	    return conv.lch.huslp(conv.luv.lch(conv.xyz.luv(conv.rgb.xyz(conv.hex.rgb(hex)))));
	  };

	  root._conv = conv;

	  root._getBounds = getBounds;

	  root._maxChromaForLH = maxChromaForLH;

	  root._maxSafeChromaForL = maxSafeChromaForL;

	  if (!((typeof module !== "undefined" && module !== null) || (typeof jQuery !== "undefined" && jQuery !== null) || (typeof requirejs !== "undefined" && requirejs !== null))) {
	    this.HUSL = root;
	  }

	  if (typeof module !== "undefined" && module !== null) {
	    module.exports = root;
	  }

	  if (typeof jQuery !== "undefined" && jQuery !== null) {
	    jQuery.husl = root;
	  }

	  if ((typeof requirejs !== "undefined" && requirejs !== null) && ("function" !== "undefined" && __webpack_require__(15) !== null)) {
	    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (root), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }

	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)(module)))

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },
/* 16 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ui = function () {
	  function ui() {
	    var _this = this;

	    _classCallCheck(this, ui);

	    this.speedSlider = document.getElementById("speed");
	    this.mutationSlider = document.getElementById("mutation");
	    this.generation = document.getElementById("generation");
	    this.mrElement = document.getElementById("mr");
	    this.triggerG = document.getElementById("triggerG");
	    this.newG = false;
	    this.speed = this.getSpeed();
	    this.mutationRate = this.getMutation();
	    this.g = 0;
	    this.speedSlider.addEventListener("input", function () {
	      _this.speed = _this.getSpeed();
	    });
	    this.mutationSlider.addEventListener("input", function () {
	      _this.mutationRate = _this.getMutation();
	    });
	    this.triggerG.addEventListener("click", function () {
	      _this.newG = true;
	    });
	  }

	  _createClass(ui, [{
	    key: "incGeneration",
	    value: function incGeneration() {
	      this.g++;
	      this.generation.innerHTML = this.g.toString();
	    }
	  }, {
	    key: "getSpeed",
	    value: function getSpeed() {
	      return this.shapeSpeed(this.speedSlider.valueAsNumber);
	    }
	  }, {
	    key: "getMutation",
	    value: function getMutation() {
	      var rate = this.mutationSlider.valueAsNumber / 100;
	      var rateAsText = "Low";
	      if (rate > 0.2) rateAsText = "Moderate";
	      if (rate > 0.5) rateAsText = "High";
	      if (rate > 0.8) rateAsText = "Extreme";
	      this.mrElement.innerHTML = rateAsText;
	      return rate;
	    }
	  }, {
	    key: "shapeSpeed",
	    value: function shapeSpeed(raw) {
	      return (Math.pow(raw / 10, 1.6) | 0) + 1;
	    }
	  }, {
	    key: "shouldNG",
	    value: function shouldNG() {
	      var ng = this.newG;
	      this.newG = false;
	      return ng;
	    }
	  }]);

	  return ui;
	}();

	exports.ui = ui;
	exports.default = ui;

/***/ }
/******/ ]);