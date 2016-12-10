import Base from '../base'
import RGUI from '../rgui'
import PIXI from 'pixi.js'

RGUI.Controls = RGUI.Controls + 1;

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
    this._image = obj.image || new Texture(new PIXI.BaseTexture(), new Rect(0, 0, this.width, this.height));
    this._type = obj.type || 0;
    this._xWheel = 0;
    this._yWheel = 0;
    this.create()
  }

  setImage() {
    this._sprite.texture = this._image;
    let self = this;
    // this._image.onload(()=>{ self.setType() })
  }

  setType() {
    let frame = this._image._frame;
    switch (this._type) {
      case 0:
        this._sprite.scale = 1;
        this._image.setFrame(new PIXI.Rectangle(0, 0, this.width, this.height));
        break;
      case 1:
        this._sprite.setTransform(this.x, this.y, this.width / this._sprite.texture.width, 1);
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
    this.addChild(this._sprite);
    this._sprite.x = this.x;
    this._sprite.y = this.y;
    this.setImage();
    super.create()
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

module.exports = ImageBox;