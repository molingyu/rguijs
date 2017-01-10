const Svent = require('./lib/svent');

/**
 * RPGMaker MV GUI 框架。
 *
 * @module RGUI
 * @namespace RGUI
 * @author shitake <z1522716486@hotmail.com>
 * @license MIT <https://mit-license.org/>
 */
const RGUI = {
  Input: require('./input'),
  EventManager: require('./eventManager'),
  Box: require('./box'),
  Display: require('./display'),
  Utils: require('./utils'),
  /**
   * RGUI 当前版本。
   *
   * @static
   * @constant
   * @name VERSION
   * @memberof RGUI
   * @type {String}
   */
  VERSION: '0.1.0',
  /**
   * 是否支持鼠标。
   *
   * @name MOUSE
   * @memberof RGUI
   * @type {Boolean}
   */
  MOUSE: true,
  /**
   * 是否支持键盘。
   *
   * @name KEYBOARD
   * @memberof RGUI
   * @type {Boolean}
   */
  KEYBOARD: true,
  /**
   * 已加载控件数。
   *
   * @name Controls
   * @memberof RGUI
   * @type {Number}
   */
  Controls: 0,
  /**
   * 初始化 RGUI 模块。
   * @memberof RGUI
   */
  init: function () {
    this._ID = 0;
    this._langDir = './lang';
    this._defaultLang = 'zh_cn';
    this._lang = 'zh_cn';
    this.loadControls();
    Input.init();
    this._eventManager = new Svent.EventManager();
    this.seyHello()
  },

  /**
   * 获取控件 ID。
   * @memberof RGUI
   * @returns {Number}
   */
  getID: function () {
    return this._ID++
  },

  /**
   * 将指定值转化到特定区间。
   *
   * @memberof RGUI
   * @param {Number} num 欲判断的值。
   * @param {Number} min 区间的下界。
   * @param {Number} max 区间的上界。
   * @returns {Number}
   */
  boundary: function (num, min, max) {
    return num > min ? num < max ? num : max : min
  },

  /**
   * 输出当前运行的 RGUI 的版本和控件数。
   *
   * @memberof RGUI
   */
  seyHello: function () {
    let args = [
      '\n %c %c %c RGUI ' + this.VERSION +' - ✰ Controls:' + this.Controls +  ' ✰  %c ' + ' %c ' + ' http://github.com/molingyu/rguijs/  %c %c ♥%c♥%c♥ \n\n',
      'background: #ff66a5; padding:5px 0;',
      'background: #ff66a5; padding:5px 0;',
      'color: #ff66a5; background: #030307; padding:5px 0;',
      'background: #ff66a5; padding:5px 0;',
      'background: #ffc3dc; padding:5px 0;',
      'background: #ff66a5; padding:5px 0;',
      'color: #ff2424; background: #fff; padding:5px 0;',
      'color: #ff2424; background: #fff; padding:5px 0;',
      'color: #ff2424; background: #fff; padding:5px 0;'
    ];
    console.log.apply(console, args);
  },

  loadControls: function () {
    this.Button = require('./controls/Button');
    this.ImageBox = require('./controls/imageBox');
    this.SpriteButton = require('./controls/spriteButton');
    this.ProgressBar = require('./controls/progressBar');
  }
};

/**
 * RGUI 当前语言。
 *
 * @name RGUI.lang
 * @type {String}
 */
Object.defineProperty(RGUI, 'lang', {
    get() {
      return this._lang
    }
  }
);

/**
 * RGUI 默认语言。
 *
 * @name RGUI.defaultLang
 * @type {String}
 */
Object.defineProperty(RGUI, 'defaultLang', {
    get() {
      return this._defaultLang
    }
  }
);

/**
 * 全局事件管理器。
 *
 * @name RGUI.eventManager
 * @type {Svent.EventManager}
 */
Object.defineProperty(RGUI, 'eventManager', {
    get() {
      return this._eventManager
    }
  }
);

module.exports = RGUI;