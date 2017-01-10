const PIXI = require('../lib/pixi');
const Svent = require('../lib/svent');
const Color = require('./color');

/**
 * 位图类，基本的显示对象。
 *
 * @memberof RGUI.Display
 */
class Bitmap {

  get canvas(){ return this._canvas }

  get ctx() { return this._ctx }

  get image() { return this._image }

  get url() { return this._image ? this._image.src : '' }

  get width(){ return this._canvas.width }

  get height(){ return this._canvas.height }

  /**
   * 返回一个 bitmap 对象。
   *
   * @param {Number} width
   * @param {Number} height
   */
  constructor(width, height) {
    this._class = Bitmap;
    this._canvas = document.createElement('canvas');
    this._ctx = this._canvas.getContext('2d');
    this._canvas.width = Math.max(width || 0, 1);
    this._canvas.height = Math.max(height || 0, 1);
    this._image = null;
    this._isLoading = false;
    this._hasError = false;
    this._loadCallback = {};
    this._font = {
      style: 'normal',
      variant: 'normal',
      weight: 'normal',
      name: 'Arial',
      size: 28,
      textAlign: 'start',
      color: Color.white,
      outlineColor: Color.black,
      toString: function () {
        return (this.style == '' ? '' : this.style + ' ') +
          (this.variant == '' ? '' : this.variant + ' ') +
          (this.weight == '' ? '' : this.variant + ' ') +
          (this.size + 'px ') +
          (this.name == '' ? '' : this.name + ' ')
      }
    }
  }

  /**
   * 加载图片文件，返回一个新的位图对象。
   *
   * @param {String} url - 加载图片的地址。
   * @param {Function} onLoad - 加载成功时的回调函数，非必须。
   * @param {Function} onError - 加载失败时的回调函数，非必须。
   * @returns {RGUI.Display.Bitmap}
   */
  static load (url, onLoad, onError) {
    let bitmap = new Bitmap();
    bitmap._image = new Image();
    bitmap._isLoading = true;
    bitmap._image.src = url;
    bitmap._image.onload = bitmap._onLoad.bind(bitmap);
    bitmap._image.onerror = bitmap._onError.bind(bitmap);
    bitmap._loadCallback = {
      onLoad: onLoad,
      onError: onError
    };
    return bitmap;
  }

  static _cut (source, dx, dy, number, width, height) {
    let bitmaps = [];
    for (let i = 0; i < number; i++) {
      var x = i * dx;
      var y = i * dy;
      var bitmap = new Bitmap(width, height);
      bitmap.blt(source, x, y, width, height, 0, 0);
      bitmaps.push(bitmap);
    }
    return bitmaps;
  }

  /**
   * 按类型切割 bitmap 对象。
   *
   * @param {RGUI.Display.Bitmap} source
   * @param {Number} width
   * @param {Number} height
   * @param {Number} type
   * @returns {Array<RGUI.Display.Bitmap>}
   */
  static cut (source, width, height, type) {
    let bitmaps = [];
    switch (type) {
      case 0:
        bitmaps = Bitmap.cutRow(source, width, height);
        break;
      case 1:
        bitmaps = Bitmap.cutRank(source, width, height);
        break;
      case 2:
        bitmaps = Bitmap.cutRowRank(source, width, height);
        break;
      case 3:
        bitmaps = Bitmap.cutRankRow(source, width, height);
        break;
      default:
        throw new Error('Type error')
    }
    return bitmaps;
  }

  /**
   * 按配置表切割 bitmap 对象。
   *
   * @param {RGUI.Display.Bitmap} source
   * @param {Array<Object>} config
   * @returns {Array<RGUI.Display.Bitmap>}
   */
  static cutConf (source, config) {
    let bitmaps = [];
    config.forEach((conf)=>{
      let bitmap = new Bitmap(conf[2], conf[3]);
      bitmap.blt(source, conf[0], conf[1], conf[2], conf[3], 0, 0);
      bitmaps.push(bitmap)
    });
    return bitmaps;
  }

  static cutRow (source, width, height) {
    let number = source.width / width;
    var dx = width;
    var dy = 0;
    return Bitmap._cut(source, dx, dy, number, width, height);
  }

  static cutRank (source, width, height) {
    let number = source.height / height;
    var dx = 0;
    var dy = height;
    return Bitmap._cut(source, dx, dy, number, width, height);
  }

  static cutRowRank (source, width, height) {
    let bitmaps1 = this.cutRow(source, width, source.height);
    let bitmaps2 = [];
    bitmaps1.forEach((bitmap)=>{
      bitmaps2 = bitmaps2.concat(Bitmap.cutRank(bitmap, width, height))
    });
    return bitmaps2;
  }

  static cutRankRow (source, width, height) {
    let bitmaps1 = this.cutRank(source, source.width, height);
    let bitmaps2 = [];
    bitmaps1.forEach((bitmap)=>{
      bitmaps2 = bitmaps2.concat(Bitmap.cutRow(bitmap, width, height))
    });
    return bitmaps2;
  }

