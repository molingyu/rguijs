/**
 * Created by shitake on 16-12-7.
 */

/**
 * @module Svent
 */
const RGUI = {
  init: function () {
    this._ID = 0;
  },

  getID: function () {
    return this._ID++
  }
};

module.exports = RGUI;