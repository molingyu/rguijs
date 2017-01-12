const Base = require('../base');
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
   * @returns { Bitmap }
   */
  get image() { return this._images }
  set image(value) {
    if(this._images == value && value.class != Bitmap) return false;
    this._images = value;
    this.setImage();
    this.eventManager.trigger('changeImage')
  }

  get type() { return this._state }
  set type(value) {
    value = Number(value);
    if(this._state == value) return false;
    this._state = value;
    this.setImage();
    this.eventManager.trigger('changeType')
  }

  constructor(obj) {
    super(obj);
    this._image = obj.image || '';
    this._state = obj.state || 0;
    this._xWheel = 0;
    this._yWheel = 0;
    this.create()
  }

  setImage() {
    // if(this._sprite.bitmap != this._images) this._sprite.bitmap = this._images;
    // let width = this._sprite.bitmap.width;
    // let height = this._sprite.bitmap.height;
    // if (this._state == 0) {
    //   this._sprite.setTransform(this.x, this.y, 1, 1);
    //   width = this.width  < this._sprite.bitmap.width ? this.width : this._sprite.bitmap.width;
    //   height = this.height < this._sprite.bitmap.height ? this.height : this._sprite.bitmap.height;
    // } else if (this._state == 1) {
    //   let zoomX = this.width / this._sprite.bitmap.width;
    //   let zoomY = this.height / this._sprite.bitmap.height;
    //   this._sprite.setTransform(this.x, this.y, zoomX, zoomY);
    // }
    // this._sprite.setFrame(this._xWheel, this._yWheel, width, height);
  }

  create() {
    let self = this;
    this._images = LoadManager.loadImage(this._image, false, true, (()=>{
      self._sprite = new Sprite(self._images);
      self._sprite.x = self.x;
      self._sprite.y = self.y;
      self._sprite.width = self.width;
      self._sprite.height = self.height;
      self.addChild(self._sprite);
    }));
    // this._images.addLoadListener(function(){ self.setImage() });
    super.create()
  }

  xScroll(value) {
    if(0 == value || this.type != 0) return false;
    this._xWheel = RGUI.boundary(this._xWheel + value, 0, this._images.width - this.width);
    this.setImage();
    this.eventManager.trigger('xScroll')
  }

  yScroll(value) {
    if(0 == value || this.type != 0) return false;
    this._yWheel = RGUI.boundary(this._yWheel + value, 0, this._images.height - this.height);
    this.setImage();
    this.eventManager.trigger('yScroll')
  }

  defEventCallback() {
    let self = this;
    this.eventManager.on('changeX', {}, function () {
      self._sprite.x = self.x;
    });
    this.eventManager.on('changeY', {}, function () {
      self._sprite.y = self.y;
    });
    this.eventManager.on('changeWidth', {}, function () {
      self.setImage()
    });
    this.eventManager.on('changeHeight', {}, function () {
      self.setImage()
    });
    this.eventManager.on('changeOpacity', {}, function (info) {
      self._sprite.opacity = info.new
    })
  }

}

module.exports = ImageBox;