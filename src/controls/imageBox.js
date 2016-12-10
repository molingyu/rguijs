import Base from '../base'
import RGUI from '../rgui'

RGUI.Controls = RGUI.Controls + 1;

class ImageBox extends Base {

  get image() { return this._image }
  set image(value) {
    if(this._image == value && value.class != Bitmap) return false;
    this._image = value;
    this.eventManger.trigger('changeImage')
  }

  get type() { return this._type }
  set type(value) {
    value = Number(value);
    if(this._type == value) return false;
    this._type = value;
    this.eventManger.trigger('changeType')
  }

  constructor(obj) {
    super(obj);
    this._image = obj.image || new Bitmap(0, 0, 0, 0);
    this._type = obj.type || 0;
    this._xWheel = 0;
    this._yWheel = 0;
    this.create()
  }

  setImage() {
    this._sprite.bitmap = this._image;
  }

  setType() {
    switch (this._type) {
      case 0:
        break;
      case 1:

        break;
      case 2:

        break;
      case 3:
        break
    }
  }

  create() {
    this._sprite = new Sprite();
    this._sprite.x = this.x;
    this._sprite.y = this.y;
    this._sprite.width = this.width;
    this._sprite.height = this.height;
    this.addChild(this._sprite);
    this.setImage();
    super.create()
  }

  xScroll(value) {

    this.eventManger.trigger('xScroll')
  }

  yScroll(value) {

    this.eventManger.trigger('yScroll')
  }

  defEventCallback() {
    let self = this;
    this.eventManger.on('changeX', function () {
      self._sprite.x = self.x;
    });
    this.eventManger.on('changeY', function () {
      self._sprite.y = self.y;
    });
    this.eventManger.on('changeWidth', function () {
      self._sprite.width = self.width;
      self.setType()
    });
    this.eventManger.on('changeHeight', function () {
      self._sprite.height = self.height;
      self.setType()
    });
    this.eventManger.on('changeOpenness', function () {

    })
  }

}

module.exports = ImageBox;