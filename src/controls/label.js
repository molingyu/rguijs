const RGUI = require('../rgui');
const Base = require('../base');
const Sprite = require('../display/sprite');
const LoadManager = require('../loadManager');

RGUI.Controls = RGUI.Controls + 1;

class Label extends Base {

  set height(value) {}

  get text() { return this._text }
  set text(value) {
    value = String(value);
    if(this._text == value) return false;
    let old = this._text;
    this._text = value;
    this._em.trigger('changeText', { old: old, new: this._text })
  }

  get fontSize() { return this._textStyle.fontSize }
  set fontSize(value) {
    value = Number(value);
    if(this._textStyle.fontSize == value) return false;
    let old = this._textStyle.fontSize;
    this._textStyle.fontSize = value;
    this._width = null;
    this._em.trigger('changeTextStyle', {old: old, new: this._textStyle.fontSize})
  }

  get fontColor() { return this._textStyle.fill }
  set fontColor(value) {
    value = Number(value);
    if(this._textStyle.fill == value && !isNaN(value)) return false;
    let old = this._textStyle.fill;
    this._textStyle.fill = value;
    this._em.trigger('changeTextStyle', {old: old, new: this._textStyle.fill})
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
    this._textStyle = obj.textStyle || {fontFamily : 'Arial', fontSize: 24, fill : 0xffffff, align : 'center'};
    this.create()
  }

  setImage() {
    this._textObject.text = this._text;
    this._textObject.style = this._textStyle;
    // if(this._width && this._width != this._textObject.width) {
    //   this._textObject.width = this._width
    // } else {
    //   this._width = this._textObject.width
    // }
    this._width = this._textObject.width;
    this._height = this._textObject.height;
    this.addChild(this._textObject)
  }

  create() {
    this._textObject = new PIXI.Text();
    this._textObject.position.x = this._x;
    this._textObject.position.y = this._y;
    this.setImage();
    super.create()
  }

  defEventCallback() {
    let self = this;
    this.eventManager.on('changeX', {}, ()=>{ self._textObject.position.x = self._x });
    this.eventManager.on('changeY', {}, ()=>{ self._textObject.position.y = self._y });
    this.eventManager.on('changeWidth', {}, ()=>{ self.setImage() });
    this.eventManager.on('changeTextStyle', {}, ()=>{ console.log(233);self.setImage() });
    this.eventManager.on('changeText', {}, ()=>{ self.setImage() })
  }
}

module.exports = Label;