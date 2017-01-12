const RGUI = require('./rgui');
const Box = require('./box');
const PIXI = require('./lib/pixi');
const EventManager = require('./eventManager');

/**
 * 控件基类。继承自 [PIXI.Container](http://pixijs.download/release/docs/PIXI.Container.html)。
 *
 * @extends PIXI.Container
 * @memberof RGUI
 */
class Base extends PIXI.Container {

  /**
   * 控件 ID ，每个控件实例该值唯一。
   * @static
   * @returns {Number}
   */
  get uID() { return this._uID }

  /**
   * Y 坐标。
   *
   * @returns {Number}
   */
  get x() { return this._x }
  set x(value) {
    value = Number(value);
    if(this._x == value) return false;
    let old = this._x;
    this._x = value;
    this._box.move(this._x - old);
    this._em.trigger('changeX', {old: old, new: this._x})
  }

  /**
   * X 坐标。
   *
   * @returns {Number}
   */
  get y() { return this._y }
  set y(value) {
    value = Number(value);
    if(this._y == value) return false;
    let old = this._y;
    this._y = value;
    this._box.move(0, this._y - old);
    this._em.trigger('changeY', {old: old, new: this._y})
  }

  /**
   * 宽度。
   *
   * @returns {Number}
   */
  get width() { return this._width }
  set width(value) {
    value = Number(value);
    if(this._width == value) return false;
    let old = this._width;
    this._width = value;
    this._box.setSize(this._width, this._height);
    this._em.trigger('changeWidth', {old: old, new: this._width})
  }

  /**
   * 高度。
   *
   * @returns {Number}
   */
  get height() { return this._height }
  set height(value) {
    value = Number(value);
    if(this._height == value) return false;
    let old = this._height;
    this._height = value;
    this._box.setSize(this._width, this._height);
    this._em.trigger('changeHeight', {old: old, new: this._height})
  }

  /**
   * 包围盒。
   *
   * @returns {RGUI.Box.Rect|RGUI.Box.Round}
   */
  get box() { return this._box }

  /**
   * 焦点。
   *
   * @returns {Number}
   */
  get focus() { return this._focus }
  set focus(value) {
    value = Boolean(value);
    if(this._focus == value) return false;
    let old = this._focus;
    this._focus = value;
    this._em.trigger('changeFocus', {old: old, new: this._focus})
  }

  /**
   * 可见性。
   *
   * @returns {Boolean}
   */
  set visible(value) {
    value = Boolean(value);
    if(this.visible == value || !this._em) return false;
    let old = this.visible;
    super.visible = value;
    this._em.trigger('changeVisible', {old: old, new: this.visible})
  }

  /**
   * 状态，是否禁用。
   *
   * @returns {Boolean}
   */
  get status() { return this._status }
  set status(value) {
    value = Boolean(value);
    if(this._status == value) return false;
    let old = this._status;
    this._status = value;
    this._em.trigger('changeStatus', {old: old, new: this._status})
  }

  /**
   * 透明度。
   *
   * @returns {Number}
   */
  get opacity() { return this.alpha * 255 }
  set opacity(value) {
    value = Number(value);
    if(this.opacity == value) return false;
    let old = this.opacity;
    this.alpha = RGUI.boundary(value, 0, 255) / 255;
    this._em.trigger('changeOpacity', {old: old, new: this.opacity})
  }

  /**
   * 事件管理器。
   *
   * @static
   * @returns {EventManager}
   */
  get eventManager() { return this._em }

  /**
   *
   * @param {Object} obj
   * @param {Number} obj.x - 控件的 X 坐标。
   * @param {Number} obj.y - 控件的 X 坐标。
   * @param {Number} obj.width - 控件的宽度值。
   * @param {Number} obj.height - 控件的高度值。
   * @param {RGUI.Box.Rect|RGUI.Box.Round} obj.box - 控件的包围盒。
   * @param {Boolean} obj.focus - 控件的焦点。
   * @param {Boolean} obj.visible - 控件的可见性。
   * @param {Boolean} obj.status - 控件的状态。
   * @param {Number} obj.opacity - 控件的透明度。
   */
  constructor(obj = {}) {
    super();
    this._class = Base;
    this._em = new EventManager(this);
    this._uID = RGUI.getID();
    this._x = obj.x || 0;
    this._y = obj.y || 0;
    this._width = obj.width || 0;
    this._height = obj.height || 0;
    this._box = obj.box ||new Box.Rect(this.x, this.y, this._width, this._height);
    this._focus = obj.focus || false;
    super.visible = obj.visible || true;
    this._status = obj.status || true;
    this.alpha = RGUI.boundary(obj.opacity || 255, 0, 255) / 255;
  }

  /**
   * 定义事件回调函数。
   *
   * @interface
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
   * 获得焦点，失败返回 false。
   * 
   * @returns {Boolean}
   */
  getFocus() {
    if(this.focus) return true;
    this.focus = true;
    this._em.trigger('getFocus');
    return true
  }

  /**
   * 失去焦点，失败返回 false。
   * 
   * @returns {Boolean}
   */
  lostFocus() {
    if(!this.focus) return true;
    this.focus = false;
    this._em.trigger('lostFocus');
    return true
  }

  /**
   * 显示控件，失败返回 false。
   * 
   * @returns {Boolean}
   */
  show() {
    if(this.visible) return true;
    this.visible = true;
    this._em.trigger('show');
    return true
  }

  /**
   * 隐藏控件，失败返回 false。
   * 
   * @returns {Boolean}
   */
  hide() {
    if(!this.visible) return true;
    this.visible = false;
    this._em.trigger('hide');
    return true
  }

  /**
   * 禁用控件，失败返回 false。
   * 
   * @returns {Boolean}
   */
  enable() {
    if(this.status) return true;
    this.status = true;
    this._em.trigger('enable')
  }

  /**
   * 解除控件禁用。
   * @returns {Boolean}
   */
  disable() {
    if(!this.status) return true;
    this.status = false;
    this._em.trigger('disable')
  }

  /**
   * 移动控件指定值，失败返回 false。
   *
   * @param {Number} dx - X 的增加值。
   * @param {Number} dy - Y 的增加值。
   * @returns {Boolean}
   */
  move(dx, dy) {
    if(dx == 0 && dy == 0) return false;
    this.x = this.x + dx;
    this.y = this.y + dy;
    this._em.trigger('move', {dx: dx, dy: dy})
  }

  /**
   * 将控件移动到指定位置，失败返回 false。
   *
   * @param {Number} x - 新的 X 的值。
   * @param {Number} y - 新的 Y 的值。
   * @returns {Boolean}
   */
  moveTo(x, y) {
    if(x == this._x && y == this._y) return false;
    let old = {x: this._x, y: this._y};
    this.x = x;
    this.y = y;
    this._em.trigger('moveTo', {old: old, new: {x: this._x, y: this._y}})
  }

  /**
   * 改变控件大小，失败返回 false。
   *
   * @param {Number} width
   * @param {Number} height
   * @returns {Boolean}
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