(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("src/Data.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

var _Tileset = require('./Tools/Tileset');

var _Tileset2 = _interopRequireDefault(_Tileset);

var _Settings = require('./Tools/Settings');

var _Settings2 = _interopRequireDefault(_Settings);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var Data = function () {
	function Data() {
		_classCallCheck(this, Data);
	}

	_createClass(Data, null, [{
		key: 'init',
		value: function init(onInitialized) {
			window.onresize = Data._onWindowResize;
			Data._initGameInformation();
			Data._loadTiles(onInitialized);
			Data._loadSettings();
			Data._loadSounds();
			Data._loadMusics();
			return Data._getCanvasContext();
		}
	}, {
		key: '_initGameInformation',
		value: function _initGameInformation() {
			Data.information = {};
		}
	}, {
		key: '_loadSounds',
		value: function _loadSounds() {
			var path = "data/sounds/effects/";
			Data.sounds = {
				gameEnded: new Audio(path + "game-ended.ogg"),
				gameOver: new Audio(path + "game-over.ogg"),
				getReady: new Audio(path + "get-ready.ogg"),
				lastLife: new Audio(path + "last-life.ogg"),
				levelUp: new Audio(path + "level-up.ogg"),
				wallCollision: new Audio(path + "wall-collision.ogg"),
				wallExplosion: new Audio(path + "wall-explosion.ogg"),
				orbSpawn: new Audio(path + "orb-new.ogg"),
				orbBonus: new Audio(path + "orb-bonus.ogg"),
				orbStop: new Audio(path + "orb-stop.ogg")
			};
			Object.keys(Data.sounds).forEach(function (k) {
				return Data.sounds[k].volume = Data.settings.current.effectVolume;
			});
		}
	}, {
		key: '_loadMusics',
		value: function _loadMusics() {
			var path = "data/sounds/musics/";
			Data.musics = {};
			Data.musics.game = [new Audio(path + "game/SyncroSonic.ogg"), new Audio(path + "game/beyond black hole (220v).ogg")];
			//Data.musics.menu = new Audio(path + "menu/Check the Map !!.ogg")
			Data.musics.game.forEach(function (m) {
				return m.volume = Data.settings.current.musicVolume;
			});
			//Data.musics.menu.volume = Data.settings.current.musicVolume
		}
	}, {
		key: '_loadSettings',
		value: function _loadSettings() {
			Data.settings = new _Settings2.default({
				effectVolume: 0.0,
				musicVolume: 0.0
			});
		}
	}, {
		key: '_getCanvasContext',
		value: function _getCanvasContext() {
			if ((Data.canvas = document.getElementById(Data.canvasName)) && (Data.context = Data.canvas.getContext('2d'))) {
				Data.canvas.onmousemove = Data._onMouseMove;
				Data._createBackground();
				Data._onWindowResize();
				return true;
			}
			alert(!Data.canvas ? "Impossible de récupérer le canvas" : "Impossible de récupérer le context du canvas");
			return false;
		}
	}, {
		key: '_createBackground',
		value: function _createBackground() {
			Data.backgroundCanvas = document.createElement('canvas');
			Data.background = Data.backgroundCanvas.getContext('2d');
		}
	}, {
		key: '_resizeBackground',
		value: function _resizeBackground() {
			Data.backgroundCanvas.width = Data.canvas.width;
			Data.backgroundCanvas.height = Data.canvas.height;
		}
	}, {
		key: '_onWindowResize',
		value: function _onWindowResize() {
			var oldBounds = Data.bounds;
			Data._setScreenConstants(window.innerWidth, window.innerHeight);
			Data._setTextConstants();
			Data._resizeBackground();
			if (Data.onWindowResize) Data.onWindowResize(Data.bounds.x.min - oldBounds.x.min, Data.bounds.y.min - oldBounds.y.min);
		}
	}, {
		key: '_setScreenConstants',
		value: function _setScreenConstants(width, height) {
			Data.borders = {
				x: (width - Data.width) / 2,
				y: (height - Data.height) / 2
			};
			Data.bounds = {
				x: { min: Data.borders.x, max: Data.width + Data.borders.x },
				y: { min: Data.borders.y, max: Data.height + Data.borders.y }
			};
			Data.middle = {
				x: Data.bounds.x.min + (Data.bounds.x.max - Data.bounds.x.min) / 2,
				y: Data.bounds.y.min + (Data.bounds.y.max - Data.bounds.y.min) / 2
			};
			Data.canvas.width = width;
			Data.canvas.height = height;
		}
	}, {
		key: '_setTextConstants',
		value: function _setTextConstants() {
			var textSize = 30;
			Data.text = {
				x: Data.bounds.x.max + Data.borders.x / 10,
				y: Data.borders.y + textSize,
				size: textSize,
				font: textSize + "px Verdana"
			};
		}
	}, {
		key: '_onMouseMove',
		value: function _onMouseMove(event) {
			var rect = Data.canvas.getBoundingClientRect();
			Data.mouseX = event.pageX - window.pageXOffset - rect.left;
			Data.mouseY = event.pageY - window.pageYOffset - rect.top;
		}
	}, {
		key: '_loadTiles',
		value: function _loadTiles(onInitialized) {
			Data.tileset = new _Tileset2.default("data/assets.png");
			Data.wallSprites = null;
			Data.orbSprites = null;
			Data.tileset.tileset.onload = function () {
				Data.wallSprites = Data.tileset.getTiles(40, 40, 0, 0);
				Data.orbSprites = Data.tileset.getTiles(25, 25, 200, 0);
				onInitialized(Data);
			};
		}
	}]);

	return Data;
}();

exports.default = Data;

Data.onWindowResize = null;
Data.frameTime = null;
Data.canvasName = "WallFallCanvas";
Data.width = 700;
Data.height = 700;
Data.now = new Date().getTime();

});

require.register("src/Game.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

var _Random = require('./Tools/Random');

var _Random2 = _interopRequireDefault(_Random);

var _Pool = require('./GameObject/Pool');

var _Pool2 = _interopRequireDefault(_Pool);

var _Pools = require('./GameObject/Pools');

var _Pools2 = _interopRequireDefault(_Pools);

var _New = require('./GameObject/New');

var _New2 = _interopRequireDefault(_New);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var Game = function () {
	function Game(data) {
		var _this = this;

		_classCallCheck(this, Game);

		this.data = data;
		this.data.game = {
			levelStep: 0,
			durations: {
				clearScreen: 0,
				resizeWall: 0,
				hideWall: 0,
				stopWall: 0,
				slowWall: 0
			}
		};
		_New2.default.init(data);
		this.stop = false;
		this.pause = false;
		this.ended = false;
		this.lastBonus = null;
		this.levelStepMax = 5;
		this.levelMax = (_New.spawnOrder.length - 1) * this.levelStepMax;
		this.bonusMax = _New.bonusOrbs.length - 1;
		this.levelStep = 0;
		this.data.onWindowResize = function (x, y) {
			return _this._onWindowResize(x, y);
		};
		this.context = data.context;
		this.music = this.data.musics.game[_Random2.default.range(0, this.data.musics.game.length - 1)];
		this.music.loop = true;
		this.previousSecond = this.data.now;
		this.i_background = 0;
		this._poolValues = Object.keys(_Pool2.default.pools).map(function (k) {
			return _Pool2.default.pools[k];
		});
		this._initBonusRules();
		this._drawBackground();
	}

	_createClass(Game, [{
		key: 'start',
		value: function start() {
			this.music.play();
			_New2.default.Player();
			_New2.default.Orb();
			this._loop();
		}
	}, {
		key: '_loop',
		value: function _loop() {
			var _this2 = this;

			if (!this.pause) this._update();
			this._draw();
			if (!this.stop) requestAnimationFrame(function () {
				return _this2._loop();
			});
		}
	}, {
		key: '_update',
		value: function _update() {
			var _this3 = this;

			this.data.now = new Date().getTime();
			// if (1000 <= this.data.now - this.previousSecond)
			// 	this._updateBackground()
			if (this.data.frameTime === null) this._getFrameTime();
			this._updateLevel();
			if (_Random2.default.random() < _Pools2.default.Wall.length / 10000) this._spawnBonus();
			Object.keys(this.data.game.durations).forEach(function (k) {
				return 0 < _this3.data.game.durations[k] && (_this3.data.game.durations[k] -= 1);
			});
			this._poolValues.forEach(function (p) {
				return p.forEach(function (o) {
					return o.update();
				});
			});
			this._checkEndGame();
		}
	}, {
		key: '_spawnBonus',
		value: function _spawnBonus() {
			var bonus = null;
			var player = _Pools2.default.Player.get(0);
			var wallLength = _Pools2.default.Wall.length;
			while (bonus === null) {
				bonus = _New.bonusOrbs[_Random2.default.range(0, this.bonusMax)];
				for (var i = 0; i < this._bonusRules.length; ++i) {
					if (this._bonusRules[i](bonus, player, wallLength)) {
						bonus = null;
						break;
					}
				}
			}
			(this.lastBonus = bonus)();
		}
	}, {
		key: '_initBonusRules',
		value: function _initBonusRules() {
			var _this4 = this;

			this._bonusRules = [function (b) {
				return _this4.lastBonus === b;
			}, function (b, p, wLen) {
				return _New2.default.LifeOrb === b && 3 <= p.lives;
			}, function (b, p, wLen) {
				return _New2.default.BerserkOrb === b && wLen <= 5;
			}, function (b, p, wLen) {
				return _New2.default.DestroyerOrb === b && wLen <= 10;
			}, function (b, p, wLen) {
				return _New2.default.TimeOrb === b && 120 <= p.countdown;
			}, function (b, p, wLen) {
				return _New2.default.SpeedOrb === b && 30 <= p.maxSpeed;
			}, function (b, p, wLen) {
				return (_New2.default.StopOrb === b || _New2.default.SlowdownOrb === b) && 0 < _this4.data.game.durations.stopWall + _this4.data.game.durations.slowWall;
			}];
		}
	}, {
		key: '_updateLevel',
		value: function _updateLevel() {
			if (0 < this.data.game.levelStep) {
				if (this.levelStep === 0) {
					var index = this.data.information.level++;
					var lastWall = this.levelMax <= index ? _New.spawnOrder.length - 1 : index / this.levelStepMax;
					if (index % this.levelStepMax === 0) index = lastWall;else {
						index = _Random2.default.random() * 100;
						index = 50 < index ? lastWall : index / 50 * lastWall;
					}
					_New.spawnOrder[index | 0]();
				}
				this.levelStep = (this.levelStep + 1) % this.levelStepMax;
				this.data.game.levelStep--;
			}
		}
	}, {
		key: '_updateGameInformation',
		value: function _updateGameInformation() {
			var _this5 = this;

			this.data.context.drawImage(this.data.backgroundCanvas, this.textRect.x, this.textRect.y, this.textRect.w, this.textRect.h, this.textRect.x, this.textRect.y, this.textRect.w, this.textRect.h);
			this.data.context.font = this.data.text.font;
			this.data.context.fillStyle = "black";
			var y = -this.data.text.size;
			Object.keys(this.data.information).forEach(function (k) {
				return _this5.data.context.fillText(typeof _this5.data.information[k] !== 'function' ? _this5.data.information[k] | 0 : _this5.data.information[k]() | 0, _this5.data.text.x + _this5.data.text.size * 3, _this5.data.text.y + (y += _this5.data.text.size));
			});
		}
	}, {
		key: '_getFrameTime',
		value: function _getFrameTime() {
			if (this._frameStart) this.data.frameTime = (new Date().getTime() - this._frameStart) / 1000;else this._frameStart = new Date().getTime();
		}
	}, {
		key: '_draw',
		value: function _draw() {
			this._poolValues.forEach(function (p) {
				return p.forEach(function (o) {
					return o.draw();
				});
			});
			this._updateGameInformation();
		}
	}, {
		key: '_drawBackground',
		value: function _drawBackground() {
			this.data.background.fillStyle = "gray";
			this.data.background.fillRect(0, 0, this.data.backgroundCanvas.width, this.data.backgroundCanvas.height);
			this.data.background.fillStyle = "black";
			this.data.background.fillRect(this.data.bounds.x.min, this.data.bounds.y.min, this.data.width, this.data.height);
			this.data.context.drawImage(this.data.backgroundCanvas, 0, 0);
			this._gameInformation();
			this._drawGameInformationLabels();
		}
	}, {
		key: '_updateBackground',
		value: function _updateBackground() {
			this.data.background.fillStyle = "black";
			this.data.background.fillRect(this.data.bounds.x.min, this.data.bounds.y.min, this.data.width, this.data.height);
		}
	}, {
		key: '_gameInformation',
		value: function _gameInformation() {
			var getValue = function getValue(v) {
				return function () {
					return _Pool2.default.pools.Player.get(0)[v];
				};
			};
			this.data.information = {
				score: getValue("score"),
				time: getValue("countdown"),
				lives: getValue("lives"),
				level: 0
			};
			this.textRect = {
				x: this.data.text.x + this.data.text.size * 3,
				y: this.data.text.y - this.data.text.size,
				h: Object.keys(this.data.information).length * this.data.text.size
			};
			this.textRect.w = this.data.canvas.width - this.textRect.x;
		}
	}, {
		key: '_drawGameInformationLabels',
		value: function _drawGameInformationLabels() {
			var _this6 = this;

			var contexts = [this.data.background, this.data.context];
			contexts.forEach(function (c) {
				c.font = _this6.data.text.font;
				c.fillStyle = "black";
				var y = -_this6.data.text.size;
				Object.keys(_this6.data.information).forEach(function (k) {
					return c.fillText(k + ":", _this6.data.text.x, _this6.data.text.y + (y += _this6.data.text.size));
				});
			});
		}
	}, {
		key: '_checkEndGame',
		value: function _checkEndGame() {
			if (!this.ended && _Pools2.default.Player.length == 0) this._end();
		}
	}, {
		key: '_onWindowResize',
		value: function _onWindowResize(offsetX, offsetY) {
			this._poolValues.forEach(function (p) {
				return p.forEach(function (o) {
					o.x += offsetX;
					o.y += offsetY;
				});
			});
			this._drawBackground();
		}
	}, {
		key: '_end',
		value: function _end() {
			this.data.sounds.gameOver.play();
			this.data.sounds.gameEnded.play();
			this.ended = true;
		}
	}]);

	return Game;
}();

exports.default = Game;

});

