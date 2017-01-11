const PIXI = require('../lib/pixi');
const Bitmap = require('./bitmap');

/**
 *
 * @memberof RGUI.Display
 */
class Sprite extends PIXI.Sprite {

  /**
   *
   * @returns {RGUI.Display.Bitmap}
   */
  get bitmap() {return this._bitmap }
  set bitmap(value) {
    this._bitmap = value;
    this.texture = PIXI.Texture.from(value.canvas)
  }

  /**
   * 创建一个新的精灵对象。
   *
   * @extends PIXI.Sprite
   * @param {RGUI.Display.Bitmap} bitmap
   */
  constructor(bitmap = new Bitmap(32, 32)) {
    super(PIXI.Texture.from(bitmap.canvas));
    this._bitmap = bitmap;
  }

  /**
   *
   * @param bitmap
   * @returns {*|Array|{type}}
   */
  static fromBitmap (bitmap) {
    let sprite = Sprite.from(bitmap.canvas);
    sprite._bitmap = bitmap;
    return sprite
  }

  /**
   * 设置 sprite（精灵） 所显示 bitmap（位图） 的矩形区域。
   *
   * @param {Number} x - 矩形区域的 X 坐标。
   * @param {Number} y - 矩形区域的 Y 坐标。
   * @param {Number} width - 矩形区域的宽度。
   * @param {Number} height - 矩形区域的高度。
   */
  setFrame(x, y, width, height) {
    this.texture.frame = new PIXI.Rectangle(x, y, width, height);
  }
}

module.exports = Sprite;