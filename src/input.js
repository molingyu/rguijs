/**
 * 输入模块。
 *
 * @namespace RGUI.Input
 */
const Input = {
  /**
   * 初始化 Input 模块。
   * @memberof RGUI.Input
   */
  init: function () {
    this._mouseScroll = 0;
    this.keyStauts = {};
    this._mouseKey = [
      'MouseLeft',
      'MouseMiddle',
      'MouseRight'
    ];
    this._x = 0;
    this._y = 0;
    this._setupEventHandlers();
  },

  _setupEventHandlers: function () {
    let self = this;
    document.addEventListener('mousemove', (event)=>{
      self._x = event.clientX;
      self._y = event.clientY;
    });
    document.addEventListener('mousewheel', (event)=>{
      self._mouseScroll = event.wheelDelta > 0 ? 1 : -1;
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

  /**
   * 每帧更新。
   * @memberof RGUI.Input
   */
  update: function () {
    this._mouseScroll = 0;
  },

  /**
   * 清除。
   * @memberof RGUI.Input
   */
  clear: function () {
    this._mouseScroll = 0;
    this._x = 0;
    this._y = 0;
    this.keyStauts = {};
  },

  /**
   * 判断键是否按下。
   * @memberof RGUI.Input
   * @param {String} keyName - 欲判断的键名。
   * @returns {boolean}
   */
  keyDown: function (keyName) {
    if(!this.keyStauts[keyName]) return false;
    return this.keyStauts[keyName] == 1
  },

  /**
   * 判断键是否按住。
   * @param {String} keyName - 欲判断的键名。
   * @memberof RGUI.Input
   * @returns {boolean}
   */
  keyPress: function (keyName) {
    if(!this.keyStauts[keyName]) return false;
    return this.keyStauts[keyName] == -1
  },

  /**
   * 判断键是否弹起。
   * @param {String} keyName - 欲判断的键名。
   * @memberof RGUI.Input
   * @returns {boolean}
   */
  keyUp: function (keyName) {
    if(!this.keyStauts[keyName]) return true;
    return this.keyStauts[keyName] == 0
  },

  /**
   * 获取鼠标当前坐标。
   * @memberof RGUI.Input
   * @returns {Object} - {x: Number, y: Number}
   */
  mousePos : function () {
    return {'x': this._x, 'y': this._y}
  }

};

/**
 * 鼠标当前坐标 X 值。
 *
 * @name RGUI.Input.x
 * @type {number}
 */
Object.defineProperty(Input, 'x', {
    get() {
      return this._x
    }
  }
);

/**
 * 鼠标当前坐标 Y 值。
 *
 * @name RGUI.Input.y
 * @type {number}
 */
Object.defineProperty(Input, 'y', {
    get() {
      return this._y
    }
  }
);

/**
 * 鼠标滚轮值。
 *
 * @name RGUI.Input.mouseScroll
 * @type {number}
 */
Object.defineProperty(Input, 'mouseScroll', {
  get() {
    return this._mouseScroll
  }
}
);

module.exports = Input;