require.register("src/GameObject/Behaviors.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {};

});

require.register("src/GameObject/Explosion.js", function(exports, require, module) {
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _MathTools = require('../Tools/MathTools');

var _MathTools2 = _interopRequireDefault(_MathTools);

var _Color = require('../Tools/Color');

var _Color2 = _interopRequireDefault(_Color);

var _Random = require('../Tools/Random');

var _Random2 = _interopRequireDefault(_Random);

var _GameObjectBehavior2 = require('./GameObjectBehavior');

var _GameObjectBehavior3 = _interopRequireDefault(_GameObjectBehavior2);

var _New = require('./New');

var _New2 = _interopRequireDefault(_New);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Explosion = function (_GameObjectBehavior) {
    _inherits(Explosion, _GameObjectBehavior);

    function Explosion() {
        _classCallCheck(this, Explosion);

        return _possibleConstructorReturn(this, (Explosion.__proto__ || Object.getPrototypeOf(Explosion)).apply(this, arguments));
    }

    _createClass(Explosion, [{
        key: 'init',
        value: function init(self, x, y) {
            var width = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 25;
            var color = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '#ffffff';
            var isSquare = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
            var particleSpeed = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 5;
            var decreasingSpeed = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0.5;
            var colorGap = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 30;

            self.x = x;
            self.y = y;
            self.decreasingSpeed = decreasingSpeed;
            self.particleSpeed = particleSpeed;
            self.width = width;
            self.height = width;
            self.radius = width / 2;
            self.color = color;
            self.isSquare = isSquare;
            self.colorGap = colorGap;
            self.rgb = _Color2.default.hexToRgb(color);
            for (var i = 0; i < 3; ++i) {
                if (self.rgb[i] + self.colorGap > 255) self.rgb[i] = 255 - self.colorGap;else if (self.rgb[i] - self.colorGap < 0) self.rgb[i] = self.colorGap;
            }
        }
    }, {
        key: 'update',
        value: function update(self) {
            self.x += self.decreasingSpeed;
            self.y += self.decreasingSpeed;
            self.radius -= self.decreasingSpeed;
            self.height = self.width = self.radius * 2;
            if (self.radius <= 0) self.destroy();else {
                var x = self.x + _Random2.default.range(-self.radius, self.radius);
                var y = self.y + _Random2.default.range(-self.radius, self.radius);
                var direction = _MathTools2.default.direction(self.x, self.y, x, y);
                var speed = self.particleSpeed * _MathTools2.default.squareDistance(self.x, self.y, x, y) / (self.radius * self.radius);
                var color = _Color2.default.rgbToHex(self.rgb[0] + _Random2.default.range(0, self.colorGap), self.rgb[1] + _Random2.default.range(0, self.colorGap), self.rgb[2] + _Random2.default.range(0, self.colorGap));
                _New2.default.Particle(x, y, direction, speed, self.width, self.color, self.isSquare, self.decreasingSpeed);
            }
        }
    }, {
        key: 'draw',
        value: function draw(self) {
            self.data.context.fillStyle = self.color;
            if (self.isSquare) self.data.context.fillRect(self.x | 0, self.y | 0, self.width | 0, self.height | 0);else {
                self.data.context.beginPath();
                self.data.context.arc(self.x + self.radius | 0, self.y + self.radius | 0, self.radius, 0, this.fullCircle);
                self.data.context.fill();
            }
        }
    }]);

    return Explosion;
}(_GameObjectBehavior3.default);

exports.default = Explosion;

});

require.register("src/GameObject/GameObject.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var GameObject = function () {
	function GameObject(pool, data) {
		_classCallCheck(this, GameObject);

		this._pool = pool;
		this.initialized = false;
		this.data = data;
		this.x = 0;
		this.y = 0;
		this.width = 0;
		this.height = 0;
		this.sprite = null;
		this.color = '#ffffff';
		this.direction = 0;
		this.speed = 0;
		this.behavior = null;
		this._clearScreen = true;
		this._rectToClean = {};
		this._precalcul = {};
		this._updateRectToClean();
		this._updatePrecalcul();
	}

	_createClass(GameObject, [{
		key: 'isInside',
		value: function isInside() {
			return this.data.bounds.x.min <= this._precalcul.x_w && this.x < this.data.bounds.x.max && this.data.bounds.y.min <= this._precalcul.y_h && this.y < this.data.bounds.y.max;
		}
	}, {
		key: 'isOnTheEdge',
		value: function isOnTheEdge() {
			return Math.abs(this._precalcul.x_w - this.data.bounds.x.min) < this.width || Math.abs(this.x - this.data.bounds.x.max) < this.width || Math.abs(this._precalcul.y_h - this.data.bounds.y.min) < this.height || Math.abs(this.y - this.data.bounds.y.max) < this.height;
		}
	}, {
		key: 'init',
		value: function init(behavior) {
			var _behavior;

			this.behavior = behavior;
			this.initialized = false;

			for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				args[_key - 1] = arguments[_key];
			}

			(_behavior = this.behavior).init.apply(_behavior, [this].concat(args));
			this.initialized = true;
		}
	}, {
		key: 'update',
		value: function update() {
			this._updateRectToClean();
			this.behavior.update(this);
			if (this.data.game.durations.clearScreen <= 0) this.cleanDrawing();
		}
	}, {
		key: 'draw',
		value: function draw() {
			this._updatePrecalcul();
			if (this.isInside()) {
				this.behavior.draw(this);
				if (this.isOnTheEdge()) this._drawCut();
			}
		}
	}, {
		key: 'cleanDrawing',
		value: function cleanDrawing() {
			if (this._clearScreen) this.data.context.drawImage(this.data.backgroundCanvas, this._rectToClean.x, this._rectToClean.y, this._rectToClean.w, this._rectToClean.h, this._rectToClean.x, this._rectToClean.y, this._rectToClean.w, this._rectToClean.h);
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			this.behavior.destroy(this);
			this.cleanDrawing();
			this._pool.remove(this);
			this.behavior = null;
		}
	}, {
		key: '_drawCut',
		value: function _drawCut() {
			var x = this.x | 0;
			var y = this.y | 0;
			var w = this.width;
			var h = this.height;
			if (this.x < this.data.bounds.x.min) w = this.data.bounds.x.min - this.x | 0;
			if (this.y < this.data.bounds.y.min) h = this.data.bounds.y.min - this.y | 0;
			if (this.data.bounds.x.max <= this._precalcul.x_w) {
				x = this.data.bounds.x.max;
				w = this._precalcul.x_w - this.data.bounds.x.max | 0;
			}
			if (this.data.bounds.y.max <= this._precalcul.y_h) {
				y = this.data.bounds.y.max;
				h = this._precalcul.y_h - this.data.bounds.y.max | 0;
			}
			this.data.context.drawImage(this.data.backgroundCanvas, x, y, w, h, x, y, w, h);
		}
	}, {
		key: '_updateRectToClean',
		value: function _updateRectToClean() {
			if (this.behavior) this.behavior.updateRectToClean(this, this._rectToClean);else {
				this._rectToClean.x = this.x - 1 | 0;
				this._rectToClean.y = this.y - 1 | 0;
				this._rectToClean.w = this.width + 2 | 0;
				this._rectToClean.h = this.height + 2 | 0;
			}
		}
	}, {
		key: '_updatePrecalcul',
		value: function _updatePrecalcul() {
			this._precalcul.x_w = this.x + this.width;
			this._precalcul.y_h = this.y + this.height;
		}
	}]);

	return GameObject;
}();

exports.default = GameObject;

});

require.register("src/GameObject/GameObjectBehavior.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

var _MathTools = require('../Tools/MathTools');

var _MathTools2 = _interopRequireDefault(_MathTools);

var _Pool = require('./Pool');

var _Pool2 = _interopRequireDefault(_Pool);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var GameObjectBehavior = function () {
	function GameObjectBehavior() {
		_classCallCheck(this, GameObjectBehavior);

		this.poolName = this.constructor.name;
	}

	_createClass(GameObjectBehavior, [{
		key: 'init',
		value: function init(self) {}
	}, {
		key: 'update',
		value: function update(self) {
			if (self.speed) {
				var rad = _MathTools2.default.rads(self.direction);
				self.x += Math.cos(rad) * self.speed;
				self.y -= Math.sin(rad) * self.speed;
			}
		}
	}, {
		key: 'draw',
		value: function draw(self) {
			self.data.context.drawImage(self.sprite, self.x | 0, self.y | 0);
		}
	}, {
		key: 'updateRectToClean',
		value: function updateRectToClean(self, rect) {
			rect.x = self.x - 1 | 0;
			rect.y = self.y - 1 | 0;
			rect.w = self.width + 2 | 0;
			rect.h = self.height + 2 | 0;
		}
	}, {
		key: 'destroy',
		value: function destroy(self) {}
	}]);

	return GameObjectBehavior;
}();

exports.default = GameObjectBehavior;

});

