/**
 * Class Rect.
 * @author shitake <z1522716486@hotmail.com>
 * @license MIT <https://mit-license.org/>
 */
class Rect {
  constructor(x = 0, y = 0, width = 0, height = 0) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height
  }

  move(x = 0, y = 0) {
    this.x = this.x + x;
    this.y = this.y + y
  }

  moveTo(x = 0, y = 0) {
    this.x = x;
    this.y = y
  }

  setSize(width = 0, height = 0) {
    this.width = width;
    this.height = height
  }

  hit(x, y) {
    return this.x <= x && (this.x + this.width) >= x && this.y <= y && (this.y + this.height) >= y
  }
}

/**
 * Class Round.
 * @author shitake <z1522716486@hotmail.com>
 * @license MIT <https://mit-license.org/>
 */
class Round {
  constructor(x = 0, y = 0, radius = 0) {
    this.x = x;
    this.y = y;
    this.radius = radius
  }

  move(x = 0, y = 0) {
    this.x = this.x + x;
    this.y = this.y + y
  }

  moveTo(x = 0, y = 0) {
    this.x = x;
    this.y = y
  }

  setSize(value = 0) {
    this.radius = value
  }

  hit(x, y) {
    return Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2) <= Math.pow(this.radius, 2)
  }
}

/**
 * Module Box.
 * @author shitake <z1522716486@hotmail.com>
 * @license MIT <https://mit-license.org/>
 */
const Box = {
  Rect: Rect,
  Round: Round,
};

module.exports = Box;