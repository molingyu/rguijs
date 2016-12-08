/**
 * Created by shitake on 16-12-7.
 */

import Box from 'box'
import PIXI from 'pixi.js'
import EventManger from 'eventManger'

/**
 * Class Base.
 * @author shitake <z1522716486@hotmail.com>
 * @license MIT <https://mit-license.org/>
 */
class Base extends PIXI.Container {
  constructor(obj = {}) {
    super();
    this.uID = RGUI.getID();
    this.x = obj.x || 0;
    this.y = obj.y || 0;
    this.width = obj.width || 0;
    this.height = obj.height || 0;
    this.box = obj.box ||new Box.Rect(this.x, this.y, this.width, this.height);
    this.focus = obj.focus || false;
    this.visible = obj.visible || true;
    this.status = obj.status || true;
    this.parent = obj.parent;
    this.em = new EventManger(this);
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