require.register("src/GameObject/New.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.bonusOrbs = exports.spawnOrder = undefined;

var _Pool = require('./Pool');

var _Pool2 = _interopRequireDefault(_Pool);

var _Behaviors = require('./Behaviors');

var _Behaviors2 = _interopRequireDefault(_Behaviors);

var _Player = require('./Player');

var _Player2 = _interopRequireDefault(_Player);

var _Particle = require('./Particle');

var _Particle2 = _interopRequireDefault(_Particle);

var _Explosion = require('./Explosion');

var _Explosion2 = _interopRequireDefault(_Explosion);

var _Orb = require('./Orb/Orb');

var _Orb2 = _interopRequireDefault(_Orb);

var _BerserkOrb = require('./Orb/BerserkOrb');

var _BerserkOrb2 = _interopRequireDefault(_BerserkOrb);

var _DestroyerOrb = require('./Orb/DestroyerOrb');

var _DestroyerOrb2 = _interopRequireDefault(_DestroyerOrb);

var _GodOrb = require('./Orb/GodOrb');

var _GodOrb2 = _interopRequireDefault(_GodOrb);

var _LifeOrb = require('./Orb/LifeOrb');

var _LifeOrb2 = _interopRequireDefault(_LifeOrb);

var _ScoreOrb = require('./Orb/ScoreOrb');

var _ScoreOrb2 = _interopRequireDefault(_ScoreOrb);

var _SlowdownOrb = require('./Orb/SlowdownOrb');

var _SlowdownOrb2 = _interopRequireDefault(_SlowdownOrb);

var _SpeedOrb = require('./Orb/SpeedOrb');

var _SpeedOrb2 = _interopRequireDefault(_SpeedOrb);

var _StopOrb = require('./Orb/StopOrb');

var _StopOrb2 = _interopRequireDefault(_StopOrb);

var _TimeOrb = require('./Orb/TimeOrb');

var _TimeOrb2 = _interopRequireDefault(_TimeOrb);

var _Wall = require('./Wall/Wall');

var _Wall2 = _interopRequireDefault(_Wall);

var _BounceWall = require('./Wall/BounceWall');

var _BounceWall2 = _interopRequireDefault(_BounceWall);

var _GameOverWall = require('./Wall/GameOverWall');

var _GameOverWall2 = _interopRequireDefault(_GameOverWall);

var _HasteWall = require('./Wall/HasteWall');

var _HasteWall2 = _interopRequireDefault(_HasteWall);

var _HideWall = require('./Wall/HideWall');

var _HideWall2 = _interopRequireDefault(_HideWall);

var _HugWall = require('./Wall/HugWall');

var _HugWall2 = _interopRequireDefault(_HugWall);

var _ImmobileWall = require('./Wall/ImmobileWall');

var _ImmobileWall2 = _interopRequireDefault(_ImmobileWall);

var _PaintingWall = require('./Wall/PaintingWall');

var _PaintingWall2 = _interopRequireDefault(_PaintingWall);

var _OnslaughtWall = require('./Wall/OnslaughtWall');

var _OnslaughtWall2 = _interopRequireDefault(_OnslaughtWall);

var _ResizeWall = require('./Wall/ResizeWall');

var _ResizeWall2 = _interopRequireDefault(_ResizeWall);

var _ReverseWall = require('./Wall/ReverseWall');

var _ReverseWall2 = _interopRequireDefault(_ReverseWall);

var _ScoreWall = require('./Wall/ScoreWall');

var _ScoreWall2 = _interopRequireDefault(_ScoreWall);

var _SlowWall = require('./Wall/SlowWall');

var _SlowWall2 = _interopRequireDefault(_SlowWall);

var _SpeedWall = require('./Wall/SpeedWall');

var _SpeedWall2 = _interopRequireDefault(_SpeedWall);

var _StalkerWall = require('./Wall/StalkerWall');

var _StalkerWall2 = _interopRequireDefault(_StalkerWall);

var _StraightWall = require('./Wall/StraightWall');

var _StraightWall2 = _interopRequireDefault(_StraightWall);

var _TimeWall = require('./Wall/TimeWall');

var _TimeWall2 = _interopRequireDefault(_TimeWall);

var _TrackerWall = require('./Wall/TrackerWall');

var _TrackerWall2 = _interopRequireDefault(_TrackerWall);

var _TurnBackWall = require('./Wall/TurnBackWall');

var _TurnBackWall2 = _interopRequireDefault(_TurnBackWall);

var _TurtleWall = require('./Wall/TurtleWall');

var _TurtleWall2 = _interopRequireDefault(_TurtleWall);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var walls = [_Wall2.default, _BounceWall2.default, _ImmobileWall2.default, _HideWall2.default, _OnslaughtWall2.default, _StalkerWall2.default, _TimeWall2.default, _ScoreWall2.default, _SpeedWall2.default, _PaintingWall2.default, _HugWall2.default, _TurnBackWall2.default, _StraightWall2.default, _ResizeWall2.default, _TurtleWall2.default, _SlowWall2.default, _HasteWall2.default, _TrackerWall2.default, _ReverseWall2.default, _GameOverWall2.default];

var orbs = [_BerserkOrb2.default, _DestroyerOrb2.default, _GodOrb2.default, _LifeOrb2.default, _ScoreOrb2.default, _SlowdownOrb2.default, _SpeedOrb2.default, _StopOrb2.default, _TimeOrb2.default];

var behaviors = [_Particle2.default, _Explosion2.default, _Orb2.default, _Player2.default].concat(walls, orbs);

var New = { init: init };
var spawnOrder = [].concat(walls);
var bonusOrbs = [].concat(orbs);

function init(data) {
    if (_Pool2.default.pools) Object.keys(_Pool2.default.pools).forEach(function (k) {
        return _Pool2.default.pools[k].length = 0;
    });
    behaviors.forEach(function (b) {
        var instance = new b(data);
        var pool = _Pool2.default.pools && _Pool2.default.pools[instance.poolName] || _Pool2.default.newPool(instance.poolName, data);
        New[b.name] = function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return pool.new.apply(pool, [instance].concat(args));
        };
        _Behaviors2.default[b.name] = instance;
    });
    for (var i = 0; i < walls.length; ++i) {
        spawnOrder[i] = New[walls[i].name];
    }for (var _i = 0; _i < orbs.length; ++_i) {
        bonusOrbs[_i] = New[orbs[_i].name];
    }
}

exports.default = New;
exports.spawnOrder = spawnOrder;
exports.bonusOrbs = bonusOrbs;

});

require.register("src/GameObject/Orb/BaseBonusOrb.js", function(exports, require, module) {
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

var _BaseOrb2 = require('./BaseOrb');

var _BaseOrb3 = _interopRequireDefault(_BaseOrb2);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var BaseBonusOrb = function (_BaseOrb) {
    _inherits(BaseBonusOrb, _BaseOrb);

    function BaseBonusOrb() {
        _classCallCheck(this, BaseBonusOrb);

        return _possibleConstructorReturn(this, (BaseBonusOrb.__proto__ || Object.getPrototypeOf(BaseBonusOrb)).apply(this, arguments));
    }

    _createClass(BaseBonusOrb, [{
        key: 'init',
        value: function init(self, spriteX, spriteY, color) {
            _get(BaseBonusOrb.prototype.__proto__ || Object.getPrototypeOf(BaseBonusOrb.prototype), 'init', this).call(this, self, self.data.orbSprites[spriteX][spriteY], color, true);
            self.lifetime = 500;
            self.data.sounds.orbSpawn.play();
        }
    }, {
        key: 'update',
        value: function update(self) {
            _get(BaseBonusOrb.prototype.__proto__ || Object.getPrototypeOf(BaseBonusOrb.prototype), 'update', this).call(this, self);
            if (--self.lifetime <= 0) self.destroy();
        }
    }, {
        key: 'bonus',
        value: function bonus(self, player) {}
    }, {
        key: 'destroy',
        value: function destroy(self) {
            if (!self.taken) this.explosion(self);else self.data.sounds.orbBonus.play();
        }
    }]);

    return BaseBonusOrb;
}(_BaseOrb3.default);

exports.default = BaseBonusOrb;

});

require.register("src/GameObject/Orb/BaseOrb.js", function(exports, require, module) {
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _Random = require('../../Tools/Random');

var _Random2 = _interopRequireDefault(_Random);

var _MathTools = require('../../Tools/MathTools');

var _MathTools2 = _interopRequireDefault(_MathTools);

var _Collision = require('../../Tools/Collision');

var _Collision2 = _interopRequireDefault(_Collision);

var _GameObjectBehavior2 = require('../GameObjectBehavior');

var _GameObjectBehavior3 = _interopRequireDefault(_GameObjectBehavior2);

var _Pools = require('../Pools');

var _Pools2 = _interopRequireDefault(_Pools);

var _New = require('../New');

var _New2 = _interopRequireDefault(_New);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var BaseOrb = function (_GameObjectBehavior) {
    _inherits(BaseOrb, _GameObjectBehavior);

    function BaseOrb() {
        _classCallCheck(this, BaseOrb);

        var _this = _possibleConstructorReturn(this, (BaseOrb.__proto__ || Object.getPrototypeOf(BaseOrb)).call(this));

        _this.poolName = 'Orb';
        return _this;
    }

    _createClass(BaseOrb, [{
        key: 'init',
        value: function init(self, sprite, color) {
            var isUnique = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

            self.sprite = sprite;
            self.width = self.sprite.width;
            self.height = self.sprite.height;
            self.color = color;
            self.isUnique = isUnique;
            self.taken = false;
            this.newCoords(self);
            this.explosion(self);
        }
    }, {
        key: 'newCoords',
        value: function newCoords(self) {
            self.taken = false;
            var findNewCoords = true;
            do {
                self.x = self.data.bounds.x.min + _Random2.default.range(0, self.data.width - self.width);
                self.y = self.data.bounds.y.min + _Random2.default.range(0, self.data.height - self.height);
                findNewCoords = _Pools2.default.Wall.find(function (w) {
                    return _Collision2.default.circleRect(self, w);
                });
            } while (findNewCoords);
        }
    }, {
        key: 'update',
        value: function update(self) {
            this.collision(self);
        }
    }, {
        key: 'bonus',
        value: function bonus(self, player) {}
    }, {
        key: 'explosion',
        value: function explosion(self) {
            _New2.default.Explosion(self.x, self.y, self.width, self.color, false, self.taken ? undefined : 1);
        }
    }, {
        key: 'collision',
        value: function collision(self) {
            var _this2 = this;

            _Pools2.default.Player.forEach(function (p) {
                if (_Collision2.default.circleCircle(self, p)) {
                    self.taken = true;
                    _this2.bonus(self, p);
                    _this2.explosion(self);
                    if (!self.isUnique) _this2.newCoords(self);else self.destroy();
                }
            });
        }
    }]);

    return BaseOrb;
}(_GameObjectBehavior3.default);

exports.default = BaseOrb;

});

require.register("src/GameObject/Orb/BerserkOrb.js", function(exports, require, module) {
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

var _BaseBonusOrb2 = require("./BaseBonusOrb");

var _BaseBonusOrb3 = _interopRequireDefault(_BaseBonusOrb2);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var BerserkOrb = function (_BaseBonusOrb) {
    _inherits(BerserkOrb, _BaseBonusOrb);

    function BerserkOrb() {
        _classCallCheck(this, BerserkOrb);

        return _possibleConstructorReturn(this, (BerserkOrb.__proto__ || Object.getPrototypeOf(BerserkOrb)).apply(this, arguments));
    }

    _createClass(BerserkOrb, [{
        key: "init",
        value: function init(self) {
            _get(BerserkOrb.prototype.__proto__ || Object.getPrototypeOf(BerserkOrb.prototype), "init", this).call(this, self, 1, 7, "#6b0e04");
            self.lifetime /= 2;
        }
    }, {
        key: "bonus",
        value: function bonus(self, player) {
            player.stateValues.berserk += player.stateDuration;
            _get(BerserkOrb.prototype.__proto__ || Object.getPrototypeOf(BerserkOrb.prototype), "bonus", this).call(this, self, player);
        }
    }]);

    return BerserkOrb;
}(_BaseBonusOrb3.default);

exports.default = BerserkOrb;

});

require.register("src/GameObject/Orb/DestroyerOrb.js", function(exports, require, module) {
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

var _BaseBonusOrb2 = require('./BaseBonusOrb');

var _BaseBonusOrb3 = _interopRequireDefault(_BaseBonusOrb2);

var _Pools = require('../Pools');

var _Pools2 = _interopRequireDefault(_Pools);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var DestroyerOrb = function (_BaseBonusOrb) {
    _inherits(DestroyerOrb, _BaseBonusOrb);

    function DestroyerOrb() {
        _classCallCheck(this, DestroyerOrb);

        return _possibleConstructorReturn(this, (DestroyerOrb.__proto__ || Object.getPrototypeOf(DestroyerOrb)).apply(this, arguments));
    }

    _createClass(DestroyerOrb, [{
        key: 'init',
        value: function init(self) {
            _get(DestroyerOrb.prototype.__proto__ || Object.getPrototypeOf(DestroyerOrb.prototype), 'init', this).call(this, self, 2, 0, "#8300d6");
            self.lifetime /= 4;
        }
    }, {
        key: 'bonus',
        value: function bonus(self, player) {
            for (var i = 0; i < _Pools2.default.Wall.length && i < 3; ++i) {
                _Pools2.default.Wall.get(0).destroy();
            }
        }
    }]);

    return DestroyerOrb;
}(_BaseBonusOrb3.default);

exports.default = DestroyerOrb;

});

require.register("src/GameObject/Orb/GodOrb.js", function(exports, require, module) {
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

var _BaseBonusOrb2 = require("./BaseBonusOrb");

var _BaseBonusOrb3 = _interopRequireDefault(_BaseBonusOrb2);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var GodOrb = function (_BaseBonusOrb) {
    _inherits(GodOrb, _BaseBonusOrb);

    function GodOrb() {
        _classCallCheck(this, GodOrb);

        return _possibleConstructorReturn(this, (GodOrb.__proto__ || Object.getPrototypeOf(GodOrb)).apply(this, arguments));
    }

    _createClass(GodOrb, [{
        key: "init",
        value: function init(self) {
            _get(GodOrb.prototype.__proto__ || Object.getPrototypeOf(GodOrb.prototype), "init", this).call(this, self, 1, 5, "#fe6c00");
        }
    }, {
        key: "bonus",
        value: function bonus(self, player) {
            player.stateValues.god += player.stateDuration;
        }
    }]);

    return GodOrb;
}(_BaseBonusOrb3.default);

exports.default = GodOrb;

});

require.register("src/GameObject/Orb/LifeOrb.js", function(exports, require, module) {
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

var _BaseBonusOrb2 = require("./BaseBonusOrb");

var _BaseBonusOrb3 = _interopRequireDefault(_BaseBonusOrb2);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var LifeOrb = function (_BaseBonusOrb) {
    _inherits(LifeOrb, _BaseBonusOrb);

    function LifeOrb() {
        _classCallCheck(this, LifeOrb);

        return _possibleConstructorReturn(this, (LifeOrb.__proto__ || Object.getPrototypeOf(LifeOrb)).apply(this, arguments));
    }

    _createClass(LifeOrb, [{
        key: "init",
        value: function init(self) {
            _get(LifeOrb.prototype.__proto__ || Object.getPrototypeOf(LifeOrb.prototype), "init", this).call(this, self, 1, 2, "#c00004");
            self.lifetime /= 2;
        }
    }, {
        key: "bonus",
        value: function bonus(self, player) {
            player.lives++;
        }
    }]);

    return LifeOrb;
}(_BaseBonusOrb3.default);

exports.default = LifeOrb;

});

