import Base from '../box'
import PIXI from 'pixi.js'

const Texture = PIXI.Texture;
const Sprite = PIXI.Sprite;
const Rect = PIXI. Rectangle;

class ImageBox extends Base {

  get image() { return this._image }
  set image(value) {

  }

  get type() { return this._type }
  set type(value) {

  }

  constructor(obj) {
    super(obj);
    this._image = obj.image || new Texture(new PIXI.BaseTexture());
    this._type = obj.type || 0;
    this._xWheel = 0;
    this._yWheel = 0;
    this.create()
  }

  setImage() {
    this._sprite.texture = this._image;
  }

  setType() {
    switch (this._type) {
      case 0:
        this._sprite.scale = 1;
        break;
      case 1:
        this._sprite.setTransform(this.x, this.y, this.width / this._sprite.width, this.height / this._sprite.height);
        break;
      case 2:
        this._sprite.setTransform(this.x, this.y, this.width / this._sprite.width, 1);
        break;
      case 3:
        this._sprite.setTransform(this.x, this.y, 1, this.height / this._sprite.height);
        break
    }
  }

  create() {
    this._sprite = new Sprite();
    this._sprite.x = this.x;
    this._sprite.y = this.y;
    this.setImage();
    super.create();
  }

  xScroll(value) {

  }

  yScroll(value) {

  }

  defEventCallback() {
    this.eventManger.on('changeX', function () {

    });
    this.eventManger.on('changeY', function () {

    });
    this.eventManger.on('changeWidth', function () {

    });
    this.eventManger.on('changeHeight', function () {

    })
  }

}

export default ImageBox