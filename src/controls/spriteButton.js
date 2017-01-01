const Base = require('../base');
const RGUI = require('../rgui');

//TODO fix bugs
RGUI.Controls = RGUI.Controls + 1;

class SpriteButton extends Base {

  set width(value) {}

  set height(value) {}

  get defaultImage() { return this._images[0] }
  set defaultImage(value) {
    if(this._images[0] == value && value.class != Bitmap) return false;
    this._images[0] = value;
    this.eventManger.trigger('changeDefaultImage')
  }

  get focusImage() { return this._images[1] }
  set focusImage(value) {
    if(this._images[1] == value && value.class != Bitmap) return false;
    this._images[1] = value;
    this.eventManger.trigger('changeFocusImage')
  }

  get downImage() { return this._images[2] }
  set downImage(value) {
    if(this._images[2] == value && value.class != Bitmap) return false;
    this._images[2] = value;
    this.eventManger.trigger('changeDownImage')
  }

  get enfeebleImage() { return this._images[3] }
  set enfeebleImage(value) {
    if(this._images[3] == value && value.class != Bitmap) return false;
    this._images[3] = value;
    this.eventManger.trigger('changeEnfeebleImage')
  }

  get state() { return this._state }
  set state(value) {
    value = Number(value);
    if(this._state == value) return false;
    let old = this._state;
    this._state = value;
    this.eventManger.trigger('changeType', {old: old, new: this._state})
  }

  constructor(obj) {
    super(obj);
    this._images = obj.images || [new Bitmap(0, 0, 0, 0), new Bitmap(0, 0, 0, 0), new Bitmap(0, 0, 0, 0), new Bitmap(0, 0, 0, 0)];
    this._state = obj.state || 0;
    this._image = this._images[this._state];
    this.create()
  }

  setImage() {
    this._image = this._images[this._state];
    this._sprite.bitmap = this._image;
    this.width = this._image.width;
    this.height = this._image.height;
  }

  create() {
    this._sprite = new Sprite();
    this._sprite.x = this.x;
    this._sprite.y = this.y;
    this._sprite.width = this.width;
    this._sprite.height = this.height;
    this.addChild(this._sprite);
    let self = this;
    this._image.addLoadListener(function(){ self.setImage() });
    super.create()
  }

  defEventCallback() {
    let self = this;
    this.eventManger.on('changeX', {}, function () {
      self._sprite.x = self.x;
    });
    this.eventManger.on('changeY', {}, function () {
      self._sprite.y = self.y;
    });
    this.eventManger.on('changeFocus', {}, function (info) {
      self.state = info.new ? 1 : 0;
      self.setImage()
    });
    this.eventManger.on('changeOpacity', {}, function (info) {
      self._sprite.opacity = info.new
    });
    this.eventManger.on('mouseIn', {}, function () {
      self.state = 1;
      self.setImage()
    });
    this.eventManger.on('mouseOut', {}, function () {
      self.state = 0;
      self.setImage()
    });
    this.eventManger.on('enable', {}, function () {
      self.state = 3;
      self.setImage()
    });
    this.eventManger.on('disable', {}, function () {
      self.state = 0;
      self.setImage()
    });
    this.eventManger.on('click', {}, function () {
      self.state = 2;
      self.setImage();
      self.eventManger.trigger('run')
    });
  }

}

module.exports = SpriteButton;