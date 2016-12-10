import Input from './input'
import EventManger from './eventManger'
import Box from './box'

/**
 * @module Svent
 * @author shitake <z1522716486@hotmail.com>
 * @license MIT <https://mit-license.org/>
 */
const RGUI = {
  VERSION: '0.1.0',
  MOUSE: true,
  KEYBOARD: true,
  Controls: 0,
  Input: Input,
  EventManger: EventManger,
  Box: Box,
  init: function () {
    this._ID = 0;
    this.loadControls();
    this.seyHello()
  },

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
    this.SpriteButton = require('./controls/imageBox');
  }
};

module.exports = RGUI;