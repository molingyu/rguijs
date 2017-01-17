const Svent = require('./lib/svent');
const Input = require('./input');

/**
 * 事件管理器类，继承自 [Svent.EventManager](https://github.com/molingyu/sventjs)。
 * 主要增加了了对鼠标、键盘事件的自动监听。
 *
 * @extends Svent.EventManager
 * @memberof RGUI
 */
class EventManager extends Svent.EventManager {
  /**
   * 创建一个事件管理器。
   *
   * @param {Base} obj - 事件管理器所对应的对象。
   */
  constructor(obj) {
    super();
    this._class = EventManager;
    this.obj = obj;
    this.mouseFocus = false;
    this.keyboardEvent = []
  }

  /**
   * 更新函数，每帧调用一次。
   */
  update() {
    super.update();
    if(this.obj.status && this.obj.visible) {
      if(RGUI.MOUSE) this.mouseUpdate();
      if(!RGUI.KEYBOARD) return;
      this.keyboardEvent.forEach((key)=>{
        this.keyboardUpdate(key, this.events[key.nameStr])
      })
    }
  }

  mouseUpdate() {
    let x = Input.x;
    let y = Input.y;
    let box = this.obj.box;
    if(box.hit(x, y)) {
      if(!this.mouseFocus) {
        this.trigger('mouseIn',{x: x, y: y});
        this.mouseFocus = true
      }
      if(Input.mouseScroll != 0) {
        this.trigger('mouseScroll', {scrollValue: Input.mouseScroll})
      }
    } else if(this.mouseFocus) {
      this.trigger('mouseOut', {x: x, y: y});
      this.mouseFocus = false
    }
  }

  keyboardUpdate(key, event) {
    if (event.info.type == 1 && !this.mouseFocus) return false;
    if(key.keyType == 'down') {
      if(Input.keyDown(key.keyName)) this.trigger(event.name)
    } else if(key.keyType == 'press') {
      if(Input.keyPress(key.keyName)) this.trigger((event.name))
    } else if(key.keyType == 'up'){
      if(Input.keyUp(key.keyName)) this.trigger((event.name))
    } else {
      Error('Error: error event state.')
    }
  }


  /**
   * 判断是否为鼠标示事件。
   *
   * @param {String} name - 事件名。
   * @returns {Boolean}
   */
  static isMouseEvent(name) {
    return ['MouseLeft', 'MouseCenter', 'MouseRight', 'mouseOut', 'mouseIn', 'mouseScroll'].indexOf(name) >= 0
  }

  /**
   * 判断是否为键盘示事件。
   *
   * @param {String} name - 事件名。
   * @returns {Boolean}
   */
  static isKeyboardEvent(name) {
    return Input.keyName[name] >= 0
  }

  /*
    0 - 普通事件
    1 - 鼠标键盘事件
    2 - 键盘事件
    3 - 鼠标事件
   */
  _keyName(name) {
    if(name == 'click') name = 'MouseLeft';
    let key = {nameStr: name};
    if(name.match(/^(down|press|up):\w*/)) {
      key.keyType = name.split(':')[0];
      key.keyName = name.split(':')[1]
    } else {
      key.keyType = 'down';
      key.keyName = name;
    }
    let type = 0;
    if(EventManager.isKeyboardEvent(key.keyName)) {
      type = EventManager.isMouseEvent(key.keyName) ? 1 : 2;
      this.keyboardEvent.push(key)
    } else if(EventManager.isMouseEvent(key.keyName)) {
      type = 3;
    }
    return type
  }

  /**
   * 添加一个普通事件回调。
   *
   * @param {String} name - 事件名。
   * @param {Object} conf - 配置。
   * @param {Function} callback - 回调函数。
   */
  on(name, conf, callback) {
    conf.info = {type: this._keyName(name)};
    super.on(name, conf, callback)
  }

  /**
   * 添加一个异步事件回调。
   *
   * @param {String} name - 事件名。
   * @param {Object} conf - 配置。
   * @param {Function} callback - 回调函数。
   */
  onAsync(name, conf, callback) {
    conf.info = {type: this._keyName(name)};
    super.onAsync(name, conf, callback)
  }

}

module.exports = EventManager;