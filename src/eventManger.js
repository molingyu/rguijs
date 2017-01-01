const Svent = require('../lib/svent');
const Input = require('./input');

/**
 * Class EventManger.
 * @author shitake <z1522716486@hotmail.com>
 * @license MIT <https://mit-license.org/>
 */
class EventManger extends Svent.EventManger {
  /**
   *
   * @param {Base} obj
   */
  constructor(obj) {
    super();
    this.obj = obj;
    this.mouseFocus = false;
    this.keyboardEvent = []
  }

  update() {
    super.update();
    if(this.obj.status && this.obj.visible) {
      this.mouseUpdate();
      this.keyboardEvent.forEach((name)=>{
        this.keyboardUpdate(this.events[name])
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
    if(Input.mouseScroll != 0) {
      this.trigger('mouseScroll', {scrollValue: Input.mouseScroll})
    }
  }

  keyboardUpdate(event) {
    if (event.type == 1 && !this.mouseFocus) return false;
    //TODO error
    // if(type == 'down') {
    //   if(Input.keyDown(name)) this.trigger(event.name)
    // } else if(type == 'up') {
    //   if(Input.keyUp(name)) this.trigger((event.name))
    // } else {
    //   Error('Error: error event state.')
    // }
  }


  static isMouseEvent(name) {
    if(['MouseLeft', 'MouseMiddle', 'MouseRight'].indexOf(name) >= 0) {
      if(name.split(':').length == 1) name = 'down:' + name;
      return true;
    }
    return ['mouseOut', 'mouseIn', 'mouseScroll'].indexOf(name) >= 0
  }

  static isKeyboardEvent(name) {
    let keyName = [
      'Shift',
      'Tab',
      'CapsLock',
      'Meta',
      'Control',
      'Alt',
      'ContextMenu',
      'Escape',
      'Insert',
      'Delete',
      'Backspace',
      'NumLock',
      'ScrollLock',
      'Enter',
      'PageUp',
      'PageDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown'
    ];
    if(keyName.indexOf(name) >= 0) return true;
    if(name.match(/F[0-9]+/) == name) return true;
    return name.match(/[a-zA-Z0-9`~!@#$%^&*?:;'"><,.()_+-=\\\/\|\{\}\[\]]/) == name
  }

  /**
   *
   * @param {String} name
   * @param {Object} conf
   * @param {Function} callback
   */
  on(name, conf, callback) {
    if(name == 'click') name = 'down:mouseLeft';
    let type = 0;
    if(EventManger.isMouseEvent(name)) type = 1;
    if(EventManger.isKeyboardEvent(name)){
      type = 2;
      if(name.split(':').length == 1) name = 'down:' + name;
      this.keyboardEvent.push(name)
    }
    conf.type = type;
    super.on(name, conf, callback)
  }

  /**
   *
   * @param {String} name
   * @param {Object} conf
   * @param {Function} callback
   */
  onAsync(name, conf, callback) {
    if(name == 'click') name = 'down:mouseLeft';
    let type = 0;
    if(EventManger.isMouseEvent(name)) type = 1;
    if(EventManger.isKeyboardEvent(name)){
      type = 2;
      this.keyboardEvent.push(name)
    }
    conf.type = type;
    super.onAsync(name, conf, callback)
  }

}

module.exports = EventManger;