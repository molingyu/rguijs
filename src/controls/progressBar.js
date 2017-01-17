const RGUI = require('../rgui');
const Base = require('../base');
const Sprite = require('../display/sprite');
const LoadManager = require('../loadManager');

RGUI.Controls = RGUI.Controls + 1;

/**
 * 进度条控件。
 * @memberof RGUI
 * @extends RGUI.Base
 */
class ProgressBar extends Base {

  get images() { return this._images }
  set images(value) {
    if(this._imagesStr == value && typeOf(value) != 'String') return false;
    let self = this;
    this._images = LoadManager.loadImage(this._imagesStr, this._i18nLoad, true, ()=>{
      self._images = Bitmap.cut(self._images, this._width, this._height, 0);
      self.setImage();
      self.eventManager.trigger('changeImages')
    })
  }
  get value() { return this._value }
  set value(value) {
    value = RGUI.boundary(value, 0, 100);
    if(this._value == value) return false;
    let old = this._value;
    this._value = value;
    this.eventManager.trigger('changeValue', {old: old, new: this._value})
  }

  get maxValue() { return this._maxValue }
  set maxValue(value) {
    value = Number(value);
    if(this._maxValue == value) return false;
    let old = this._maxValue;
    this._maxValue = value;
    this.eventManager.trigger('changeMaxValue', {old: old, new: this._maxValue})
  }

  get type() { return this._type }
  set type(value) {
    value = RGUI.boundary(value, 0, 1);
    if(this._value == value) return false;
    let old = this._value;
    this._type = value;
    this.eventManager.trigger('changeType', {old: old, new: this._type})
  }

  constructor(obj) {
    super(obj);
    this._imagesStr = obj.images;
    this._maxValue = obj.maxValue || 100;
    this._value = RGUI.boundary(obj.value || this._maxValue, 0, this._maxValue);
    this._type = obj.type || 0;
    this.create()
  }

  setImage() {
    this._sprite.bitmap.blt(this._images[0], 0, 0, this._width, this._height, 0, 0);
    if(this._type == 0) {
      this._sprite.bitmap.blt(this._images[1], 0, 0, this._width * (this._value / this._maxValue), this._height, 0, 0)
    } else {
      this._sprite.bitmap.blt(this._images[1], 0, 0, this._width, this._height * (this._value / this._maxValue), 0, 0)
    }
  }

  create() {
    let self = this;
    this._images = LoadManager.loadImage(this._imagesStr, this._i18nLoad, true, ()=>{
      self._images = Bitmap.cut(self._images, self.width, self.height, 0);
      self._sprite = new Sprite(new Bitmap(self.width, self.height));
      self._sprite.x = self._x;
      self._sprite.y = self._y;
      self.setImage();
      self.addChild(this._sprite);
      super.create()
    })
  }

  defEventCallback() {
    let self = this;
    this.eventManager.on('changeX', {}, ()=>{ self._sprite.x = self.x });
    this.eventManager.on('changeY', {}, ()=>{ self._sprite.y = self.y });
    this.eventManager.on('changeImages', {}, ()=>{ self.setImage() });
    this.eventManager.on('changeMaxValue', {}, ()=>{ self.setImage() });
    this.eventManager.on('changeValue', {}, ()=>{ self.setImage() });
    this.eventManager.on('changeType', {}, ()=>{ self.setImage() })
  }
}

module.exports = ProgressBar;