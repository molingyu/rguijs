import Svent from 'svent'
import Base from 'base'
import Input from 'input'

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
    let codes = event.name.split(':');
    let name, type;
    if (codes.length() == 2) {
      type = codes[0];
      name = codes[1]
    } else {
      type = 'down';
      name = codes[0]
    }
    if (name.indexOf() >= 0 && !this.mouseFocus) return false;
    if(type == 'down') {
      if(Input.keyDown(name)) this.trigger(event.name)
    } else if(type == 'up') {
      if(Input.keyUp(name)) this.trigger((event.name))
    } else {
      Error('Error: error event type.')
    }
  }


  static isMouseEvent(name) {
    return ['mouseOut', 'mouseIn', 'mouseScroll'].indexOf(name) >= 0
  }

  static isKeyboardEvent(name) {
    let keyName = [
      'MouseLeft',
      'MouseMiddle',
      'MouseRight',
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
    if(name.match(/F[0-9]+/) == name) return ture;
    return name.match(/[a-zA-Z0-9`~!@#$%^&*?:;'"><,.()_+-=\\\/\|\{\}\[\]]/) == name
  }

  /**
   *
   * @param {String} name
   * @param {Number} index
   * @param {Function} callback
   */
  on(name, index = null, callback) {
    if(name == 'click') name = 'down:mouseLeft';
    let type = 0;
    if(EventManger.isMouseEvent(name)) type = 1;
    if(EventManger.isKeyboardEvent(name)){
      type = 2;
      this.keyboardEvent.push(name)
    }
    super.on(name, {type: type, index: index}, callback)
  }

}

export default EventManger