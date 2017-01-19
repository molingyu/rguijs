const RGUI = require('../rgui');
const Base = require('../base');
const Sprite = require('../display/sprite');
const LoadManager = require('../loadManager');

RGUI.Controls = RGUI.Controls + 1;

class Label extends Base {

  set height() {}

  get text() { return this._text }
  set text(value) {
    value = String(value);
    if(this._text == value) return false;
    let old = this._text;
    this._text = value;
    this._em.trigger('changeText', { old: old, new: this._text })
  }

  get textStyle() { return this._textStyle }
  set textStyle(value) {
    value = String(value);
    if(this._textStyle == value) return false;
    let old = this._textStyle;
    this._textStyle = value;
    this._em.trigger('changeTextStyle', { old: old, new: this._textStyle })
  }

  constructor(obj) {
    super(obj);
    this._text = obj.text || '';
    this._width = obj.width;
    this._textStyle = obj.textStyle || {fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'};
    this.create()
  }

  setImage() {
    this._textObject.text = this._text;
    this._textObject.style = this._textStyle;
    if(this._width) {
      this._textObject.width = this._width
    } else {
      this._width = this._textObject.width
    }
    this._height = this._textObject.height
  }

  create() {
    this._textObject = new PIXI.Text();
    this._textObject.x = this._x;
    this._textObject.y = this._y;
    this.setImage()
  }

  defEventCallback() {
    let self = this;
    this.EventManager.on('changeX', {}, ()=>{ self._textObject.x = self._x });
    this.EventManager.on('changeY', {}, ()=>{ self._textObject.y = self._y });
    this.EventManager.on('changeWidth', {}, ()=>{ self.setImage() });
    this.EventManager.on('changeTextStyle', {}, ()=>{ self.setImage() });
    this.EventManager.on('changeText', {}, ()=>{ self.setImage() })
  }
}

module.exports = Label;