/**
 * Class Rect.
 * @memberof RGUI.Box
 */
class Rect {
  /**
   * 创建一个矩形对象(轴对齐矩形)。
   * @param {Number} x - 矩形左上角的 X 坐标。
   * @param {Number} y - 矩形左上角的 Y 坐标。
   * @param {Number} width - 矩形的宽度。
   * @param {Number} height - 矩形的高度。
   */
  constructor(x = 0, y = 0, width = 0, height = 0) {
    this._class = Rect;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height
  }

  /**
   * 移动。
   * @param {Number} x - 矩形 X 坐标的增加值。
   * @param {Number} y - 矩形 Y 坐标的增加值。
   */
  move(x = 0, y = 0) {
    this.x = this.x + x;
    this.y = this.y + y
  }

  /**
   * 移动到。
   * @param {Number} x - 新的矩形的 X 坐标。
   * @param {Number} y - 新的矩形的 Y 坐标。
   */
  moveTo(x = 0, y = 0) {
    this.x = x;
    this.y = y
  }

  /**
   * 设置大小。
   * @param {Number} width - 矩形新的宽度值。
   * @param {Number} height - 矩形新的高度值。
   */
  setSize(width = 0, height = 0) {
    this.width = width;
    this.height = height
  }

  /**
   * 判断点是否在矩形内。
   * @param {Number} x - 欲判断的点的 X 坐标。
   * @param {Number} y - 欲判断的点的 Y 坐标。
   */
  hit(x, y) {
    return this.x <= x && (this.x + this.width) >= x && this.y <= y && (this.y + this.height) >= y
  }
}

module.exports = Rect;