require.register("src/GameObject/Orb/Orb.js", function(exports, require, module) {
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

var _MathTools = require('../../Tools/MathTools');

var _MathTools2 = _interopRequireDefault(_MathTools);

var _BaseOrb2 = require('./BaseOrb');

var _BaseOrb3 = _interopRequireDefault(_BaseOrb2);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Orb = function (_BaseOrb) {
    _inherits(Orb, _BaseOrb);

    function Orb() {
        _classCallCheck(this, Orb);

        var _this = _possibleConstructorReturn(this, (Orb.__proto__ || Object.getPrototypeOf(Orb)).call(this));

        _this.score = 10;
        _this.time = 2500;
        _this.secondsForBonus = 5;
        _this.timeSeconds = _this.time / 1000;
        return _this;
    }

    _createClass(Orb, [{
        key: 'init',
        value: function init(self) {
            _get(Orb.prototype.__proto__ || Object.getPrototypeOf(Orb.prototype), 'init', this).call(this, self, self.data.orbSprites[1][0], "#ff8e00");
            self.previousCountdown = null;
            self.previousAdditionnalSeconds = this.timeSeconds;
        }
    }, {
        key: 'bonus',
        value: function bonus(self, player) {
            self.data.game.levelStep++;
            player.score += this.score;
            player.time += this.time;
            if (self.previousCountdown != null) {
                var diff = this.secondsForBonus - self.previousCountdown + player.countdown;
                if (0 < diff) {
                    var ratio = diff / this.secondsForBonus;
                    player.score += ratio * this.score;
                    player.time += ratio * this.time;
                    self.previousAdditionnalSeconds = (this.time + ratio * this.time) / 1000;
                }
            }
            self.previousCountdown = player.countdown + self.previousAdditionnalSeconds;
        }
    }]);

    return Orb;
}(_BaseOrb3.default);

exports.default = Orb;

});

require.register("src/GameObject/Orb/ScoreOrb.js", function(exports, require, module) {
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

var _BaseBonusOrb2 = require("./BaseBonusOrb");

var _BaseBonusOrb3 = _interopRequireDefault(_BaseBonusOrb2);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var ScoreOrb = function (_BaseBonusOrb) {
    _inherits(ScoreOrb, _BaseBonusOrb);

    function ScoreOrb() {
        _classCallCheck(this, ScoreOrb);

        return _possibleConstructorReturn(this, (ScoreOrb.__proto__ || Object.getPrototypeOf(ScoreOrb)).apply(this, arguments));
    }

    _createClass(ScoreOrb, [{
        key: "init",
        value: function init(self) {
            _get(ScoreOrb.prototype.__proto__ || Object.getPrototypeOf(ScoreOrb.prototype), "init", this).call(this, self, 1, 1, "#09b900");
        }
    }, {
        key: "bonus",
        value: function bonus(self, player) {
            player.score += 100;
        }
    }]);

    return ScoreOrb;
}(_BaseBonusOrb3.default);

exports.default = ScoreOrb;

});

require.register("src/GameObject/Orb/SlowdownOrb.js", function(exports, require, module) {
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

var _BaseBonusOrb2 = require("./BaseBonusOrb");

var _BaseBonusOrb3 = _interopRequireDefault(_BaseBonusOrb2);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var SlowdownOrb = function (_BaseBonusOrb) {
    _inherits(SlowdownOrb, _BaseBonusOrb);

    function SlowdownOrb() {
        _classCallCheck(this, SlowdownOrb);

        return _possibleConstructorReturn(this, (SlowdownOrb.__proto__ || Object.getPrototypeOf(SlowdownOrb)).apply(this, arguments));
    }

    _createClass(SlowdownOrb, [{
        key: "init",
        value: function init(self) {
            _get(SlowdownOrb.prototype.__proto__ || Object.getPrototypeOf(SlowdownOrb.prototype), "init", this).call(this, self, 2, 1, "#17cc71");
            self.lifetime /= 2;
        }
    }, {
        key: "bonus",
        value: function bonus(self, player) {
            self.data.game.durations.slowWall += player.stateDuration;
        }
    }]);

    return SlowdownOrb;
}(_BaseBonusOrb3.default);

exports.default = SlowdownOrb;

});

require.register("src/GameObject/Orb/SpeedOrb.js", function(exports, require, module) {
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

var _BaseBonusOrb2 = require("./BaseBonusOrb");

var _BaseBonusOrb3 = _interopRequireDefault(_BaseBonusOrb2);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var SpeedOrb = function (_BaseBonusOrb) {
    _inherits(SpeedOrb, _BaseBonusOrb);

    function SpeedOrb() {
        _classCallCheck(this, SpeedOrb);

        return _possibleConstructorReturn(this, (SpeedOrb.__proto__ || Object.getPrototypeOf(SpeedOrb)).apply(this, arguments));
    }

    _createClass(SpeedOrb, [{
        key: "init",
        value: function init(self) {
            _get(SpeedOrb.prototype.__proto__ || Object.getPrototypeOf(SpeedOrb.prototype), "init", this).call(this, self, 1, 3, "#006aff");
        }
    }, {
        key: "bonus",
        value: function bonus(self, player) {
            player.maxSpeed += 5;
        }
    }]);

    return SpeedOrb;
}(_BaseBonusOrb3.default);

exports.default = SpeedOrb;

});

require.register("src/GameObject/Orb/StopOrb.js", function(exports, require, module) {
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

var _BaseBonusOrb2 = require("./BaseBonusOrb");

var _BaseBonusOrb3 = _interopRequireDefault(_BaseBonusOrb2);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var StopOrb = function (_BaseBonusOrb) {
    _inherits(StopOrb, _BaseBonusOrb);

    function StopOrb() {
        _classCallCheck(this, StopOrb);

        return _possibleConstructorReturn(this, (StopOrb.__proto__ || Object.getPrototypeOf(StopOrb)).apply(this, arguments));
    }

    _createClass(StopOrb, [{
        key: "init",
        value: function init(self) {
            _get(StopOrb.prototype.__proto__ || Object.getPrototypeOf(StopOrb.prototype), "init", this).call(this, self, 1, 6, "#6c6c6c");
        }
    }, {
        key: "bonus",
        value: function bonus(self, player) {
            self.data.game.durations.stopWall += player.stateDuration;
        }
    }, {
        key: "destroy",
        value: function destroy(self) {
            if (self.taken) self.data.sounds.orbStop.play();
        }
    }]);

    return StopOrb;
}(_BaseBonusOrb3.default);

exports.default = StopOrb;

});

require.register("src/GameObject/Orb/TimeOrb.js", function(exports, require, module) {
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

var _BaseBonusOrb2 = require("./BaseBonusOrb");

var _BaseBonusOrb3 = _interopRequireDefault(_BaseBonusOrb2);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var TimeOrb = function (_BaseBonusOrb) {
    _inherits(TimeOrb, _BaseBonusOrb);

    function TimeOrb() {
        _classCallCheck(this, TimeOrb);

        return _possibleConstructorReturn(this, (TimeOrb.__proto__ || Object.getPrototypeOf(TimeOrb)).apply(this, arguments));
    }

    _createClass(TimeOrb, [{
        key: "init",
        value: function init(self) {
            _get(TimeOrb.prototype.__proto__ || Object.getPrototypeOf(TimeOrb.prototype), "init", this).call(this, self, 1, 4, "#c400c9");
        }
    }, {
        key: "bonus",
        value: function bonus(self, player) {
            player.time += 30000;
        }
    }]);

    return TimeOrb;
}(_BaseBonusOrb3.default);

exports.default = TimeOrb;

});

require.register("src/GameObject/Particle.js", function(exports, require, module) {
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _MathTools = require('../Tools/MathTools');

var _MathTools2 = _interopRequireDefault(_MathTools);

var _GameObjectBehavior2 = require('./GameObjectBehavior');

var _GameObjectBehavior3 = _interopRequireDefault(_GameObjectBehavior2);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Particle = function (_GameObjectBehavior) {
    _inherits(Particle, _GameObjectBehavior);

    function Particle() {
        _classCallCheck(this, Particle);

        return _possibleConstructorReturn(this, (Particle.__proto__ || Object.getPrototypeOf(Particle)).apply(this, arguments));
    }

    _createClass(Particle, [{
        key: 'init',
        value: function init(self, x, y) {
            var direction = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
            var speed = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
            var width = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 10;
            var color = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : '#ffffff';
            var isSquare = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : false;
            var decreasingSpeed = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 0.5;

            this.fullCircle = Math.PI * 2;
            self.x = x;
            self.y = y;
            self.direction = direction;
            self.speed = speed;
            self.decreasingSpeed = decreasingSpeed;
            self.width = width;
            self.height = width;
            self.radius = width / 2;
            self.color = color;
            self.isSquare = isSquare;
            var rads = _MathTools2.default.rads(direction);
            self.dx = Math.cos(rads) * self.speed + self.decreasingSpeed;
            self.dy = -Math.sin(rads) * self.speed + self.decreasingSpeed;
        }
    }, {
        key: 'update',
        value: function update(self) {
            self.radius -= self.decreasingSpeed;
            self.height = self.width = self.radius * 2;
            if (self.radius <= 0) self.destroy();else {
                self.x += self.dx;
                self.y += self.dy;
            }
        }
    }, {
        key: 'draw',
        value: function draw(self) {
            self.data.context.fillStyle = self.color;
            if (self.isSquare) {
                (self._clearScreen = 1 < (self.width | 0) && 1 < (self.height | 0)) && self.data.context.fillRect(self.x | 0, self.y | 0, self.width | 0, self.height | 0);
            } else if (self._clearScreen = 1 < (self.radius * 2 | 0)) {
                self.data.context.beginPath();
                self.data.context.arc(self.x + self.radius | 0, self.y + self.radius | 0, self.radius, 0, this.fullCircle);
                self.data.context.fill();
            }
        }
    }]);

    return Particle;
}(_GameObjectBehavior3.default);

exports.default = Particle;

});

