/**
 * 颜色类。
 *
 * @memberof RGUI.Display
 */
class Color {

  /**
   * 红色
   * @returns {Number}
   */
  get red(){ return this._red }
  set red(value) {
    value = Math.min(Math.max(0, value), 255);
    this._red = value
  }

  /**
   * 绿色
   * @returns {Number}
   */
  get green(){ return this._green }
  set green(value) {
    value = Math.min(Math.max(0, value), 255);
    this._green = value
  }

  /**
   * 蓝色
   * @returns {Number}
   */
  get blue(){ return this._blue }
  set blue(value) {
    value = Math.min(Math.max(0, value), 255);
    this._blue = value
  }

  /**
   * 透明度
   * @returns {Number}
   */
  get alpha(){ return this._alpha }
  set alpha(value) {
    value = Math.min(Math.max(0, value), 255);
    this._alpha = value
  }

  /**
   * 返回一个颜色对象的实例。
   *
   * @param {Number} r - 红色值。
   * @param {Number} g - 绿色值。
   * @param {Number} b - 蓝色值。
   * @param {Number} a - 透明度。
   */
  constructor(r, g, b, a) {
    this._class = Color;
    this._red = Math.min(Math.max(0, r || 0), 255);
    this._green = Math.min(Math.max(0, g || 0), 255);
    this._blue = Math.min(Math.max(0, b || 0), 255);
    this._alpha = Math.min(Math.max(0, a || 255), 255);
  }

  /**
   * 由形如 rgba(xx, xx, xx, xx) 或十六进制颜色码的字符串创建颜色对象。
   *
   * @param {String} str
   * @returns {RGUI.Display.Color|Boolean} 若成功，则返回颜色对象，失败返回 false。
   */
  static fromString(str){
    let color = false;
    if(str.match(/#(..)(..)(..)/)) {
      color = new Color(Number('0x' + $1), Number('0x' + $2), Number('0x' + $3))
    } else if(str.match(/^rgba\((\d*),.*(\d*),.*(\d*),.*(\d*)\)/)) {
      color = new Color($1, $2, $3, $4)
    }
    return color
  }

  /**
   * 将颜色对象转换为字符串。
   *
   * @param {Boolean} rgba=true - 是否转换为 rgba 形式。
   * @returns {String} 转换后的颜色代码。
   */
  toString(rgba = true) {
    let str = '';
    if (rgba){
      str = `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`
    } else {
      str = `#${this.red.toString(16).padZero(2)}${this.green.toString(16).padZero(2)}${this.blue.toString(16).padZero(2)}`
    }
    return str;
  }

  /**
   * 取图片反色。
   *
   * @returns {RGUI.Display.Color}
   */
  inverse() {
    return new Color(255 - this.red, 255 - this.green, 255 - this.blue, this.alpha)
  }

}
/**
 * 红色
 * @static
 * @type {RGUI.Display.Color}
 */
Color.red = new Color(255, 0, 0);
/**
 * 橙色
 * @static
 * @type {RGUI.Display.Color}
 */
Color.orange = new Color(255, 165, 0);
/**
 * 黄色
 * @static
 * @type {RGUI.Display.Color}
 */
Color.yellow = new Color(255, 255, 0);
/**
 * 绿色
 * @static
 * @type {RGUI.Display.Color}
 */
Color.green = new Color(0, 255, 0);
/**
 * 青色
 * @static
 * @type {RGUI.Display.Color}
 */
Color.ching = new Color(0, 255, 255);
/**
 * 蓝色
 * @static
 * @type {RGUI.Display.Color}
 */
Color.blue = new Color(0, 0, 255);
/**
 * 紫色
 * @static
 * @type {RGUI.Display.Color}
 */
Color.purple = new Color(139, 0, 255);
/**
 * 黑色
 * @static
 * @type {RGUI.Display.Color}
 */
Color.black = new Color(0, 0, 0);
/**
 * 白色
 * @static
 * @type {RGUI.Display.Color}
 */
Color.white  = new Color(255, 255, 255);
/**
 * 灰色
 * @static
 * @type {RGUI.Display.Color}
 */
Color.grey = new Color(100, 100, 100);

/**
 * 24 色环
 * @static
 * @type {RGUI.Display.Color}
 */
Color.cr1 = new Color(230, 3, 18);
/**
 * 24 色环
 * @static
 * @type {RGUI.Display.Color}
 */
Color.cr2 = new Color(233, 65, 3);
/**
 * 24 色环
 * @static
 * @type {RGUI.Display.Color}
 */
Color.cr3 = new Color(240, 126, 15);
/**
 * 24 色环
 * @static
 * @type {RGUI.Display.Color}
 */
Color.cr4 = new Color(240, 186, 26);
/**
 * 24 色环
 * @static
 * @type {RGUI.Display.Color}
 */
Color.cr5 = new Color(234, 246, 42);
/**
 * 24 色环
 * @static
 * @type {RGUI.Display.Color}
 */
Color.cr6 = new Color(183, 241, 19);
/**
 * 24 色环
 * @static
 * @type {RGUI.Display.Color}
 */
Color.cr7 = new Color(122, 237, 0);
/**
 * 24 色环
 * @static
 * @type {RGUI.Display.Color}
 */
Color.cr8 = new Color(62, 234, 2);
/**
 * 24 色环
 * @static
 * @type {RGUI.Display.Color}
 */
Color.cr9 = new Color(50, 198, 18);
/**
 * 24 色环
 * @static
 * @type {RGUI.Display.Color}
 */
Color.cr10 = new Color(51, 202, 73);
/**
 * 24 色环
 * @static
 * @type {RGUI.Display.Color}
 */
Color.cr11 = new Color(56, 203, 135);
/**
 * 24 色环
 * @static
 * @type {RGUI.Display.Color}
 */
Color.cr12 = new Color(60, 194, 197);
/**
 * 24 色环
 * @static
 * @type {RGUI.Display.Color}
 */
Color.cr13 = new Color(65, 190, 255);
/**
 * 24 色环
 * @static
 * @type {RGUI.Display.Color}
 */
Color.cr14 = new Color(46, 153, 255);
/**
 * 24 色环
 * @static
 * @type {RGUI.Display.Color}
 */
Color.cr15 = new Color(31, 107, 242);
/**
 * 24 色环
 * @static
 * @type {RGUI.Display.Color}
 */
Color.cr16 = new Color(10, 53, 231);
/**
 * 24 色环
 * @static
 * @type {RGUI.Display.Color}
 */
Color.cr17 = new Color(0, 4, 191);
/**
 * 24 色环
 * @static
 * @type {RGUI.Display.Color}
 */
Color.cr18 = new Color(56, 0, 223);
/**
 * 24 色环
 * @static
 * @type {RGUI.Display.Color}
 */
Color.cr19 = new Color(111, 0, 223);
/**
 * 24 色环
 * @static
 * @type {RGUI.Display.Color}
 */
Color.cr20 = new Color(190, 4, 220);
/**
 * 24 色环
 * @static
 * @type {RGUI.Display.Color}
 */
Color.cr21 = new Color(227, 7, 213);
/**
 * 24 色环
 * @static
 * @type {RGUI.Display.Color}
 */
Color.cr22 = new Color(226, 7, 169);
/**
 * 24 色环
 * @static
 * @type {RGUI.Display.Color}
 */
Color.cr23 = new Color(227, 3, 115);
/**
 * 24 色环
 * @static
 * @type {RGUI.Display.Color}
 */
Color.cr24 = new Color(227, 2, 58);

module.exports = Color;