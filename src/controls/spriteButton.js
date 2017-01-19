const RGUI = require('../rgui');
const ButtonBase = require('./buttonBase');
const Bitmap = require('../display/bitmap');
const Sprite = require('../display/sprite');
const LoadManager = require('../loadManager');

RGUI.Controls = RGUI.Controls + 1;

/**
 * 图片按钮控件。
 * @memberof RGUI
 * @extends RGUI.Base
 */
class SpriteButton extends ButtonBase {

  // set width() {}
  //
  // set height() {}

  /**
   * 返回图片按钮的位图数组。
   *
   * @returns {Array<RGUI.Display.Bitmap>}
   */
  get images() { return this._images }
  set images(value) {
    if(this._imagesStr == value && typeOf(value) != 'String') return false;
    let self = this;
    this._images = LoadManager.loadImage(this._imagesStr, this._i18nLoad, true, ()=>{
      self._images = Bitmap.cut(self._images, this.width, this.height, 0);
      self._image = self._images[self._state];
      self._sprite.bitmap = self._image;
      self.eventManager.trigger('changeImages')
    })
  }

  /**
   * @param {Number} obj.width - 控件的宽度值。
   * @param {Number} obj.height - 控件的高度值。
   * @param {String} obj.images - 控件所用的图片组。
   */
  constructor(obj) {
    super(obj);
    this._i18nLoad = true;
    this._imagesStr = obj.images || '';
    this.create()
  }

  create() {
    let self = this;
    this._images = LoadManager.loadImage(this._imagesStr, this._i18nLoad, true, ()=>{
      self._images = Bitmap.cut(self._images, this.width, this.height, 0);
      self._image = self._images[self._state];
      self._sprite = new Sprite(self._image);
      self._sprite.x = self._x;
      self._sprite.y = self._y;
      self._sprite.width = self._width;
      self._sprite.height = self._height;
      self.addChild(self._sprite);
      super.create()
    });
  }

  default() {
    this._image = this._images[0];
    this._sprite.bitmap = this._image;
    super.default()
  }

  focus() {
    this._image = this._images[1];
    this._sprite.bitmap = this._image;
    super.focus()
  }

  down() {
    this._image = this._images[2];
    this._sprite.bitmap = this._image;
    super.down()
  }

  enfeeble() {
    this._image = this._images[3];
    this._sprite.bitmap = this._image;
    super.enfeeble()
  }

  defEventCallback() {
    super.defEventCallback();
    let self = this;
    this.eventManager.on('changeX', {}, ()=>{ self._sprite.x = self.x });
    this.eventManager.on('changeY', {}, ()=>{ self._sprite.y = self.y });
  }

}

module.exports = SpriteButton;