require.register("src/GameObject/Player.js", function(exports, require, module) {
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

var _Enum = require('../Tools/Enum');

var _Enum2 = _interopRequireDefault(_Enum);

var _MathTools = require('../Tools/MathTools');

var _MathTools2 = _interopRequireDefault(_MathTools);

var _Data = require('../Data');

var _Data2 = _interopRequireDefault(_Data);

var _GameObjectBehavior2 = require('./GameObjectBehavior');

var _GameObjectBehavior3 = _interopRequireDefault(_GameObjectBehavior2);

var _Pool = require('./Pool');

var _Pool2 = _interopRequireDefault(_Pool);

var _New = require('./New');

var _New2 = _interopRequireDefault(_New);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i];
        }return arr2;
    } else {
        return Array.from(arr);
    }
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Player = function (_GameObjectBehavior) {
    _inherits(Player, _GameObjectBehavior);

    function Player() {
        _classCallCheck(this, Player);

        var _this = _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this));

        _this.startTime = 10000;
        return _this;
    }

    _createClass(Player, [{
        key: 'init',
        value: function init(self) {
            _get(Player.prototype.__proto__ || Object.getPrototypeOf(Player.prototype), 'init', this).call(this, self);
            self.maxSpeed = 10;
            self.x = self.data.middle.x;
            self.y = self.data.middle.y;
            self.stateDuration = 300;
            if (!self.sprites) {
                self.specialStates = ['god', 'berserk', 'reverse'];
                self.states = new (Function.prototype.bind.apply(_Enum2.default, [null].concat(['normal', 'last'], _toConsumableArray(self.specialStates))))();
                self.sprites = [];
                for (var i = 0; i < 5; ++i) {
                    self.sprites.push(self.data.orbSprites[0][i]);
                }self.colors = ["#7c1504", "#d20000", "#f6be0a", "#6b0e04", "#ba7301"];
                self.stateValues = {};
            }
            self.specialStates.forEach(function (k) {
                return self.stateValues[k] = 0;
            });
            self.state = self.states.normal;
            self.color = self.colors[0];
            self.sprite = self.sprites[0];
            self.width = self.sprite.width;
            self.height = self.sprite.height;
            self.halfWidth = self.width / 2;
            self.halfHeight = self.height / 2;
            self.stateValues.god = self.stateDuration / 10;
            self.lives = 3;
            self.score = 0;
            self.lastLifeWarned = false;
            self.time = this.startTime;
            self.startedAt = self.data.now;
            self.countdown = self.time / 1000;
            self.i_particle = 0;
            self.i_stateExplosion = 0;
        }
    }, {
        key: '_updateCountdown',
        value: function _updateCountdown(self) {
            self.score += self.data.frameTime;
            self.countdown = (self.startedAt + self.time - self.data.now) / 1000;
            if (self.countdown < 0) self.countdown = 0;
        }
    }, {
        key: 'update',
        value: function update(self) {
            this._updateCoord(self);
            this._updateState(self);
            this._drawQueue(self);
            this._updateCountdown(self);
            if (self.countdown <= 0) {
                self.lives--;
                self.time += this.startTime;
            }
            if (self.lives <= 0) self.destroy();
        }
    }, {
        key: 'destroy',
        value: function destroy(self) {
            _New2.default.Explosion(self.x - self.halfWidth, self.y - self.halfHeight, self.width * 2, self.color, false, 10);
        }
    }, {
        key: 'updateRectToClean',
        value: function updateRectToClean(self, rect) {
            if (0 < self.lives) {
                rect.x = self.x - 1 | 0;
                rect.y = self.y - 1 | 0;
                rect.w = self.width + 2 | 0;
                rect.h = self.height + 2 | 0;
            } else {
                rect.x = self.x - self.halfWidth - 1 | 0;
                rect.y = self.y - self.halfHeight - 1 | 0;
                rect.w = self.width * 2 + 2 | 0;
                rect.h = self.height * 2 + 2 | 0;
            }
        }
    }, {
        key: '_updateState',
        value: function _updateState(self) {
            self.state = self.lives === 1 ? self.states.last : self.states.normal;
            var normalState = self.state;
            for (var i = self.specialStates.length - 1; 0 <= i; --i) {
                var state = self.specialStates[i];
                if (0 < self.stateValues[state]) {
                    self.stateValues[state] -= 1;
                    self.state = state;
                }
            }
            if (self.state !== normalState && self.stateValues[self.state] <= ++self.i_stateExplosion) {
                _New2.default.Explosion(self.x - self.halfWidth, self.y - self.halfHeight, self.width, self.color, false, 2.5);
                self.i_stateExplosion = 0;
            }
            if (1 < self.lives && self.lastLifeWarned) self.lastLifeWarned = false;
            if (self.lives <= 1 && !self.lastLifeWarned) {
                self.data.sounds.lastLife.play();
                self.lastLifeWarned = true;
            }
            var index = self.states.index[self.state];
            self.sprite = self.sprites[index];
            self.color = self.colors[index];
        }
    }, {
        key: '_updateCoord',
        value: function _updateCoord(self) {
            var sens = 1 - +(0 < self.stateValues.reverse) * 2;
            var mouseX = self.data.mouseX - self.halfWidth;
            var mouseY = self.data.mouseY - self.halfHeight;
            if (isNaN(mouseX) || isNaN(mouseY)) return;
            self.direction = _MathTools2.default.direction(self.x, self.y, mouseX, mouseY);
            self.speed = _MathTools2.default.squareDistance(self.x, self.y, mouseX, mouseY) / 2500 * self.maxSpeed;
            if (self.maxSpeed < self.speed) self.speed = self.maxSpeed;
            var angle = _MathTools2.default.rads(self.direction);
            self.x += Math.cos(angle) * self.speed * sens;
            self.y -= Math.sin(angle) * self.speed * sens;
            if (self.x < self.data.bounds.x.min) self.x = self.data.bounds.x.min;
            if (self.data.bounds.x.max - self.width < self.x) self.x = self.data.bounds.x.max - self.width;
            if (self.y < self.data.bounds.y.min) self.y = self.data.bounds.y.min;
            if (self.data.bounds.y.max - self.height < self.y) self.y = self.data.bounds.y.max - self.height;
        }
    }, {
        key: '_drawQueue',
        value: function _drawQueue(self) {
            if (self.i_particle++ % 2 === 0 && self.speed) _New2.default.Particle(self.x, self.y, 0, 0, self.width, self.color);
        }
    }]);

    return Player;
}(_GameObjectBehavior3.default);

exports.default = Player;

});

require.register("src/GameObject/Pool.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _Pools = require('./Pools');

var _Pools2 = _interopRequireDefault(_Pools);

var _GameObject = require('./GameObject');

var _GameObject2 = _interopRequireDefault(_GameObject);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Pool = function () {
    _createClass(Pool, null, [{
        key: 'newPool',
        value: function newPool(name, data) {
            if (!Pool.pools) Pool.pools = _Pools2.default;
            if (!Pool.pools[name]) Pool.pools[name] = new Pool(data);else Pool.pools[name].length = 0;
            return Pool.pools[name];
        }
    }]);

    function Pool(data) {
        _classCallCheck(this, Pool);

        this.data = data;
        this.objects = [];
        this.length = 0;
    }

    _createClass(Pool, [{
        key: 'new',
        value: function _new(behavior) {
            if (this.objects.length <= this.length) this.objects.push(new _GameObject2.default(this, this.data));
            var obj = this.objects[this.length++];

            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            obj.init.apply(obj, [behavior].concat(args));
            return obj;
        }
    }, {
        key: 'get',
        value: function get(i) {
            return this.objects[i];
        }
    }, {
        key: 'remove',
        value: function remove(obj) {
            var index = this.objects.indexOf(obj);
            this.objects[index] = this.objects[--this.length];
            this.objects[this.length] = obj;
        }
    }, {
        key: 'forEach',
        value: function forEach(fn) {
            for (var i = 0; i < this.length; ++i) {
                fn(this.objects[i]);
            }
        }
    }, {
        key: 'find',
        value: function find(fn) {
            for (var i = 0; i < this.length; ++i) {
                if (fn(this.objects[i])) return true;
            }return false;
        }
    }]);

    return Pool;
}();

exports.default = Pool;

});

require.register("src/GameObject/Pools.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {};

});

require.register("src/GameObject/Wall/BaseWall.js", function(exports, require, module) {
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

var _get = function get(object, property, receiver) {
	if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
		var parent = Object.getPrototypeOf(object);if (parent === null) {
			return undefined;
		} else {
			return get(parent, property, receiver);
		}
	} else if ("value" in desc) {
		return desc.value;
	} else {
		var getter = desc.get;if (getter === undefined) {
			return undefined;
		}return getter.call(receiver);
	}
};

var _Random = require('../../Tools/Random');

var _Random2 = _interopRequireDefault(_Random);

var _Collision = require('../../Tools/Collision');

var _Collision2 = _interopRequireDefault(_Collision);

var _MathTools = require('../../Tools/MathTools');

var _MathTools2 = _interopRequireDefault(_MathTools);

var _GameObjectBehavior2 = require('../GameObjectBehavior');

var _GameObjectBehavior3 = _interopRequireDefault(_GameObjectBehavior2);

var _Pools = require('../Pools');

var _Pools2 = _interopRequireDefault(_Pools);

var _New = require('../New');

var _New2 = _interopRequireDefault(_New);

var _Behaviors = require('../Behaviors');

var _Behaviors2 = _interopRequireDefault(_Behaviors);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var BaseWall = function (_GameObjectBehavior) {
	_inherits(BaseWall, _GameObjectBehavior);

	function BaseWall() {
		_classCallCheck(this, BaseWall);

		var _this = _possibleConstructorReturn(this, (BaseWall.__proto__ || Object.getPrototypeOf(BaseWall)).call(this));

		_this.poolName = 'Wall';
		return _this;
	}

	_createClass(BaseWall, [{
		key: 'init',
		value: function init(self, sprite, color) {
			self.sprite = sprite;
			self.width = self.sprite.width;
			self.height = self.sprite.height;
			self.halfWidth = self.width / 2;
			self.halfHeight = self.height / 2;
			self.color = color;
			self.realSprite = self.sprite;
			self.realColor = self.color;
			self.i_particle = 0;
			self.i_newCoord = 0;
			self.speed = 2.82;
			self.coordOffset = 80;
			BaseWall._bounds = BaseWall._bounds || [self.data.bounds.x.min - self.width * 2 - self.coordOffset, self.data.bounds.y.max + self.width + self.coordOffset, self.data.bounds.x.max + self.width + self.coordOffset, self.data.bounds.y.min - self.width * 2 - self.coordOffset];
			this.newCoords(self);
		}
	}, {
		key: 'newCoords',
		value: function newCoords(self) {
			self.i_newCoord = 5;
			var findNewCoords = true;
			var tries = 10;
			while (findNewCoords && 0 < tries--) {
				self.direction = _Random2.default.range(0, 3);
				var random = _Random2.default.random() * (self.data.width - self.width);
				self.x = self.direction % 2 === 0 && BaseWall._bounds[self.direction] || self.data.bounds.x.min + random;
				self.y = self.direction % 2 !== 0 && BaseWall._bounds[self.direction] || self.data.bounds.y.min + random;
				findNewCoords = _Pools2.default.Wall.find(function (w) {
					return w !== self && w.x < self.x + self.width && self.x - self.width < w.x && w.y < self.y + self.height && self.y - self.height < w.y;
				});
			}
		}
	}, {
		key: 'penalties',
		value: function penalties(self, player) {
			player.lives--;
			player.stateValues.god = player.stateDuration / 4;
		}
	}, {
		key: 'update',
		value: function update(self) {
			this.special(self);
			this.changeSpeed(self);
			this.move(self);
			this.collision(self);
			this.particles(self);
		}
	}, {
		key: 'draw',
		value: function draw(self) {
			if (self.data.game.durations.resizeWall <= 0) _get(BaseWall.prototype.__proto__ || Object.getPrototypeOf(BaseWall.prototype), 'draw', this).call(this, self);else {
				self.cleanDrawing();
				self.data.context.drawImage(self.sprite, self.x + self.halfWidth / 2 | 0, self.y + self.halfHeight / 2 | 0, self.halfWidth, self.halfHeight);
			}
		}
	}, {
		key: 'special',
		value: function special(self) {
			if (self.data.game.durations.hideWall <= 0) {
				self.color = self.realColor;
				self.sprite = self.realSprite;
			} else {
				self.color = _Behaviors2.default.HideWall.color;
				self.sprite = _Behaviors2.default.HideWall.sprite;
			}
		}
	}, {
		key: 'move',
		value: function move(self) {
			if (0 < self.data.game.durations.stopWall) return;
			var rad = _MathTools2.default.rads(self.direction * 90);
			var cos = Math.cos(rad);
			var sin = Math.sin(rad);
			var distanceRespawn = self.data.width / 2 + self.width;
			var speed = self.speed;
			if (30 <= self.data.game.durations.slowWall) speed = speed / self.data.game.durations.slowWall * 30;
			if (self.direction === 0 && self.data.bounds.x.max < self.x || self.direction === 1 && self.y < self.data.bounds.y.min - self.width || self.direction === 2 && self.x < self.data.bounds.x.min - self.width || self.direction === 3 && self.data.bounds.y.max < self.y) this.newCoords(self);else {
				self.x += cos * speed;
				self.y -= sin * speed;
			}
		}
	}, {
		key: 'changeSpeed',
		value: function changeSpeed(self) {}
	}, {
		key: 'explosion',
		value: function explosion(self, particleSpeed) {
			var color = self.data.game.durations.hideWall <= 0 ? self.color : _Behaviors2.default.HideWall.color;
			_New2.default.Explosion(self.x, self.y, self.width, self.color, true, particleSpeed);
		}
	}, {
		key: 'particles',
		value: function particles(self) {
			if (!self.speed) return;
			if (self.i_particle++ % 8 === 0) {
				var direction = 0;
				var speed = 0;
				var decreaseSpeed = 0.5;
				if (self.i_newCoord) {
					self.i_newCoord--;
					direction = self.direction * 90;
					speed = self.speed * 5;
					decreaseSpeed = 1;
				}
				var color = self.data.game.durations.hideWall <= 0 ? self.color : _Behaviors2.default.HideWall.color;
				_New2.default.Particle(self.x, self.y, direction, speed, self.width, self.color, true, decreaseSpeed);
			}
		}
	}, {
		key: 'collision',
		value: function collision(self) {
			var _this2 = this;

			_Pools2.default.Player.forEach(function (p) {
				return (p.stateValues.god <= 0 || 0 < p.stateValues.berserk) && _Collision2.default.circleRect(p, self) && (p.stateValues.berserk <= 0 ? _this2.penalties(self, p) : self.destroy() || (p.stateValues.berserk = 0));
			});
		}
	}, {
		key: 'destroy',
		value: function destroy(self) {
			self.data.sounds.wallExplosion.play();
			this.explosion(self);
		}
	}, {
		key: 'updateRectToClean',
		value: function updateRectToClean(self, rect) {
			rect.x = self.x - 3 | 0;
			rect.y = self.y - 3 | 0;
			rect.w = self.width + 6 | 0;
			rect.h = self.height + 6 | 0;
		}
	}]);

	return BaseWall;
}(_GameObjectBehavior3.default);

exports.default = BaseWall;

});

