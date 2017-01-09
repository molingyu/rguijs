
class Color {

  get red(){ return this._red }
  set red(value) {
    value = Math.min(Math.max(0, value), 255);
    this._red = value
  }

  get green(){ return this._green }
  set green(value) {
    value = Math.min(Math.max(0, value), 255);
    this._green = value
  }

  get blue(){ return this._blue }
  set blue(value) {
    value = Math.min(Math.max(0, value), 255);
    this._blue = value
  }

  get alpha(){ return this._alpha }
  set alpha(value) {
    value = Math.min(Math.max(0, value), 255);
    this._alpha = value
  }

  constructor(r, g, b, a) {
    this._class = Color;
    this._red = Math.min(Math.max(0, r || 0), 255);
    this._green = Math.min(Math.max(0, g || 0), 255);
    this._blue = Math.min(Math.max(0, b || 0), 255);
    this._alpha = Math.min(Math.max(0, a || 255), 255);
  }

  static fromString(str){
    let color = false;
    if(str.match(/#(..)(..)(..)/)) {
      color = new Color(Number('0x' + $1), Number('0x' + $2), Number('0x' + $3))
    } else if(str.match(/^rgba\((\d*),.*(\d*),.*(\d*),.*(\d*)\)/)) {
      color = new Color($1, $2, $3, $4)
    }
    return color
  }

  toString(rgba) {
    rgba = rgba || true;
    let str = '';
    if (rgba){
      str = `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`
    } else {
      str = `#${this.red.toString(16).padZero(2)}${this.green.toString(16).padZero(2)}${this.blue.toString(16).padZero(2)}`
    }
    return str;
  }

  inverse() {
    return new Color(255 - this.red, 255 - this.green, 255 - this.blue, this.alpha)
  }

}

Color.red = new Color(255, 0, 0);
Color.orange = new Color(255, 165, 0);
Color.yellow = new Color(255, 255, 0);
Color.green = new Color(0, 255, 0);
Color.ching = new Color(0, 255, 255);
Color.blue = new Color(0, 0, 255);
Color.purple = new Color(139, 0, 255);
Color.black = new Color(0, 0, 0);
Color.white  = new Color(255, 255, 255);
Color.grey = new Color(100, 100, 100);

Color.cr1 = new Color(230, 3, 18);
Color.cr2 = new Color(233, 65, 3);
Color.cr3 = new Color(240, 126, 15);
Color.cr4 = new Color(240, 186, 26);
Color.cr5 = new Color(234, 246, 42);
Color.cr6 = new Color(183, 241, 19);
Color.cr7 = new Color(122, 237, 0);
Color.cr8 = new Color(62, 234, 2);
Color.cr9 = new Color(50, 198, 18);
Color.cr10 = new Color(51, 202, 73);
Color.cr11 = new Color(56, 203, 135);
Color.cr12 = new Color(60, 194, 197);
Color.cr13 = new Color(65, 190, 255);
Color.cr14 = new Color(46, 153, 255);
Color.cr15 = new Color(31, 107, 242);
Color.cr16 = new Color(10, 53, 231);
Color.cr17 = new Color(0, 4, 191);
Color.cr18 = new Color(56, 0, 223);
Color.cr19 = new Color(111, 0, 223);
Color.cr20 = new Color(190, 4, 220);
Color.cr21 = new Color(227, 7, 213);
Color.cr22 = new Color(226, 7, 169);
Color.cr23 = new Color(227, 3, 115);
Color.cr24 = new Color(227, 2, 58);

module.exports = Color;