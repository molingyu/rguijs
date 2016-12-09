import Box from 'box'
import PIXI from 'pixi.js'
import EventManger from 'eventManger'

/**
 * Class Base.
 * @author shitake <z1522716486@hotmail.com>
 * @license MIT <https://mit-license.org/>
 */
class Base extends PIXI.Container {
  /**
   *
   * @param {Object} obj
   */
  constructor(obj = {}) {
    super();
    this._uID = RGUI.getID();
    this._x = obj.x || 0;
    this._y = obj.y || 0;
    this._width = obj.width || 0;
    this._height = obj.height || 0;
    this._box = obj.box ||new Box.Rect(this.x, this.y, this._width, this._height);
    this._focus = obj.focus || false;
    this._visible = obj.visible || true;
    this._status = obj.status || true;
    this._parent = obj.parent;
    this._em = new EventManger(this);
    this.defEventCallback()
  }

  create() {
    this.em.trigger('create')
  }

  update() {
    this.em.update()
  }

  close() {
    this.em.trigger('close')
  }

  getFocus() {
    if(this.focus) return true;
    this.focus = true;
    this.em.trigger('getFocus');
    return true
  }

  lostFocus() {
    if(!this.focus) return true;
    this.focus = false;
    this.em.trigger('lostFocus');
    return true
  }

  show() {
    if(this.visible) return true;
    this.visible = true;
    this.em.trigger('show');
    return true
  }

  hide() {
    if(!this.visible) return true;
    this.visible = false;
    this.em.trigger('hide');
    return true
  }

  enable() {

  }

  disable() {

  }

  move(dx, dy) {

  }

  moveTo(x, y) {

  }

  changeSize(width, height) {

  }

  defEventCallback() {

  }
}

export default Base