require.register("src/GameObject/Wall/BounceWall.js", function(exports, require, module) {
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

var _Collision = require('../../Tools/Collision');

var _Collision2 = _interopRequireDefault(_Collision);

var _Pools = require('../Pools');

var _Pools2 = _interopRequireDefault(_Pools);

var _BaseWall2 = require('./BaseWall');

var _BaseWall3 = _interopRequireDefault(_BaseWall2);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var BounceWall = function (_BaseWall) {
    _inherits(BounceWall, _BaseWall);

    function BounceWall() {
        _classCallCheck(this, BounceWall);

        return _possibleConstructorReturn(this, (BounceWall.__proto__ || Object.getPrototypeOf(BounceWall)).apply(this, arguments));
    }

    _createClass(BounceWall, [{
        key: 'init',
        value: function init(self) {
            _get(BounceWall.prototype.__proto__ || Object.getPrototypeOf(BounceWall.prototype), 'init', this).call(this, self, self.data.wallSprites[3][0], "#960000");
            self.bouncing = false;
        }
    }, {
        key: 'collision',
        value: function collision(self) {
            _get(BounceWall.prototype.__proto__ || Object.getPrototypeOf(BounceWall.prototype), 'collision', this).call(this, self);
            self.bouncing = _Pools2.default.Wall.find(function (w) {
                if (w === self || !_Collision2.default.rectRect(w, self)) return false;
                if (!self.bouncing) {
                    var dx = self.x - w.x;
                    var dy = self.y - w.y;
                    if (Math.abs(dx) < Math.abs(dy)) self.direction = dy < 0 ? 1 : 3;else self.direction = dx < 0 ? 2 : 0;
                }
                return true;
            });
        }
    }]);

    return BounceWall;
}(_BaseWall3.default);

exports.default = BounceWall;

});

require.register("src/GameObject/Wall/GameOverWall.js", function(exports, require, module) {
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

var _BaseWall2 = require("./BaseWall");

var _BaseWall3 = _interopRequireDefault(_BaseWall2);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var GameOverWall = function (_BaseWall) {
    _inherits(GameOverWall, _BaseWall);

    function GameOverWall() {
        _classCallCheck(this, GameOverWall);

        return _possibleConstructorReturn(this, (GameOverWall.__proto__ || Object.getPrototypeOf(GameOverWall)).apply(this, arguments));
    }

    _createClass(GameOverWall, [{
        key: "init",
        value: function init(self) {
            _get(GameOverWall.prototype.__proto__ || Object.getPrototypeOf(GameOverWall.prototype), "init", this).call(this, self, self.data.wallSprites[3][1], "#630001");
            self.speed *= 0.5;
        }
    }, {
        key: "penalties",
        value: function penalties(self, player) {
            player.lives = 0;
        }
    }]);

    return GameOverWall;
}(_BaseWall3.default);

exports.default = GameOverWall;

});

require.register("src/GameObject/Wall/HasteWall.js", function(exports, require, module) {
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

var _BaseWall2 = require("./BaseWall");

var _BaseWall3 = _interopRequireDefault(_BaseWall2);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var HasteWall = function (_BaseWall) {
    _inherits(HasteWall, _BaseWall);

    function HasteWall() {
        _classCallCheck(this, HasteWall);

        return _possibleConstructorReturn(this, (HasteWall.__proto__ || Object.getPrototypeOf(HasteWall)).apply(this, arguments));
    }

    _createClass(HasteWall, [{
        key: "init",
        value: function init(self) {
            _get(HasteWall.prototype.__proto__ || Object.getPrototypeOf(HasteWall.prototype), "init", this).call(this, self, self.data.wallSprites[2][2], "#24b6fc");
        }
    }, {
        key: "newCoords",
        value: function newCoords(self) {
            _get(HasteWall.prototype.__proto__ || Object.getPrototypeOf(HasteWall.prototype), "newCoords", this).call(this, self);
            self.speed = 0;
        }
    }, {
        key: "particles",
        value: function particles(self) {
            var temp = self.speed;
            if (temp < 2) self.speed = 2;
            _get(HasteWall.prototype.__proto__ || Object.getPrototypeOf(HasteWall.prototype), "particles", this).call(this, self);
            self.speed = temp;
        }
    }, {
        key: "update",
        value: function update(self) {
            self.speed += self.data.frameTime * 2;
            _get(HasteWall.prototype.__proto__ || Object.getPrototypeOf(HasteWall.prototype), "update", this).call(this, self);
        }
    }]);

    return HasteWall;
}(_BaseWall3.default);

exports.default = HasteWall;

});

require.register("src/GameObject/Wall/HideWall.js", function(exports, require, module) {
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

var _BaseWall2 = require("./BaseWall");

var _BaseWall3 = _interopRequireDefault(_BaseWall2);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var HideWall = function (_BaseWall) {
    _inherits(HideWall, _BaseWall);

    function HideWall(data) {
        _classCallCheck(this, HideWall);

        var _this = _possibleConstructorReturn(this, (HideWall.__proto__ || Object.getPrototypeOf(HideWall)).call(this));

        _this.color = "#ffe200";
        _this.sprite = data.wallSprites[0][3];
        return _this;
    }

    _createClass(HideWall, [{
        key: "init",
        value: function init(self) {
            _get(HideWall.prototype.__proto__ || Object.getPrototypeOf(HideWall.prototype), "init", this).call(this, self, this.sprite, this.color);
        }
    }, {
        key: "penalties",
        value: function penalties(self, player) {
            self.data.game.durations.hideWall += player.stateDuration;
            _get(HideWall.prototype.__proto__ || Object.getPrototypeOf(HideWall.prototype), "penalties", this).call(this, self, player);
        }
    }]);

    return HideWall;
}(_BaseWall3.default);

exports.default = HideWall;

});

require.register("src/GameObject/Wall/HugWall.js", function(exports, require, module) {
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

var _MathTools = require('../../Tools/MathTools');

var _MathTools2 = _interopRequireDefault(_MathTools);

var _Pools = require('../Pools');

var _Pools2 = _interopRequireDefault(_Pools);

var _BaseWall2 = require('./BaseWall');

var _BaseWall3 = _interopRequireDefault(_BaseWall2);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var HugWall = function (_BaseWall) {
    _inherits(HugWall, _BaseWall);

    function HugWall() {
        _classCallCheck(this, HugWall);

        return _possibleConstructorReturn(this, (HugWall.__proto__ || Object.getPrototypeOf(HugWall)).apply(this, arguments));
    }

    _createClass(HugWall, [{
        key: 'init',
        value: function init(self) {
            _get(HugWall.prototype.__proto__ || Object.getPrototypeOf(HugWall.prototype), 'init', this).call(this, self, self.data.wallSprites[3][3], "#00de60");
        }
    }, {
        key: 'newCoords',
        value: function newCoords(self) {
            self.i_newCoord = 5;
            var player = _Pools2.default.Player.get(0);
            var px = player.x + player.halfWidth;
            var py = player.y + player.halfHeight;
            self.direction = _MathTools2.default.direction(px, py, self.data.middle.x, self.data.middle.y) + 45 | 0;
            self.direction = self.direction % 360 / 90 | 0;
            self.x = self.direction % 2 === 0 && _BaseWall3.default._bounds[self.direction] || px - self.halfWidth;
            self.y = self.direction % 2 !== 0 && _BaseWall3.default._bounds[self.direction] || py - self.halfHeight;
        }
    }]);

    return HugWall;
}(_BaseWall3.default);

exports.default = HugWall;

});

require.register("src/GameObject/Wall/ImmobileWall.js", function(exports, require, module) {
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

var _BaseWall2 = require('./BaseWall');

var _BaseWall3 = _interopRequireDefault(_BaseWall2);

var _Collision = require('../../Tools/Collision');

var _Collision2 = _interopRequireDefault(_Collision);

var _MathTools = require('../../Tools/MathTools');

var _MathTools2 = _interopRequireDefault(_MathTools);

var _Random = require('../../Tools/Random');

var _Random2 = _interopRequireDefault(_Random);

var _Pools = require('../Pools');

var _Pools2 = _interopRequireDefault(_Pools);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var ImmobileWall = function (_BaseWall) {
    _inherits(ImmobileWall, _BaseWall);

    function ImmobileWall() {
        _classCallCheck(this, ImmobileWall);

        return _possibleConstructorReturn(this, (ImmobileWall.__proto__ || Object.getPrototypeOf(ImmobileWall)).apply(this, arguments));
    }

    _createClass(ImmobileWall, [{
        key: 'init',
        value: function init(self) {
            _get(ImmobileWall.prototype.__proto__ || Object.getPrototypeOf(ImmobileWall.prototype), 'init', this).call(this, self, self.data.wallSprites[1][0], "#414141");
            self.speed = 0;
        }
    }, {
        key: 'newCoords',
        value: function newCoords(self) {
            self.i_newCoord = 5;
            var findNewCoords = true;
            var tries = 30;
            while (findNewCoords && 0 < tries--) {
                self.x = _Random2.default.range(self.data.bounds.x.min, self.data.bounds.x.max - self.width);
                self.y = _Random2.default.range(self.data.bounds.y.min, self.data.bounds.y.max - self.height);
                findNewCoords = _Pools2.default.Wall.find(function (w) {
                    return w !== self && _Collision2.default.rectRect(self, w);
                }) || _Pools2.default.Orb.find(function (s) {
                    return _Collision2.default.circleRect(s, self);
                }) || _Pools2.default.Player.find(function (p) {
                    return _MathTools2.default.squareDistance(p.x, p.y, self.x, self.y) < _MathTools2.default.sqpw(p.width + self.width + 20);
                });
            }
            this.explosion(self, 1);
        }
    }]);

    return ImmobileWall;
}(_BaseWall3.default);

exports.default = ImmobileWall;

});

require.register("src/GameObject/Wall/OnslaughtWall.js", function(exports, require, module) {
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

var _Pools = require('../Pools');

var _Pools2 = _interopRequireDefault(_Pools);

var _Collision = require('../../Tools/Collision');

var _Collision2 = _interopRequireDefault(_Collision);

var _BaseWall2 = require('./BaseWall');

var _BaseWall3 = _interopRequireDefault(_BaseWall2);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var OnslaughtWall = function (_BaseWall) {
    _inherits(OnslaughtWall, _BaseWall);

    function OnslaughtWall() {
        _classCallCheck(this, OnslaughtWall);

        return _possibleConstructorReturn(this, (OnslaughtWall.__proto__ || Object.getPrototypeOf(OnslaughtWall)).apply(this, arguments));
    }

    _createClass(OnslaughtWall, [{
        key: 'init',
        value: function init(self) {
            self._detectionRect = {};
            _get(OnslaughtWall.prototype.__proto__ || Object.getPrototypeOf(OnslaughtWall.prototype), 'init', this).call(this, self, self.data.wallSprites[1][2], "#2903fe");
            self.maxSpeed = self.speed * 2;
            self.minSpeed = self.speed / 2;
            if (self.speed !== 2.82) console.log(self.previousBehaviorName, self.speed);
            self.speed = self.minSpeed;
        }
    }, {
        key: 'newCoords',
        value: function newCoords(self) {
            _get(OnslaughtWall.prototype.__proto__ || Object.getPrototypeOf(OnslaughtWall.prototype), 'newCoords', this).call(this, self);
            if (self.initialized) self.speed = self.minSpeed;
            this._updateDetectionRect(self);
        }
    }, {
        key: 'changeSpeed',
        value: function changeSpeed(self) {
            this._updateDetectionRectCoords(self);
            _Pools2.default.Player.forEach(function (p) {
                self.speed = _Collision2.default.circleRect(p, self._detectionRect) ? self.maxSpeed : self.minSpeed;
            });
        }
    }, {
        key: '_updateDetectionRect',
        value: function _updateDetectionRect(self) {
            this._updateDetectionRectCoords(self);
            self._detectionRect.width = self.direction % 2 === 0 ? self.data.width : self.width;
            self._detectionRect.height = self.direction % 2 === 1 ? self.data.height : self.height;
        }
    }, {
        key: '_updateDetectionRectCoords',
        value: function _updateDetectionRectCoords(self) {
            self._detectionRect.x = self.x - (self.direction === 2 && self.data.width);
            self._detectionRect.y = self.y - (self.direction === 1 && self.data.height);
        }
    }]);

    return OnslaughtWall;
}(_BaseWall3.default);

exports.default = OnslaughtWall;

});

require.register("src/GameObject/Wall/PaintingWall.js", function(exports, require, module) {
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

var _BaseWall2 = require("./BaseWall");

var _BaseWall3 = _interopRequireDefault(_BaseWall2);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var PaintingWall = function (_BaseWall) {
    _inherits(PaintingWall, _BaseWall);

    function PaintingWall() {
        _classCallCheck(this, PaintingWall);

        return _possibleConstructorReturn(this, (PaintingWall.__proto__ || Object.getPrototypeOf(PaintingWall)).apply(this, arguments));
    }

    _createClass(PaintingWall, [{
        key: "init",
        value: function init(self) {
            _get(PaintingWall.prototype.__proto__ || Object.getPrototypeOf(PaintingWall.prototype), "init", this).call(this, self, self.data.wallSprites[1][3], "#ffe200");
        }
    }, {
        key: "penalties",
        value: function penalties(self, player) {
            self.data.game.durations.clearScreen += player.stateDuration;
            _get(PaintingWall.prototype.__proto__ || Object.getPrototypeOf(PaintingWall.prototype), "penalties", this).call(this, self, player);
        }
    }]);

    return PaintingWall;
}(_BaseWall3.default);

exports.default = PaintingWall;

});

