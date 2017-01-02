const RGUI = require('./rgui');
const Box = require('./box');
const PIXI = require('pixi.js');
const EventManger = require('./eventManger');

/**
 * 控件基类。
 *
 * @memberof RGUI
 */
class Base extends PIXI.Container {

  get uID() { return this._uID }

  get x() { return this._x }
  set x(value) {
    value = Number(value);
    if(this._x == value) return false;
    let old = this._x;
    this._x = value;
    this._box.move(this._x - old);
    this._em.trigger('changeX', {old: old, new: this._x})
  }

  get y() { return this._y }
  set y(value) {
    value = Number(value);
    if(this._y == value) return false;
    let old = this._y;
    this._y = value;
    this._box.move(0, this._y - old);
    this._em.trigger('changeY', {old: old, new: this._y})
  }

  get width() { return this._width }
  set width(value) {
    value = Number(value);
    if(this._width == value) return false;
    let old = this._width;
    this._width = value;
    this._box.setSize(this._width, this._height);
    this._em.trigger('changeWidth', {old: old, new: this._width})
  }

  get height() { return this._height }
  set height(value) {
    value = Number(value);
    if(this._height == value) return false;
    let old = this._height;
    this._height = value;
    this._box.setSize(this._width, this._height);
    this._em.trigger('changeHeight', {old: old, new: this._height})
  }

  get box() { return this._box }

  get focus() { return this._focus }
  set focus(value) {
    value = Boolean(value);
    if(this._focus == value) return false;
    let old = this._focus;
    this._focus = value;
    this._em.trigger('changeFocus', {old: old, new: this._focus})
  }

  //TODO:
  // get openness() { return this._openness }
  // set openness(value) {
  //   value = Boolean(value);
  //   if(this._openness == value) return false;
  //   let old = this._openness;
  //   this._openness = value;
  //   this._em.trigger('changeOpenness', {old: old, new: this._openness})
  // }

  get status() { return this._status }
  set status(value) {
    value = Boolean(value);
    if(this._status == value) return false;
    let old = this._status;
    this._status = value;
    this._em.trigger('changeStatus', {old: old, new: this._status})
  }

  get opacity() { return this._opacity }
  set opacity(value) {
    value = Number(value);
    if(this._opacity == value) return false;
    let old = this._opacity;
    this._opacity = value;
    this._em.trigger('changeOpacity', {old: old, new: this._opacity})
  }

  get eventManger() { return this._em }

  /**
   *
   * @param {Object} obj
   * @param {Number} obj.x - 控件的 X 坐标。
   * @param {Number} obj.y - 控件的 X 坐标。
   * @param {Number} obj.width - 控件的宽度值。
   * @param {Number} obj.height - 控件的高度值。
   * @param {RGUI.Box.Rect|RGUI.Box.Round} obj.box - 控件的包围盒。
   * @param {Boolean} obj.focus - 控件的焦点。
   * @param {Boolean} obj.status - 控件的状态。
   * @param {Number} obj.opacity - 控件的透明度。
   */
  constructor(obj = {}) {
    super();
    this._em = new EventManger(this);
    this._uID = RGUI.getID();
    this._x = obj.x || 0;
    this._y = obj.y || 0;
    this._width = obj.width || 0;
    this._height = obj.height || 0;
    this._box = obj.box ||new Box.Rect(this.x, this.y, this._width, this._height);
    this._focus = obj.focus || false;
    // this._openness = obj.openness || true;
    this._status = obj.status || true;
    this._opacity = obj.opacity || 255;
  }

  /**
   * 定义事件回调函数。
   */
  defEventCallback() { }

  /**
   * 控件初始化。
   */
  create() {
    this.defEventCallback();
    this._em.trigger('create')
  }

  /**
   * 更新函数。原则上每帧调用一次。
   */
  update() {
    this._em.update()
  }

  /**
   * 关闭控件。
   */
  close() {
    this._em.trigger('close')
  }

  /**
   * 获得焦点
   * @returns {boolean}
   */
  getFocus() {
    if(this.focus) return true;
    this.focus = true;
    this._em.trigger('getFocus');
    return true
  }

  /**
   * 失去焦点
   * @returns {boolean}
   */
  lostFocus() {
    if(!this.focus) return true;
    this.focus = false;
    this._em.trigger('lostFocus');
    return true
  }

  /**
   * 显示控件。
   * @returns {boolean}
   */
  show() {
    if(this.visible) return true;
    this.visible = true;
    this._em.trigger('show');
    return true
  }

  /**
   * 隐藏控件。
   * @returns {boolean}
   */
  hide() {
    if(!this.visible) return true;
    this.visible = false;
    this._em.trigger('hide');
    return true
  }

  /**
   * 禁用控件。
   * @returns {boolean}
   */
  enable() {
    if(this.status) return true;
    this.status = true;
    this._em.trigger('enable')
  }

  /**
   * 解除控件禁用。
   * @returns {boolean}
   */
  disable() {
    if(!this.status) return true;
    this.status = false;
    this._em.trigger('disable')
  }

  /**
   * 移动控件指定值。
   * @param {Number} dx
   * @param {Number} dy
   * @returns {boolean}
   */
  move(dx, dy) {
    if(dx == 0 && dy == 0) return false;
    this.x = this.x + dx;
    this.y = this.y + dy;
    this._em.trigger('move', {dx: dx, dy: dy})
  }

  /**
   * 将控件移动到指定位置。
   * @param {Number} x
   * @param {Number} y
   * @returns {boolean}
   */
  moveTo(x, y) {
    if(x == this._x && y == this._y) return false;
    let old = {x: this._x, y: this._y};
    this.x = x;
    this.y = y;
    this._em.trigger('moveTo', {old: old, new: {x: this._x, y: this._y}})
  }

  /**
   * 改变控件大小。
   * @param {Number} width
   * @param {Number} height
   * @returns {boolean}
   */
  changeSize(width, height) {
    if(this._width == width && this._height == height) return false;
    let old = {width: this._width, height: this._height};
    this.width = width;
    this.height = height;
    this._em.trigger('changeSize', {old: old, new: {width: this._width, height: this._height}})
  }
}

module.exports = Base;