/**
 * Class Round.
 * @memberof RGUI.Box
 */
class Round {
  /**
   * 创建一个圆对象。
   * @param {Number} x - 圆心的 X 坐标。
   * @param {Number} y - 圆心的 Y 坐标。
   * @param {Number} radius - 圆半径。
   */
  constructor(x = 0, y = 0, radius = 0) {
    this.x = x;
    this.y = y;
    this.radius = radius
  }

  /**
   * 移动。
   * @param {Number} x - 圆心 X 坐标的增加值。
   * @param {Number} y - 圆心 Y 坐标的增加值。
   */
  move(x = 0, y = 0) {
    this.x = this.x + x;
    this.y = this.y + y
  }

  /**
   * 移动到。
   * @param {Number} x - 新的圆心的 X 坐标。
   * @param {Number} y - 新的圆心的 Y 坐标。
   */
  moveTo(x = 0, y = 0) {
    this.x = x;
    this.y = y
  }

  /**
   * 设置大小。
   * @param {Number} value - 圆的新半径值。
   */
  setSize(value = 0) {
    this.radius = value
  }

  /**
   * 判断点是否在圆上内。
   * @param {Number} x - 欲判断的点的 X 坐标。
   * @param {Number} y - 欲判断的点的 Y 坐标。
   */
  hit(x, y) {
    return Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2) <= Math.pow(this.radius, 2)
  }
}

module.exports = Round;