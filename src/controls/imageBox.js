const Base = require('../base');
const PIXI = require('../lib/pixi');
const RGUI = require('../rgui');
const Sprite = require('../display/sprite');
const LoadManager = require('../loadManager');

RGUI.Controls = RGUI.Controls + 1;

/**
 * 图片框控件。
 * @memberof RGUI
 * @extends RGUI.Base
 */
class ImageBox extends Base {

  /**
   * 图片框里的图片。
   *
   * @returns {RGUI.Display.Bitmap}
   */
  get image() { return this._image }
  set image(value) {
    if(this._image == value && typeOf(value) != 'String') return false;
    let self = this;
    this._image = LoadManager.loadImage(value, false, true, (()=>{
      self._sprite.bitmap = self._image;
      self.setImage();
      self.eventManager.trigger('changeImage')
    }));
  }

  /**
   * 图片的显示方式。0平铺，1填充，2横向填充，3竖向填充。
   *
   * @returns {Number}
   */
  get type() { return this._type }
  set type(value) {
    value = Number(value);
    if(this._type == value) return false;
    let old = this._type;
    this._type = value;
    this.setImage();
    this.eventManager.trigger('changeType', {old: old, new: this._type})
  }

  /**
   * 横向卷动值。
   *
   * @returns {Number}
   */
  get xWheel () { return this._xWheel }
  set xWheel (value) {
    let old = this._xWheel;
    this._xWheel = RGUI.boundary(value, 0, this._image.width - this.width);
    if(this._xWheel == old || this.type != 0) return false;
    this.setImage();
    this.eventManager.trigger('changeType', {old: old, new: this._xWheel})
  }

  /**
   * 竖向卷动值。
   * 
   * @returns {Number}
   */
  get yWheel () { return this._yWheel }
  set yWheel (value) {
    let old = this._yWheel;
    this._yWheel = RGUI.boundary(value, 0, this._image.height - this.height);
    if(this._yWheel == old || this.type != 0) return false;
    this.setImage();
    this.eventManager.trigger('changeType', {old: old, new: this._yWheel})
  }

  /**
   * 返回一个新的图片框控件。
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
   * @param {Number} obj.type - 控件的显示类型。0平铺，1填充，2横向填充，3竖向填充。
   * @param {Number} obj.xWheel - 控件的横向卷动值。
   * @param {Number} obj.yWheel - 控件的竖向卷动值。
   * @param {String} obj.image - 控件的图片。
   */
  constructor(obj) {
    super(obj);
    this._type = obj.type || 0;
    this._xWheel = obj.xWheel || 0;
    this._yWheel = obj.yWheel || 0;
    this.create(obj.image || '')
  }

  setImage() {
    let width = this._sprite.bitmap.width;
    let height = this._sprite.bitmap.height;
    if(this._type == 0) {
      this._sprite.setTransform(this.x, this.y, 1, 1);
      width = this.width  < this._sprite.bitmap.width ? this.width : this._sprite.bitmap.width;
      height = this.height < this._sprite.bitmap.height ? this.height : this._sprite.bitmap.height
    } else {
      let zoomX = this.width / this._sprite.bitmap.width;
      let zoomY = this.height / this._sprite.bitmap.height;
      switch (this._type) {
        case 1:
          this._sprite.setTransform(this.x, this.y, zoomX, zoomY);
          break;
        case 2:
          this._sprite.setTransform(this.x, this.y, zoomX, 1);
          break;
        case 3:
          this._sprite.setTransform(this.x, this.y, 1, zoomY);
          break
      }
    }
    this._sprite.setFrame(this._xWheel, this._yWheel, width, height);
  }

  create(imageStr) {
    let self = this;
    this._image = LoadManager.loadImage(imageStr, false, true, ()=>{
      self._sprite = new Sprite(self._image);
      self._sprite.x = self.x;
      self._sprite.y = self.y;
      self._sprite.width = self.width;
      self._sprite.height = self.height;
      self.addChild(self._sprite);
      self.setImage()
    });
    super.create()
  }

  /**
   * 横向卷动，失败返回 false。
   * 
   * @param {Number} value - 卷动的值。
   * @returns {Boolean}
   */
  xScroll(value) {
    if(0 == value || this.type != 0) return false;
    this.xWheel += value;
    this.eventManager.trigger('xScroll')
  }

  /**
   * 竖向卷动，失败返回 false。
   * 
   * @param {Number} value - 卷动的值。
   * @returns {Boolean}
   */
  yScroll(value) {
    if(0 == value || this.type != 0) return false;
    this.yWheel += value;
    this.setImage();
    this.eventManager.trigger('yScroll')
  }

  defEventCallback() {
    let self = this;
    this.eventManager.on('changeX', {}, ()=>{ self._sprite.x = self.x });
    this.eventManager.on('changeY', {}, ()=>{ self._sprite.y = self.y });
    this.eventManager.on('changeWidth', {}, ()=>{ self.setImage() });
    this.eventManager.on('changeHeight', {}, ()=>{ self.setImage() });
  }

}

module.exports = ImageBox;