require.register("src/GameObject/Wall/ResizeWall.js", function(exports, require, module) {
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

var _BaseWall2 = require("./BaseWall");

var _BaseWall3 = _interopRequireDefault(_BaseWall2);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var ResizeWall = function (_BaseWall) {
    _inherits(ResizeWall, _BaseWall);

    function ResizeWall() {
        _classCallCheck(this, ResizeWall);

        return _possibleConstructorReturn(this, (ResizeWall.__proto__ || Object.getPrototypeOf(ResizeWall)).apply(this, arguments));
    }

    _createClass(ResizeWall, [{
        key: "init",
        value: function init(self) {
            _get(ResizeWall.prototype.__proto__ || Object.getPrototypeOf(ResizeWall.prototype), "init", this).call(this, self, self.data.wallSprites[4][2], "#383700");
        }
    }, {
        key: "penalties",
        value: function penalties(self, player) {
            self.data.game.durations.resizeWall += player.stateDuration;
            _get(ResizeWall.prototype.__proto__ || Object.getPrototypeOf(ResizeWall.prototype), "penalties", this).call(this, self, player);
        }
    }, {
        key: "draw",
        value: function draw(self) {
            self.cleanDrawing();
            _get(ResizeWall.prototype.__proto__ || Object.getPrototypeOf(ResizeWall.prototype), "draw", this).call(this, self);
        }
    }]);

    return ResizeWall;
}(_BaseWall3.default);

exports.default = ResizeWall;

});

require.register("src/GameObject/Wall/ReverseWall.js", function(exports, require, module) {
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

var _BaseWall2 = require("./BaseWall");

var _BaseWall3 = _interopRequireDefault(_BaseWall2);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var ReverseWall = function (_BaseWall) {
    _inherits(ReverseWall, _BaseWall);

    function ReverseWall() {
        _classCallCheck(this, ReverseWall);

        return _possibleConstructorReturn(this, (ReverseWall.__proto__ || Object.getPrototypeOf(ReverseWall)).apply(this, arguments));
    }

    _createClass(ReverseWall, [{
        key: "init",
        value: function init(self) {
            _get(ReverseWall.prototype.__proto__ || Object.getPrototypeOf(ReverseWall.prototype), "init", this).call(this, self, self.data.wallSprites[3][2], "#9c9c9c");
        }
    }, {
        key: "penalties",
        value: function penalties(self, player) {
            player.stateValues.reverse += player.stateDuration / 4;
            _get(ReverseWall.prototype.__proto__ || Object.getPrototypeOf(ReverseWall.prototype), "penalties", this).call(this, self, player);
        }
    }]);

    return ReverseWall;
}(_BaseWall3.default);

exports.default = ReverseWall;

});

require.register("src/GameObject/Wall/ScoreWall.js", function(exports, require, module) {
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

var _BaseWall2 = require("./BaseWall");

var _BaseWall3 = _interopRequireDefault(_BaseWall2);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var ScoreWall = function (_BaseWall) {
    _inherits(ScoreWall, _BaseWall);

    function ScoreWall() {
        _classCallCheck(this, ScoreWall);

        return _possibleConstructorReturn(this, (ScoreWall.__proto__ || Object.getPrototypeOf(ScoreWall)).apply(this, arguments));
    }

    _createClass(ScoreWall, [{
        key: "init",
        value: function init(self) {
            _get(ScoreWall.prototype.__proto__ || Object.getPrototypeOf(ScoreWall.prototype), "init", this).call(this, self, self.data.wallSprites[0][1], "#05a000");
        }
    }, {
        key: "penalties",
        value: function penalties(self, player) {
            player.score -= 200;
            _get(ScoreWall.prototype.__proto__ || Object.getPrototypeOf(ScoreWall.prototype), "penalties", this).call(this, self, player);
        }
    }]);

    return ScoreWall;
}(_BaseWall3.default);

exports.default = ScoreWall;

});

require.register("src/GameObject/Wall/SlowWall.js", function(exports, require, module) {
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

var _BaseWall2 = require("./BaseWall");

var _BaseWall3 = _interopRequireDefault(_BaseWall2);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var SlowWall = function (_BaseWall) {
    _inherits(SlowWall, _BaseWall);

    function SlowWall() {
        _classCallCheck(this, SlowWall);

        return _possibleConstructorReturn(this, (SlowWall.__proto__ || Object.getPrototypeOf(SlowWall)).apply(this, arguments));
    }

    _createClass(SlowWall, [{
        key: "init",
        value: function init(self) {
            _get(SlowWall.prototype.__proto__ || Object.getPrototypeOf(SlowWall.prototype), "init", this).call(this, self, self.data.wallSprites[2][1], "#3d3d3d");
        }
    }, {
        key: "penalties",
        value: function penalties(self, player) {
            player.maxSpeed /= 2;
            _get(SlowWall.prototype.__proto__ || Object.getPrototypeOf(SlowWall.prototype), "penalties", this).call(this, self, player);
        }
    }]);

    return SlowWall;
}(_BaseWall3.default);

exports.default = SlowWall;

});

require.register("src/GameObject/Wall/SpeedWall.js", function(exports, require, module) {
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

var _BaseWall2 = require("./BaseWall");

var _BaseWall3 = _interopRequireDefault(_BaseWall2);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var SpeedWall = function (_BaseWall) {
    _inherits(SpeedWall, _BaseWall);

    function SpeedWall() {
        _classCallCheck(this, SpeedWall);

        return _possibleConstructorReturn(this, (SpeedWall.__proto__ || Object.getPrototypeOf(SpeedWall)).apply(this, arguments));
    }

    _createClass(SpeedWall, [{
        key: "init",
        value: function init(self) {
            _get(SpeedWall.prototype.__proto__ || Object.getPrototypeOf(SpeedWall.prototype), "init", this).call(this, self, self.data.wallSprites[4][0], "#0010ff");
            self.speed *= 1.5;
        }
    }]);

    return SpeedWall;
}(_BaseWall3.default);

exports.default = SpeedWall;

});

require.register("src/GameObject/Wall/StalkerWall.js", function(exports, require, module) {
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

var _Random = require('../../Tools/Random');

var _Random2 = _interopRequireDefault(_Random);

var _Pools = require('../Pools');

var _Pools2 = _interopRequireDefault(_Pools);

var _BaseWall2 = require('./BaseWall');

var _BaseWall3 = _interopRequireDefault(_BaseWall2);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var StalkerWall = function (_BaseWall) {
    _inherits(StalkerWall, _BaseWall);

    function StalkerWall() {
        _classCallCheck(this, StalkerWall);

        return _possibleConstructorReturn(this, (StalkerWall.__proto__ || Object.getPrototypeOf(StalkerWall)).apply(this, arguments));
    }

    _createClass(StalkerWall, [{
        key: 'init',
        value: function init(self) {
            _get(StalkerWall.prototype.__proto__ || Object.getPrototypeOf(StalkerWall.prototype), 'init', this).call(this, self, self.data.wallSprites[0][2], "#02eaa3");
        }
    }, {
        key: 'newCoords',
        value: function newCoords(self) {
            self.i_newCoord = 5;
            self.direction = _Random2.default.range(0, 3);
            var player = _Pools2.default.Player.get(0);
            self.x = self.direction % 2 === 0 && _BaseWall3.default._bounds[self.direction] || player.x + player.halfWidth - self.halfWidth;
            self.y = self.direction % 2 !== 0 && _BaseWall3.default._bounds[self.direction] || player.y + player.halfHeight - self.halfHeight;
        }
    }]);

    return StalkerWall;
}(_BaseWall3.default);

exports.default = StalkerWall;

});

require.register("src/GameObject/Wall/StraightWall.js", function(exports, require, module) {
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

var _BaseWall2 = require("./BaseWall");

var _BaseWall3 = _interopRequireDefault(_BaseWall2);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var StraightWall = function (_BaseWall) {
    _inherits(StraightWall, _BaseWall);

    function StraightWall() {
        _classCallCheck(this, StraightWall);

        return _possibleConstructorReturn(this, (StraightWall.__proto__ || Object.getPrototypeOf(StraightWall)).apply(this, arguments));
    }

    _createClass(StraightWall, [{
        key: "init",
        value: function init(self) {
            self.startX = undefined;
            self.startY = undefined;
            _get(StraightWall.prototype.__proto__ || Object.getPrototypeOf(StraightWall.prototype), "init", this).call(this, self, self.data.wallSprites[4][3], "#6163ba");
        }
    }, {
        key: "newCoords",
        value: function newCoords(self) {
            self.i_newCoord = 5;
            if (self.startX === undefined) {
                _get(StraightWall.prototype.__proto__ || Object.getPrototypeOf(StraightWall.prototype), "newCoords", this).call(this, self);
                self.startX = self.x;
                self.startY = self.y;
            } else {
                self.x = self.startX;
                self.y = self.startY;
            }
        }
    }]);

    return StraightWall;
}(_BaseWall3.default);

exports.default = StraightWall;

});

require.register("src/GameObject/Wall/TimeWall.js", function(exports, require, module) {
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

var _BaseWall2 = require("./BaseWall");

var _BaseWall3 = _interopRequireDefault(_BaseWall2);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var TimeWall = function (_BaseWall) {
    _inherits(TimeWall, _BaseWall);

    function TimeWall() {
        _classCallCheck(this, TimeWall);

        return _possibleConstructorReturn(this, (TimeWall.__proto__ || Object.getPrototypeOf(TimeWall)).apply(this, arguments));
    }

    _createClass(TimeWall, [{
        key: "init",
        value: function init(self) {
            _get(TimeWall.prototype.__proto__ || Object.getPrototypeOf(TimeWall.prototype), "init", this).call(this, self, self.data.wallSprites[2][0], "#7c029b");
        }
    }, {
        key: "penalties",
        value: function penalties(self, player) {
            player.time -= 30000;
            _get(TimeWall.prototype.__proto__ || Object.getPrototypeOf(TimeWall.prototype), "penalties", this).call(this, self, player);
        }
    }]);

    return TimeWall;
}(_BaseWall3.default);

exports.default = TimeWall;

});

require.register("src/GameObject/Wall/TrackerWall.js", function(exports, require, module) {
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

var _Pools = require('../Pools');

var _Pools2 = _interopRequireDefault(_Pools);

var _Behaviors = require('../Behaviors');

var _Behaviors2 = _interopRequireDefault(_Behaviors);

var _BaseWall2 = require('./BaseWall');

var _BaseWall3 = _interopRequireDefault(_BaseWall2);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var TrackerWall = function (_BaseWall) {
    _inherits(TrackerWall, _BaseWall);

    function TrackerWall() {
        _classCallCheck(this, TrackerWall);

        return _possibleConstructorReturn(this, (TrackerWall.__proto__ || Object.getPrototypeOf(TrackerWall)).apply(this, arguments));
    }

    _createClass(TrackerWall, [{
        key: 'init',
        value: function init(self) {
            _get(TrackerWall.prototype.__proto__ || Object.getPrototypeOf(TrackerWall.prototype), 'init', this).call(this, self, self.data.wallSprites[4][1], "#6c1404");
            self.maxSpeed = self.speed;
        }
    }, {
        key: 'changeSpeed',
        value: function changeSpeed(self) {
            _Behaviors2.default.TurtleWall.changeSpeed(self);
            self.speed = self.maxSpeed;
        }
    }]);

    return TrackerWall;
}(_BaseWall3.default);

exports.default = TrackerWall;

});

require.register("src/GameObject/Wall/TurnBackWall.js", function(exports, require, module) {
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

var _BaseWall2 = require("./BaseWall");

var _BaseWall3 = _interopRequireDefault(_BaseWall2);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var TurnBackWall = function (_BaseWall) {
    _inherits(TurnBackWall, _BaseWall);

    function TurnBackWall() {
        _classCallCheck(this, TurnBackWall);

        return _possibleConstructorReturn(this, (TurnBackWall.__proto__ || Object.getPrototypeOf(TurnBackWall)).apply(this, arguments));
    }

    _createClass(TurnBackWall, [{
        key: "init",
        value: function init(self) {
            _get(TurnBackWall.prototype.__proto__ || Object.getPrototypeOf(TurnBackWall.prototype), "init", this).call(this, self, self.data.wallSprites[0][4], "#514f98");
        }
    }, {
        key: "newCoords",
        value: function newCoords(self) {
            if (self.initialized) self.direction = (self.direction + 2) % 4;else _get(TurnBackWall.prototype.__proto__ || Object.getPrototypeOf(TurnBackWall.prototype), "newCoords", this).call(this, self);
        }
    }]);

    return TurnBackWall;
}(_BaseWall3.default);

exports.default = TurnBackWall;

});

