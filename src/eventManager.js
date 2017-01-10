const Svent = require('../lib/svent');
const Input = require('./input');

/**
 * 事件管理器类，继承自 [Svent.EventManager](https://github.com/molingyu/sventjs)。
 *
 * @extends Svent.EventManager
 * @memberof RGUI
 */
class EventManager extends Svent.EventManager {
  /**
   *
   * @param {Base} obj
   */
  constructor(obj) {
    super();
    this._class = EventManager;
    this.obj = obj;
    this.mouseFocus = false;
    this.keyboardEvent = []
  }

  update() {
    super.update();
    if(this.obj.status && this.obj.visible) {
      this.mouseUpdate();
      this.keyboardEvent.forEach((key)=>{
        this.keyboardUpdate(key, this.events[key.nameStr])
      })
    }
  }

  mouseUpdate() {
    let x = Input.x;
    let y = Input.y;
    let box = this.obj.box;
    if(!this.mouseFocus && box.hit(x, y)) {
      this.trigger('mouseIn',{x: x, y: y});
      this.mouseFocus = true
    } else if(this.mouseFocus && !box.hit(x, y)) {
      this.trigger('mouseOut', {x: x, y: y});
      this.mouseFocus = false
    }
    if(Input._mouseScroll != 0) {
      this.trigger('mouseScroll', {scrollValue: Input.mouseScroll})
    }
  }

  keyboardUpdate(key, event) {
    if (event.type == 1 && !this.mouseFocus) return false;
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


  static isMouseEvent(name) {
    return ['MouseLeft', 'MouseCenter', 'MouseRight', 'mouseOut', 'mouseIn', 'mouseScroll'].indexOf(name) >= 0
  }

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
    if(name == 'click') name = 'mouseLeft';
    let key = {nameStr: name};
    if(name.match(/^(down|press|up)\:\w*/)) {
      key.keyType = name.split(':')[0];
      key.keyName = name.split(':')[1]
    } else {
      key.keyType = 'down';
      key.keyName = name;
    }
    let type = 0;
    if(EventManager.isKeyboardEvent(name)) {
      type = EventManager.isMouseEvent(name) ? 1 : 2;
      this.keyboardEvent.push(key)
    } else if(EventManager.isMouseEvent(name)) {
      type = 3;
    }
    return type
  }

  /**
   *
   * @param {String} name
   * @param {Object} conf
   * @param {Function} callback
   */
  on(name, conf, callback) {
    conf.type = this._keyName(name);
    super.on(name, conf, callback)
  }

  /**
   *
   * @param {String} name
   * @param {Object} conf
   * @param {Function} callback
   */
  onAsync(name, conf, callback) {
    conf.type = this._keyName(name);
    conf.type = type;
    super.onAsync(name, conf, callback)
  }

}

module.exports = EventManager;