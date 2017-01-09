const Base = require('../base');
const RGUI = require('../rgui');

RGUI.Controls = RGUI.Controls + 1;

/**
 * 按钮控件。
 * @memberof RGUI
 * @extends RGUI.Base
 */
class Button extends Base {

  constructor(obj) {
    super(obj);
    this._text = obj.text || 'Button ' + this._uID;
    this.defaultStyle = {
      font : {
        fontFace: 'Arial',
        fontItalic: false,
        fontSize: 32,
        textColor: 'rgba(0, 0, 0, 0)',
        outlineColor: '',
        outlineWidth: 0,
      },
      color: 'rgba(249, 249, 248, 0.5)',
      radius: 10,
      outlineColor: '#000000'
    };
    this.create()
  }

  drawImage() {
    this._bitmap.fillRoundedAll(this.defaultStyle.radius, this.defaultStyle.color);
  }

  drawText() {
    this._bitmap.fontFace = this.defaultStyle.font.fontFace;
    this._bitmap.fontItalic = this.defaultStyle.font.fontItalic;
    this._bitmap.fontSize = this.defaultStyle.font.fontSize;
    this._bitmap.textColor = this.defaultStyle.font.textColor;
    this._bitmap.outlineColor = this.defaultStyle.font.outlineColor;
    this._bitmap.outlineWidth = this.defaultStyle.font.outlineWidth;
    let x = (this._width - this._bitmap.measureTextWidth(this._text)) / 2;
    let y = (this._height - this._bitmap.fontSize) / 2;
    this._bitmap.drawText(this._text, x, y , this._bitmap.measureTextWidth(this._text), this._bitmap.fontSize);
  }

  create() {
    this._bitmap = new Bitmap(this._width, this._height);
    this.drawImage();
    this.drawText();
    this._sprite = new Sprite(this._bitmap);
    this._sprite.x = this._x;
    this._sprite.y = this._y;
    this.addChild(this._sprite);
    super.create()
  }

}

module.exports = Button;