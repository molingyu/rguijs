/**
 * Created by shitake on 16-12-7.
 */

/**
 * @module Input
 * @author shitake <z1522716486@hotmail.com>
 * @license MIT <https://mit-license.org/>
 */
const Input = {
  init: function () {
    this._mouseScroll = 0;
    this.keyStauts = {};
    this._mouseKey = [
      'MouseLeft',
      'MouseMiddle',
      'MouseRight'
    ];
    this.x = 0;
    this.y = 0;
    this._setupEventHandlers();
  },

  _mouseScroll: function (event) {
    if (event.wheelDelta) {
      if (event.wheelDelta > 0) {
        this._mouseScroll = 1;
      }
      if (event.wheelDelta < 0) {
        this._mouseScroll = -1;
      }
    } else if (event.detail) {
      if (event.detail> 0) {
        this._mouseScroll = 1;
      }
      if (event.detail< 0) {
        this._mouseScroll = -1;
      }
    }
  },

  _setupEventHandlers: function () {
    document.addEventListener('mousemove', (event)=>{
      this.x = event.clientX;
      this.y = event.clientY;
    });
    //TODO: mouse scroll 不同浏览器实现
    document.addEventListener('DOMMouseScroll', this._mouseScroll);
    document.addEventListener('mousedown', (event)=>{
      let key = this._mouseKey[event.button];
      this.keyStauts[key] = 1
    });
    document.addEventListener('mouseup', (event)=>{
      let key = this._mouseKey[event.button];
      this.keyStauts[key] = 0
    });
    document.addEventListener('keydown', (event)=>{
      this.keyStauts[event.keyCode == 32 ? 'Space' : event.key] = 1;
    });
    document.addEventListener('keyup', (event)=>{
      this.keyStauts[event.keyCode == 32 ? 'Space' : event.key] = 0
    });
  },

  update: function () {
    this._mouseScroll = 0;
  },

  clear: function () {
    this._mouseScroll = 0;
    this.keyStauts = {};
  },

  keyDown: function (keyName) {
    console.log(keyName, this.keyStauts[keyName]);
    if(!this.keyStauts[keyName]) return false;
    return this.keyStauts[keyName] == 1
  },

  keyPress: function (keyName) {
    if(!this.keyStauts[keyName]) return false;
    return this.keyStauts[keyName] == -1
  },

  keyUp: function (keyName) {
    if(!this.keyStauts[keyName]) return true;
    return this.keyStauts[keyName] == 0
  },

  mousePos : function () {
    return {'x': this.x,'y': this.y}
  }

};

export default Input