  /**
   * 截取当前游戏画面，完成后将调用回调函数 callback 并返回 Bitmap（位图） 对象。
   *
   * @param callback
   */
  static snap (callback) {
    let win = require('electron').remote.getCurrentWindow();
    win.capturePage((image)=>{
      let bitmap = new Bitmap();
      bitmap._image = image;
      bitmap.resize(image.width, image.height);
      bitmap.ctx.drawImage(image, 0, 0);
      callback(bitmap)
    })
  }

  _onLoad () {
    this.resize(this._image.width, this._image.height);
    this._ctx.drawImage(this._image, 0, 0);
    this._isLoading = false;
    this._loadCallback.onLoad();
  }

  _onError () {
    this._hasError = true;
    this._loadCallback.onError();
    Bitmap.eventManager.trigger('load_error', {url: this.url})
  }

  /**
   * 九宫格。
   *
   * @param a
   * @param b
   * @param c
   * @param d
   * @param width
   * @param height
   */
  scale9bitmap(a, b, c, d, width, height) {
    let w = this.width - a - b;
    let h = this.height - c - d;
    let config = [
      [0, 0, a, c],
      [a, 0, w, c],
      [this.width - b, 0, b, c],
      [0, c, a, h],
      [a, c, w, h],
      [this.width - b, c, b, h],
      [0, this.height - d, a, d],
      [a, this.height - d, w, d],
      [this.width - b, this.height - d, b, d]
    ];
    let bitmaps = Bitmap.cutConf(this, config);
    let w_number = (width - a - b) / w;
    let w_remainder = (width - a - b) % w;
    let h_number = (height - c - d) / h;
    let h_remainder = (height - c - d) % h;
    bitmap = new Bitmap(width, height)
    //TODO: 未完成
  }

  /**
   * 重新调整 bitmap 的大小。
   *
   * @param {Number} width - 新的宽度。
   * @param {Number} height - 新的高度。
   */
  resize(width, height) {
    width = Math.max(width || 0, 1);
    height = Math.max(height || 0, 1);
    this._canvas.width = width;
    this._canvas.height = height;
  }

  /**
   *
   * @param source
   * @param sx
   * @param sy
   * @param sw
   * @param sh
   * @param dx
   * @param dy
   * @param dw
   * @param dh
   */
  blt(source, sx, sy, sw, sh, dx, dy, dw, dh) {
    dw = dw || sw;
    dh = dh || sh;
    if (sx >= 0 && sy >= 0 && sw > 0 && sh > 0 && dw > 0 && dh > 0 &&
      sx + sw <= source.width && sy + sh <= source.height) {
      this._ctx.globalCompositeOperation = 'source-over';
      this._ctx.drawImage(source.canvas, sx, sy, sw, sh, dx, dy, dw, dh);
    }
  }

  /**
   * 获取指定点的颜色。
   *
   * @param {Number} x - 指定点的 X 坐标。
   * @param {Number} y - 指定点的 Y 坐标。
   * @returns {RGUI.Display.Color}
   */
  getPixel(x, y) {
    let data = this._ctx.getImageData(x, y, 1, 1).data;
    return new Color(data[0], data[1], data[2], data[3])
  }

  /**
   * 设置 bitmap 指定位置的像素颜色。
   *
   * @param {Number} x - 指定点的 X 坐标。
   * @param {Number} y - 指定点的 Y 坐标。
   * @param {RGUI.Display.Color} color - 欲设置的颜色。
   */
  setPixel(x, y, color) {
    let data = this._ctx.getImageData(x, y, 1, 1).data;
    data[0] = color.red;
    data[1] = color.green;
    data[2] = color.blue;
    data[3] = color.alpha;
  }

  /**
   * 清除指定矩形内的内容。
   *
   * @param {Number} x
   * @param {Number} y
   * @param {Number} width
   * @param {Number} height
   */
  clearRect(x, y, width, height) {
    this._ctx.clearRect(x, y, width, height);
  }

  /**
   * 清空整个位图对象。
   */
  clear() {
    this.clearRect(0, 0, this.width, this.height)
  }

  /**
   * TODO: 待实现
   */
  fillRect(x, y, width, height, fillColor, strokeColor) {

  }

  /**
   * TODO: 待实现
   */
  fillAll(fillColor, strokeColor) {

  }

  /**
   * TODO: 待实现
   */
  fillRoundedRect(x, y, width, height, fillColor, strokeColor) {

  }

  /**
   * TODO: 待实现
   */
  fillRoundedAll(fillColor, strokeColor) {

  }

  /**
   * TODO: 待实现
   */
  drawCircle (x, y, radius, color) {

  }

  drawText (text, x, y, maxWidth, align = this._font.textAlign) {
    if(text != void 0) {
      this._ctx.font = this._font.toString();
      this._ctx.textAlign = align;
      this._ctx.textBaseline = 'alphabetic';
      this._ctx.fillText(x, y, maxWidth)
    }
  }

  getTextWidth (text) {
    this._ctx.font = this._font.toString();
    return this._ctx.measureText(text).width
  }

  /**
   * TODO: 待实现
   */
  blur () {

  }

}

Bitmap.eventManager = new Svent.EventManager();

module.exports = Bitmap;