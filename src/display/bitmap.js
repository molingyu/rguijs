const PIXI = require('../lib/pixi');
const Svent = require('./svent');
const Color = require('./color');

/**
 * 位图类，基本的显示对象。
 *
 * @memberof RGUI.Display
 */
class Bitmap {

  constructor(width, height) {
    this._class = Bitmap;
    this._canvas = document.createElement('canvas');
    this._ctx = this._canvas.getContext('2d');
    this._canvas.width = Math.max(width || 0, 1);
    this._canvas.height = Math.max(height || 0, 1);
    this._baseTexture = new PIXI.BaseTexture(this._canvas);
    this._baseTexture.mipmap = false;
    this._baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    this._images = null;
    this._url = '';
    this._paintOpacity = 255;
    this._smooth = false;
    this._loadListeners = [];
    this._isLoading = false;
    this._hasError = false;
    this._dirty = false;
  }

  static load (url, onLoad, onError) {
    let bitmap = new Bitmap();
    bitmap._images = new Image();
    bitmap._url = url;
    bitmap._isLoading = true;
    bitmap._images.src = url;
    bitmap._images.onload = this._onLoad;
    bitmap._images.onerror = this._onError;
    bitmap._loadCallback = {
      onLoad: onLoad,
      onError: onError
    };
    return bitmap;
  }

  _onLoad () {
    this.resize(this._images.width, this._images.height);
    this._ctx.drawImage(this._images, 0, 0);
    this._isLoading = false;
    this._dirty = true;
    this._loadCallback.onLoad();
  }

  _onError () {
    this._hasError = true;
    this._loadCallback.onError();
    Bitmap.eventManager.trigger('load_error', {url: this._url})
  }

  /**
   * 重新调整 bitmap 的大小。
   *
   * @method resize
   * @param {Number} width - 新的宽度。
   * @param {Number} height - 新的高度。
   */
  resize(width, height) {
    width = Math.max(width || 0, 1);
    height = Math.max(height || 0, 1);
    this._canvas.width = width;
    this._canvas.height = height;
    this._baseTexture.width = width;
    this._baseTexture.height = height;
  }

  blt(source, sx, sy, sw, sh, dx, dy, dw, dh) {
    dw = dw || sw;
    dh = dh || sh;
    if (sx >= 0 && sy >= 0 && sw > 0 && sh > 0 && dw > 0 && dh > 0 &&
      sx + sw <= source.width && sy + sh <= source.height) {
      this._ctx.globalCompositeOperation = 'source-over';
      this._ctx.drawImage(source._canvas, sx, sy, sw, sh, dx, dy, dw, dh);
      this._dirty = true;
    }
  }

  getPixel(x, y) {
    let data = this._ctx.getImageData(x, y, 1, 1).data;
    return new Color(data[0], data[1], data[2], data[3]);
  }

  setPixel(x, y, color) {
    let data = this._ctx.getImageData(x, y, 1, 1).data;
    data[0] = color.red;
    data[1] = color.green;
    data[2] = color.blue;
    data[3] = color.alpha;
  }

  isReady () {
    return !this._isLoading;
  }

  clearRect(x, y, width, height) {
    this._ctx.clearRect(x, y, width, height);
    this._dirty = true
  }

  clear() {
    this.clearRect(0, 0, this.width, this.height)
  }

  fillRect(x, y, width, height, fillColor, strokeColor) {

  }

  fillAll(fillColor, strokeColor) {

  }

  fillRoundedRect(x, y, width, height, fillColor, strokeColor) {

  }

  fillRoundedAll(fillColor, strokeColor) {

  }

  drawCircle (x, y, radius, color) {

  }

  drawText (text, x, y, maxWidth, lineHeight, align) {

  }

  getTextWidth (text) {

  }

  blur () {

  }

  checkDirty () {
    if (this._dirty) {
      this._baseTexture.update();
      this._dirty = false;
    }
  }
}

Bitmap.eventManager = new Svent.EventManager();

module.exports = Bitmap;