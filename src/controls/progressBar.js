import Base from '../base'
import RGUI from '../rgui'

RGUI.Controls = RGUI.Controls + 1;

class ProgressBar extends Base {

  get image() { return this._image }
  set image(value) {
    if(this._image == value) return false;
    this._image = value;
    this.eventManger.trigger('changeImage')
  }

  get style() { return this._style }
  set style(value) {
    if(this._style == value) return false;
    let old = this._style;
    this._style = value;
    this.eventManger.trigger('changeStyle', {old: old, new: this._style})
  }

  get value() { return this._value }
  set value(value) {
    value = RGUI.boundary(value, 0, 100);
    if(this._value == value) return false;
    let old = this._value;
    this._value = value;
    this.eventManger.trigger('changeValue', {old : old, new: this._value})
  }

  get type() { return this._type }
  set type(value) {
    value = RGUI.boundary(value, 0, 1);
    if(this._value == value) return false;
    let old = this._value;
    this._type = value;
    this.eventManger.trigger('changeType', {old: old, new: this._type})
  }

  constructor(obj) {
    super(obj);
    this._image = obj.image;
    this._style = obj.style || {radius: 5, fillColor: '#ff4925', strokeColor: '#1F70FF'};
    if(this._image == void 0) {
      this._image = new Bitmap(this.width, this.height);
      this._image.fillRoundedAll(this._style.radius, this._style.fillColor, this._style.stopColor);
    }
    this._value = RGUI.boundary(obj.value, 0, 100) || 100;
    this._type = obj.type || 0;
    this.create()
  }

  setImage() {
    if(this._sprite.bitmap != this._image) this._sprite.bitmap = this._image;
    if (this._type == 0) {
      this._sprite.setFrame(0, 0, this._value / 100 * this.width, this.height)
    } else {
      this._sprite.setFrame(0, 0, this.width, this._value / 100 * this.height)
    }
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
    //TODO
    this.eventManger.on('changeWidth', {}, function () {
      self.setImage()
    });
    //TODO
    this.eventManger.on('changeHeight', {}, function () {
      self.setImage()
    });
    this.eventManger.on('changeImage', {}, function () {
      self.setImage()
    });
    this.eventManger.on('changeStyle', {}, function () {
      self._image.fillAll(self._style.color)
    });
    this.eventManger.on('changeValue', {}, function () {
      self.setImage();
    });
    this.eventManger.on('changeType', {}, function () {
      self.setImage();
    })
  }
}

module.exports = ProgressBar;