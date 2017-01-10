/**
 * 输入模块。
 *
 * @namespace RGUI.Input
 */
const Input = {
  keyName: {
    'MouseLeft': 0x01,
    'MouseRight': 0x02,
    'MouseCenter': 0x04,
    'Backspace': 0x08,
    'Tab': 0x09,
    'Enter': 0x0D,
    'Shift': 0x10,
    'Control': 0x11,
    'Alt': 0x12,
    'CapsLock': 0x14, //CAPS LOCK键
    'Escape': 0x1B,
    'Space': 0x20,
    'PageUp': 0x21, //PAGE UP键
    'PageDown': 0x22, //PAGE DOWN键
    'Home': 0x24,
    'ArrowLeft': 0x25, //LEFT ARROW键
    'ArrowUp': 0x26,
    'ArrowRight': 0x27,
    'ArrowDown': 0x28,
    'Insert': 0x2D,
    'Delete': 0x2E,
    'NumLock': 0x90, //NUMLOCK键
    'ScrollLock': 0x91, //SCROLL LOCK键

    '0': 0x30,
    '1': 0x31,
    '2': 0x32,
    '3': 0x33,
    '4': 0x34,
    '5': 0x35,
    '6': 0x36,
    '7': 0x37,
    '8': 0x38,
    '9': 0x39,

    'A': 0x41,
    'B': 0x42,
    'C': 0x43,
    'D': 0x44,
    'E': 0x45,
    'F': 0x46,
    'G': 0x47,
    'H': 0x48,
    'I': 0x49,
    'J': 0x4A,
    'K': 0x4B,
    'L': 0x4C,
    'M': 0x4D,
    'N': 0x4E,
    'O': 0x4F,
    'P': 0x50,
    'Q': 0x51,
    'R': 0x52,
    'S': 0x53,
    'T': 0x54,
    'U': 0x55,
    'V': 0x56,
    'W': 0x57,
    'X': 0x58,
    'Y': 0x59,
    'Z': 0x5A,

    'Num0': 0x60,
    'Num1': 0x61,
    'Num2': 0x62,
    'Num3': 0x63,
    'Num4': 0x64,
    'Num5': 0x65,
    'Num6': 0x66,
    'Num7': 0x67,
    'Num8': 0x68,
    'Num9': 0x69,
    'Nul': 0x6A, //乘号键
    'Add': 0x6B, //加号键
    'Sep': 0x6C, //分隔符键
    'Sub': 0x6D, //减号键
    'Dec': 0x6E, //小数点键
    'Div': 0x6F, //除号键

    'F1': 0x70,
    'F2': 0x71,
    'F3': 0x72,
    'F4': 0x73,
    'F5': 0x74,
    'F6': 0x75,
    'F7': 0x76,
    'F8': 0x77,
    'F9': 0x78,
    'F10': 0x79,
    'F11': 0x7A,
    'F12': 0x7B
  },
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
      self.keyStauts[event.keyCode] = 1
    });
    document.addEventListener('mouseup', (event)=>{
      self.keyStauts[event.keyCode] = 0
    });
    document.addEventListener('keydown', (event)=>{
      self.keyStauts[event.keyCode] = 1;
    });
    document.addEventListener('keyup', (event)=>{
      self.keyStauts[event.keyCode] = 0
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
   * @returns {Boolean}
   */
  keyDown: function (keyName) {
    if(!this.keyStauts[this.keyName[keyName]]) return false;
    return this.keyStauts[this.keyName[keyName]] == 1
  },

  /**
   * 判断键是否按住。
   * @param {String} keyName - 欲判断的键名。
   * @memberof RGUI.Input
   * @returns {Boolean}
   */
  keyPress: function (keyName) {
    if(!this.keyStauts[this.keyName[keyName]]) return false;
    return this.keyStauts[this.keyName[keyName]] == -1
  },

  /**
   * 判断键是否弹起。
   * @param {String} keyName - 欲判断的键名。
   * @memberof RGUI.Input
   * @returns {Boolean}
   */
  keyUp: function (keyName) {
    if(!this.keyStauts[this.keyName[keyName]]) return true;
    return this.keyStauts[this.keyName[keyName]] == 0
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
 * @type {Number}
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
 * @type {Number}
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
 * @type {Number}
 */
Object.defineProperty(Input, 'mouseScroll', {
  get() {
    return this._mouseScroll
  }
}
);

module.exports = Input;