require.register("src/GameObject/Wall/TurtleWall.js", function(exports, require, module) {
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

var _Pools = require('../Pools');

var _Pools2 = _interopRequireDefault(_Pools);

var _Behaviors = require('../Behaviors');

var _Behaviors2 = _interopRequireDefault(_Behaviors);

var _BaseWall2 = require('./BaseWall');

var _BaseWall3 = _interopRequireDefault(_BaseWall2);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var TurtleWall = function (_BaseWall) {
    _inherits(TurtleWall, _BaseWall);

    function TurtleWall() {
        _classCallCheck(this, TurtleWall);

        return _possibleConstructorReturn(this, (TurtleWall.__proto__ || Object.getPrototypeOf(TurtleWall)).apply(this, arguments));
    }

    _createClass(TurtleWall, [{
        key: 'init',
        value: function init(self) {
            _get(TurtleWall.prototype.__proto__ || Object.getPrototypeOf(TurtleWall.prototype), 'init', this).call(this, self, self.data.wallSprites[1][1], "#901602");
            self.maxSpeed = self.speed;
            self.speed = 0;
        }
    }, {
        key: 'newCoords',
        value: function newCoords(self) {
            _Behaviors2.default.ImmobileWall.newCoords(self);
            self.i_newCoord = 0;
        }
    }, {
        key: 'changeSpeed',
        value: function changeSpeed(self) {
            _Pools2.default.Player.forEach(function (p) {
                self.speed = self.maxSpeed;
                var inHeight = self.y - p.height <= p.y && p.y <= self.y + self.height;
                var inWidth = self.x - p.width <= p.x && p.x <= self.x + self.width;
                if (self.x <= p.x && inHeight) self.direction = 0;else if (p.x + p.width <= self.x + self.width && inHeight) self.direction = 2;else if (self.y <= p.y && inWidth) self.direction = 3;else if (p.y + p.height <= self.y + self.height && inWidth) self.direction = 1;else self.speed = 0;
            });
        }
    }]);

    return TurtleWall;
}(_BaseWall3.default);

exports.default = TurtleWall;

});

require.register("src/GameObject/Wall/Wall.js", function(exports, require, module) {
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

var _BaseWall2 = require("./BaseWall");

var _BaseWall3 = _interopRequireDefault(_BaseWall2);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Wall = function (_BaseWall) {
    _inherits(Wall, _BaseWall);

    function Wall() {
        _classCallCheck(this, Wall);

        return _possibleConstructorReturn(this, (Wall.__proto__ || Object.getPrototypeOf(Wall)).apply(this, arguments));
    }

    _createClass(Wall, [{
        key: "init",
        value: function init(self) {
            _get(Wall.prototype.__proto__ || Object.getPrototypeOf(Wall.prototype), "init", this).call(this, self, self.data.wallSprites[0][0], "#0310eb");
        }
    }]);

    return Wall;
}(_BaseWall3.default);

exports.default = Wall;

});

require.register("src/Menu.js", function(exports, require, module) {
"use strict";

});

require.register("src/Tools/Collision.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _MathTools = require('./MathTools');

var _MathTools2 = _interopRequireDefault(_MathTools);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Collision = function () {
    function Collision() {
        _classCallCheck(this, Collision);
    }

    _createClass(Collision, null, [{
        key: 'isInWall',
        value: function isInWall(w) {
            var width = self.width + w.width;
            var height = self.height + w.height;
            return w.x - self.width <= self.x && self.x <= w.x + w.width + self.width && w.y - self.height <= self.y && self.y <= w.y + w.height + self.height && w.x - width <= self.x;
        }

        // http://stackoverflow.com/a/1879223/5813357

    }, {
        key: 'circleRect',
        value: function circleRect(circle, rect) {
            var radius = circle.width / 2;
            var circleX = circle.x + radius;
            var circleY = circle.y + radius;
            var closestX = _MathTools2.default.clamp(circleX, rect.x, rect.x + rect.width);
            var closestY = _MathTools2.default.clamp(circleY, rect.y, rect.y + rect.height);

            // Calculate the distance between the circle's center and this closest point
            var distanceX = circleX - closestX;
            var distanceY = circleY - closestY;

            // If the distance is less than the circle's radius, an intersection occurs
            var distanceSquared = distanceX * distanceX + distanceY * distanceY;
            return distanceSquared < radius * radius;
        }
    }, {
        key: 'rectRect',
        value: function rectRect(rect1, rect2) {
            var minX = rect1.x < rect2.x ? rect1.x : rect2.x;
            var minY = rect1.y < rect2.y ? rect1.y : rect2.y;
            var maxX = rect1.x < rect2.x ? rect2.x + rect2.width : rect1.x + rect1.width;
            var maxY = rect1.y < rect2.y ? rect2.y + rect2.height : rect1.y + rect1.height;
            return maxX - minX < rect1.width + rect2.width && maxY - minY < rect1.height + rect2.height;
        }
    }, {
        key: 'circleCircle',
        value: function circleCircle(circle1, circle2) {
            var r = (circle1.width + circle2.width) / 2;
            return r * r > _MathTools2.default.squareDistance(circle1.x, circle1.y, circle2.x, circle2.y);
        }
    }]);

    return Collision;
}();

exports.default = Collision;

});

require.register("src/Tools/Color.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Color = function () {
    function Color() {
        _classCallCheck(this, Color);
    }

    _createClass(Color, null, [{
        key: "rgbToHex",
        value: function rgbToHex(r, g, b) {
            var toHex = function toHex(x) {
                return Color.chars[(x - x % 16) / 16] + Color.chars[x % 16];
            };
            return "#" + toHex(r) + toHex(g) + toHex(b);
        }
    }, {
        key: "hexToRgb",
        value: function hexToRgb(hex) {
            var components = [0, 0, 0];
            var iComponent = -1;
            for (var i = 0; i < hex.length - 1; ++i) {
                iComponent += i % 2 === 0;
                components[iComponent] *= 16;
                components[iComponent] += Color.chars.indexOf(hex[i + 1]);
            }
            return components;
        }
    }]);

    return Color;
}();

exports.default = Color;

Color.chars = "0123456789ABCDEF";

});

require.register("src/Tools/Enum.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Enum = function Enum() {
    _classCallCheck(this, Enum);

    for (var _len = arguments.length, keys = Array(_len), _key = 0; _key < _len; _key++) {
        keys[_key] = arguments[_key];
    }

    this.keys = keys;
    this.index = {};
    for (var i = 0; i < keys.length; ++i) {
        this[keys[i]] = keys[i];
        this[i] = keys[i];
        this.index[keys[i]] = i;
    }
};

exports.default = Enum;

});

require.register("src/Tools/ImageHelper.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var ImageHelper = function () {
	function ImageHelper() {
		_classCallCheck(this, ImageHelper);
	}

	_createClass(ImageHelper, null, [{
		key: "imageToCanvas",

		// https://davidwalsh.name/convert-canvas-image
		value: function imageToCanvas(image) {
			var canvas = document.createElement("canvas");
			canvas.width = image.width;
			canvas.height = image.height;
			canvas.getContext("2d").drawImage(image, 0, 0);
			return canvas;
		}

		// https://davidwalsh.name/convert-canvas-image

	}, {
		key: "canvasToImage",
		value: function canvasToImage(canvas) {
			var image = new Image();
			image.src = canvas.toDataURL("image/png");
			image.setAttribute('crossOrigin', 'anonymous');
			return image;
		}

		// Doesn't work

	}, {
		key: "imageDataToImage",
		value: function imageDataToImage(data) {
			var canvas = document.createElement("canvas");
			canvas.width = data.width;
			canvas.height = data.height;
			canvas.getContext("2d").putImageData(data, 0, 0);
			return ImageHelper.canvasToImage(canvas);
		}
	}, {
		key: "imageToTile",
		value: function imageToTile(image, offsetX, offsetY, width, height) {
			var canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
			canvas.getContext("2d").drawImage(image, offsetX, offsetY, width, height, 0, 0, width, height);
			return ImageHelper.canvasToImage(canvas);
		}
	}]);

	return ImageHelper;
}();

exports.default = ImageHelper;

});

require.register("src/Tools/MathTools.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var MathTools = function () {
    function MathTools() {
        _classCallCheck(this, MathTools);
    }

    _createClass(MathTools, null, [{
        key: "degs",
        value: function degs(angleInRadians) {
            return angleInRadians * 180 / Math.PI;
        }
    }, {
        key: "rads",
        value: function rads(angleInDegrees) {
            return angleInDegrees * Math.PI / 180;
        }
    }, {
        key: "sqpw",
        value: function sqpw(x) {
            return x * x;
        }
    }, {
        key: "squareDistance",
        value: function squareDistance(x, y, x2, y2) {
            return (x - x2) * (x - x2) + (y - y2) * (y - y2);
        }
    }, {
        key: "distance",
        value: function distance(x, y, x2, y2) {
            return Math.sqrt(MathTools.squareDistance.apply(MathTools, arguments));
        }
    }, {
        key: "direction",
        value: function direction(x, y, x2, y2) {
            if (y == y2) return x <= x2 ? 0 : 180;
            if (x == x2) return y < y2 ? 270 : 90;
            var dir = MathTools.degs(Math.acos(MathTools.sqpw(x - x2) / MathTools.squareDistance(x, y, x2, y2)));
            if (x < x2) return y2 <= y ? dir : 360 - dir;
            return y < y2 ? dir + 180 : 180 - dir;
        }
    }, {
        key: "clamp",
        value: function clamp(value, min, max) {
            return value < min ? min : max < value ? max : value;
        }
    }]);

    return MathTools;
}();

exports.default = MathTools;

});

require.register("src/Tools/Random.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var Random = function () {
	function Random() {
		_classCallCheck(this, Random);
	}

	_createClass(Random, null, [{
		key: "range",
		value: function range(min, max) {
			return Math.floor(Math.random() * (max + 1 - min) + min);
		}
	}, {
		key: "random",
		value: function random() {
			return Math.random();
		}
	}]);

	return Random;
}();

exports.default = Random;

});

require.register("src/Tools/Settings.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }return target;
};

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Settings = function () {
    function Settings(defaultSettings) {
        _classCallCheck(this, Settings);

        this.default = defaultSettings;
        this.load();
    }

    _createClass(Settings, [{
        key: "save",
        value: function save() {
            localStorage.setItem(this.constructor.name, JSON.stringify(this.current));
        }
    }, {
        key: "load",
        value: function load() {
            var loaded = localStorage.getItem(this.constructor.name);
            if (loaded) loaded = JSON.parse(loaded);
            this.current = loaded || _extends({}, this.default);
        }
    }]);

    return Settings;
}();

exports.default = Settings;

});

require.register("src/Tools/Tileset.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

var _ImageHelper = require('./ImageHelper');

var _ImageHelper2 = _interopRequireDefault(_ImageHelper);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var Tileset = function () {
	function Tileset(src) {
		_classCallCheck(this, Tileset);

		this.tileset = new Image();
		this.tileset.src = src;
		this.tileset.setAttribute('crossOrigin', 'anonymous');
	}

	_createClass(Tileset, [{
		key: 'getTiles',
		value: function getTiles(tileWidth, tileHeight, offsetX, offsetY) {
			offsetX = offsetX || 0;
			offsetY = offsetY || 0;
			var width = this.tileset.width - offsetX;
			var height = this.tileset.height - offsetY;
			var tiles = [];
			for (var x = 0; x * tileWidth < width; ++x) {
				var column = [];
				for (var y = 0; y * tileHeight < height; ++y) {
					column.push(_ImageHelper2.default.imageToTile(this.tileset, offsetX + x * tileWidth, offsetY + y * tileHeight, tileWidth, tileHeight));
				}tiles.push(column);
			}
			return tiles;
		}
	}]);

	return Tileset;
}();

exports.default = Tileset;

});

require.register("src/WallFall.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

var _Game = require('./Game');

var _Game2 = _interopRequireDefault(_Game);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var WallFall = function () {
	function WallFall(data) {
		var _this = this;

		_classCallCheck(this, WallFall);

		window.onkeyup = function (ev) {
			return _this._onKeyUp(ev);
		};
		this.data = data;
		this.game = new _Game2.default(this.data);
	}

	_createClass(WallFall, [{
		key: 'run',
		value: function run() {
			this.game.start();
		}
	}, {
		key: '_onKeyUp',
		value: function _onKeyUp(event) {
			if (event.keyCode == 27) this.game.pause = !this.game.pause;
			if (event.keyCode == 13) {
				this.game.stop = true;
				this.game = new _Game2.default(this.data);
				this.run();
			}
		}
	}]);

	return WallFall;
}();

exports.default = WallFall;

});

require.register("src/initialize.js", function(exports, require, module) {
'use strict';

document.addEventListener('DOMContentLoaded', function () {
  require('./main.js');
  console.log('Initialized app');
});

});

require.register("src/main.js", function(exports, require, module) {
'use strict';

var _WallFall = require('./WallFall');

var _WallFall2 = _interopRequireDefault(_WallFall);

var _Data = require('./Data');

var _Data2 = _interopRequireDefault(_Data);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

window.onload = function () {
    _Data2.default.init(function (data) {
        return new _WallFall2.default(data).run();
    });
};

});

require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=WallFall.js.map