/**
 * @module Input
 * @author shitake <z1522716486@hotmail.com>
 * @license MIT <https://mit-license.org/>
 */
const Input = {
  init: function () {
    this.mouseScroll = 0;
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

  _setupEventHandlers: function () {
    let self = this;
    document.addEventListener('mousemove', (event)=>{
      self.x = event.clientX;
      self.y = event.clientY;
    });
    document.addEventListener('mousewheel', (event)=>{
      self.mouseScroll = event.wheelDelta > 0 ? 1 : -1;
    });
    document.addEventListener('mousedown', (event)=>{
      let key = this._mouseKey[event.button];
      self.keyStauts[key] = 1
    });
    document.addEventListener('mouseup', (event)=>{
      let key = this._mouseKey[event.button];
      self.keyStauts[key] = 0
    });
    document.addEventListener('keydown', (event)=>{
      self.keyStauts[event.keyCode == 32 ? 'Space' : event.key] = 1;
    });
    document.addEventListener('keyup', (event)=>{
      self.keyStauts[event.keyCode == 32 ? 'Space' : event.key] = 0
    });
  },

  update: function () {
    this.mouseScroll = 0;
  },

  clear: function () {
    this.mouseScroll = 0;
    this.x = 0;
    this.y = 0;
    this.keyStauts = {};
  },

  keyDown: function (keyName) {
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