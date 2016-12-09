import Input from 'input'
import EventManger from 'eventManger'
import Box from 'box'

/**
 * @module Svent
 * @author shitake <z1522716486@hotmail.com>
 * @license MIT <https://mit-license.org/>
 */
const RGUI = {
  Input: Input,
  EventManger: EventManger,
  Box: Box,
  init: function () {
    this._ID = 0;
  },

  getID: function () {
    return this._ID++
  }
};

module.exports = RGUI;