const RGUI = require('../rgui');
const Base = require('../base');

RGUI.Controls = RGUI.Controls + 1;

/**
 * 按钮控件基类。
 * @memberof RGUI
 * @extends RGUI.Base
 */
class ButtonBase extends Base {

  get state() { return this._state }
  set state(value) {
    value = RGUI.boundary(Number(value), 0, 3);
    let old = this._state;
    switch (value) {
      case 0:
        this.default();
        break;
      case 1:
        this.focus();
        break;
      case 2: this.down();
      break;
      case 3:
        this.enfeeble();
    }
    this._state = value;
    this.eventManager.trigger('changeState', {old: old, new: this._state})
  }

  /**
   *
   * @param {Number} obj.state - 按钮状态
   */
  constructor(obj) {
    super(obj);
    this._state = obj.state || 0;
    this.create()
  }

  /**
   * @interface
   */
  default() {
    this.eventManger.trigger('onDefault')
  }

  /**
   * @interface
   */
  focus() {
    this.eventManger.trigger('onFocus')
  }

  /**
   * @interface
   */
  down() {
    this.eventManger.trigger('onDown')
  }

  /**
   * @interface
   */
  enfeeble() {
    this.eventManger.trigger('onEnfeeble')
  }

  defEventCallback() {
    let self = this;
    this.eventManager.on('changeFocus', {}, (info)=>{ self.state = (info.new ? 1 : 0) });
    this.eventManager.on('mouseIn', {}, ()=>{ self.state = 1 });
    this.eventManager.on('mouseOut', {}, ()=>{ self.state = 0 });
    this.eventManager.on('enable', {}, ()=>{ self.state = 3 });
    this.eventManager.on('disable', {}, ()=>{ self.state = 0 });
    this.eventManager.on('down:MouseLeft', {}, ()=>{ self.state = 2 });
    this.eventManager.on('up:MouseLeft', {}, ()=>{
      if(self.state == 2) self.state = self.box.hit(RGUI.Input.x, RGUI.Input.y) ? 1 : 0;
    })
  }
}

module.exports = ButtonBase;