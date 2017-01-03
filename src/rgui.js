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
  EventManger: require('./eventManger'),
  Box: require('./box'),
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
    this.loadControls();
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

  boundary: function (num, min, max) {
    return num > min ? num < max ? num : max : min
  },

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
    this.ImageBox = require('./controls/imageBox');
    this.SpriteButton = require('./controls/spriteButton');
    this.ProgressBar = require('./controls/progressBar');
  }
};

module.exports = RGUI;