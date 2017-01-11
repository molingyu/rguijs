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
      let x = i * dx;
      let y = i * dy;
      let bitmap = new Bitmap(width, height);
      bitmap.blt(source, x, y, width, height, 0, 0);
      bitmaps.push(bitmap);
    }
    return bitmaps;
  }

  /**
   * 按类型切割 bitmap 对象。
   *
   * @param {RGUI.Display.Bitmap} source - 源位图。
   * @param {Number} width - 切割后的每个位图的宽度。
   * @param {Number} height - 切割后的每个位图的高度。
   * @param {Number} type - 切割方式，可选值为 0、1、2、3。分别对应按行切割、安列切、先行后列、先列后行。
   * @returns {Array<RGUI.Display.Bitmap>} - 切割后的位图对象数组。
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
   * @param {RGUI.Display.Bitmap} source - 源位图。
   * @param {Array<Object>} config - 记录坐标位置和大小数据的数组。
   * @returns {Array<RGUI.Display.Bitmap>} - 切割后的位图对象数组。
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
    let dx = width;
    let dy = 0;
    return Bitmap._cut(source, dx, dy, number, width, height);
  }

  static cutRank (source, width, height) {
    let number = source.height / height;
    let dx = 0;
    let dy = height;
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
   * 返回按九宫格放大后的新位图。
   *
   *
   * @param {Number} a
   * @param {Number} b
   * @param {Number} c
   * @param {Number} d
   * @param {Number} width - 新位图宽度。
   * @param {Number} height - 新位图高度。
   * @param {Boolean} scale=false - 放大模式。为真时缩放，为假时平铺。
   */
  scale9bitmap(a, b, c, d, width, height, scale = false) {
    // 关于 a b c d 参数
    // +-----+--------+-----+
    // |     |        |     | c
    // +-----+--------+-----+
    // |     |        |     |
    // |     |        |     |
    // +-----+--------+-----+
    // |     |        |     | d
    // +-----+--------+-----+
    //    a              b
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
    let bitmap = new Bitmap(width, height);
    if(scale) {
      // 中心
      for (let n = 0; n < w_number; n++) {
        for (let i = 0; i < h_number; i++) {
          bitmap.blt(bitmaps[4], 0, 0, bitmaps[4].width, bitmaps[4].height, a + n * w, c+ i * h);
          if(n == 0) bitmap.blt(bitmaps[4], 0, 0, w_remainder, h, a + w_number * w, c+ i * h)
        }
        bitmap.blt(bitmaps[4], 0, 0, w, h_remainder, a + n * w, c + h_number * h)
      }
      // w
      for (let n = 0; n < w_number; n++) {
        bitmap.blt(bitmaps[1], 0, 0, bitmaps[1].width, bitmap[1].height, a + n * w, 0);
        bitmap.blt(bitmaps[7], 0, 0, bitmaps[7].width, bitmap[7].height, a + n * w, height - d)
      }
      bitmap.blt(bitmaps[1], 0, 0, w_remainder, bitmap[1].height, a + w_number * w, 0);
      bitmap.blt(bitmaps[7], 0, 0, w_remainder, bitmap[7].height, a + w_number * w, height - d);
      // h
      for (let n = 0; n < h_number; n++) {
        bitmap.blt(bitmaps[3], 0, 0, bitmaps[3].width, bitmap[3].height, 0, c + n * h);
        bitmap.blt(bitmaps[5], 0, 0, bitmaps[5].width, bitmap[5].height, width - b, c + n * h)
      }
      bitmap.blt(bitmaps[3], 0, 0, bitmaps[3].width, h_remainder, 0, c + h_number * h);
      bitmap.blt(bitmaps[5], 0, 0, bitmaps[5].width, h_remainder, width - b, c + h_number * h)
    } else {
      bitmap.blt(bitmaps[4], 0, 0, bitmaps[4].width, bitmaps[4].height, a, c, width - a - b, height - c - d);
      bitmap.blt(bitmaps[1], 0, 0, bitmaps[1].width, bitmaps[1].height, a, 0, width - a - b, c);
      bitmap.blt(bitmaps[7], 0, 0, bitmaps[7].width, bitmaps[7].height, a, height - d, width - a - b, d);
      bitmap.blt(bitmaps[3], 0, 0, bitmaps[3].width, bitmaps[3].height, 0, c, a, height - c - d);
      bitmap.blt(bitmaps[5], 0, 0, bitmaps[5].width, bitmaps[5].height, width - b, c, b, height - c - d)
    }
    // 四角
    bitmap.blt(bitmaps[0], 0, 0, bitmaps[0].width, bitmaps[0].height, 0, 0);
    bitmap.blt(bitmaps[2], 0, 0, bitmaps[2].width, bitmaps[2].height, width - b, 0);
    bitmap.blt(bitmaps[6], 0, 0, bitmaps[6].width, bitmaps[6].height, 0, height - d);
    bitmap.blt(bitmaps[8], 0, 0, bitmaps[8].width, bitmaps[8].height, width - b, height - d);
    return bitmap
  }

  /**
   * 重新调整 bitmap 的大小。
   *
   * @param {Number} width=0 - 新的宽度。
   * @param {Number} height=0 - 新的高度。
   */
  resize(width, height) {
    width = Math.max(width || 0, 1);
    height = Math.max(height || 0, 1);
    this._canvas.width = width;
    this._canvas.height = height;
  }

  /**
   * 将源位图给定矩形区域的数据传送到当前位图的给定矩形区域内。
   *
   * @param {RGUI.Display.Bitmap} source - 源位图。
   * @param {Number} sx - 源位图矩形区域左上角的 X 坐标。
   * @param {Number} sy - 源位图矩形区域左上角的 Y 坐标。
   * @param {Number} sw - 源位图矩形区域的宽度。
   * @param {Number} sh - 源位图矩形区域的高度。
   * @param {Number} dx - 目标区域左上角的 X 坐标。
   * @param {Number} dy - 目标区域左上角的 Y 坐标。
   * @param {Number} dw=sw - 目标区域的宽度。
   * @param {Number} dh=sh - 目标区域的高度。
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
   * @param {Number} x - 矩形区域的 X 坐标。
   * @param {Number} y - 矩形区域的 Y 坐标。
   * @param {Number} width - 矩形区域的宽度。
   * @param {Number} height - 矩形区域的高度。
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
   * 填充指定矩形区域。
   *
   * @param {Number} x - 矩形区域的 X 坐标。
   * @param {Number} y - 矩形区域的 Y 坐标。
   * @param {Number} width - 矩形区域的宽度。
   * @param {Number} height - 矩形区域的高度。
   * @param {RGUI.Display.Color} fillColor - 填充颜色。
   * @param {RGUI.Display.Color} strokeColor=fillColor - 边框颜色。
   */
  fillRect(x, y, width, height, fillColor, strokeColor = fillColor) {
    let context = this._ctx;
    context.save();
    context.fillRect(x, y, width, height);
    context.fillStyle = fillColor.toString();
    context.strokeStyle = strokeColor.toString();
    context.restore();
  }

  /**
   * 填充整个位图。
   *
   * @param {RGUI.Display.Color} fillColor - 填充颜色。
   * @param {RGUI.Display.Color} strokeColor=fillColor - 边框颜色。
   */
  fillAll(fillColor, strokeColor = fillColor) {
    this.fillRect(0, 0, this.width, this.height, fillColor, strokeColor)
  }

  /**
   * 以圆角矩形填充指定位置。
   *
   * @param {Number} x - 矩形区域的 X 坐标。
   * @param {Number} y - 矩形区域的 Y 坐标。
   * @param {Number} width - 矩形区域的宽度。
   * @param {Number} height - 矩形区域的高度。
   * @param {Number} radius - 圆角矩形圆角的半径。
   * @param {RGUI.Display.Color} fillColor - 填充颜色。
   * @param {RGUI.Display.Color} strokeColor=fillColor - 边框颜色。
   */
  fillRoundedRect(x, y, width, height, radius, fillColor, strokeColor = fillColor) {
    let context = this._ctx;
    context.save();
    context.beginPath();
    if (width> 0) context.moveTo(x + radius, y);
    else  context.moveTo(x - radius, y);
    context.arcTo(x+width, y, x + width, y+height, radius);
    context.arcTo(x+width, y + height,x,y+height, radius);
    context.arcTo(x, y+height, x, y, radius);
    if(width> 0) {
      context.arcTo(x, y, x+radius, y, radius);
    }
    else{
      context.arcTo(x, y, x-radius, y, radius);
    }
    context.fillStyle = fillColor;
    context.strokeStyle = strokeColor;
    context.stroke();
    context.fill();
    context.restore();
  }

  /**
   * 以圆角矩形填充整个位图对象。
   *
   * @param {Number} radius - 圆角矩形圆角的半径。
   * @param {RGUI.Display.Color} fillColor - 填充颜色。
   * @param {RGUI.Display.Color} strokeColor=fillColor - 边框颜色。
   */
  fillRoundedAll(radius, fillColor, strokeColor = fillColor) {
    this.fillRoundedRect(0, 0, this.width, this.height, radius, fillColor, strokeColor)
  }

  /**
   * 以圆形填充指定位置。
   *
   * @param {Number} x - 圆心的 X 坐标。
   * @param {Number} y - 圆心的 Y 坐标。
   * @param {Number} radius - 圆的半径。
   * @param {RGUI.Display.Color} fillColor - 填充颜色。
   * @param {RGUI.Display.Color} strokeColor=fillColor - 边框颜色。
   */
  drawCircle (x, y, radius, fillColor, strokeColor = fillColor) {
    let context = this._ctx;
    context.save();
    context.fillStyle = fillColor;
    context.strokeStyle = strokeColor;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.fill();
    context.restore();
  }

  /**
   * 在指定位置绘制文字。
   *
   * @param {String} text - 要绘制的文本。
   * @param {Number} x - 文字左侧的 X 坐标。
   * @param {Number} y - 文字左侧的 Y 坐标。
   * @param {Number} maxWidth - 文字允许的最大宽度。
   * @param {String} align - 文字的对齐方式。
   */
  drawText (text, x, y, maxWidth, align = this._font.textAlign) {
    if(text != void 0) {
      this._ctx.font = this._font.toString();
      this._ctx.textAlign = align;
      this._ctx.textBaseline = 'alphabetic';
      this._ctx.fillText(x, y, maxWidth)
    }
  }

  /**
   * 测量指定文字的宽度。
   *
   * @param {String} text - 预测量的文字。
   * @returns {Number} - 文字的宽度。
   */
  getTextWidth (text) {
    this._ctx.font = this._font.toString();
    return this._ctx.measureText(text).width
  }

  /**
   * 对位图对象执行高斯模糊，非特殊情况不推荐使用该方法。可以考虑使用 [PIXI.filters.BlurFilter](http://pixijs.download/release/docs/PIXI.filters.BlurFilter.html) 做替代。
   * 具体算法来源见下：
   * StackBlur - a fast almost Gaussian Blur For Canvas
   * Version: 	0.5
   * Author:		Mario Klingemann
   * Contact: 	mario@quasimondo.com
   * Website:	http://www.quasimondo.com/StackBlurForCanvas
   * Twitter:	@quasimondo
   *
   * @param radius
   * @param blurAlphaChannel
   */
  blur (radius = 0, blurAlphaChannel = true) {
    if ( isNaN(radius) || radius < 1 ) return;

    let mul_table = [
      512,512,456,512,328,456,335,512,405,328,271,456,388,335,292,512,
      454,405,364,328,298,271,496,456,420,388,360,335,312,292,273,512,
      482,454,428,405,383,364,345,328,312,298,284,271,259,496,475,456,
      437,420,404,388,374,360,347,335,323,312,302,292,282,273,265,512,
      497,482,468,454,441,428,417,405,394,383,373,364,354,345,337,328,
      320,312,305,298,291,284,278,271,265,259,507,496,485,475,465,456,
      446,437,428,420,412,404,396,388,381,374,367,360,354,347,341,335,
      329,323,318,312,307,302,297,292,287,282,278,273,269,265,261,512,
      505,497,489,482,475,468,461,454,447,441,435,428,422,417,411,405,
      399,394,389,383,378,373,368,364,359,354,350,345,341,337,332,328,
      324,320,316,312,309,305,301,298,294,291,287,284,281,278,274,271,
      268,265,262,259,257,507,501,496,491,485,480,475,470,465,460,456,
      451,446,442,437,433,428,424,420,416,412,408,404,400,396,392,388,
      385,381,377,374,370,367,363,360,357,354,350,347,344,341,338,335,
      332,329,326,323,320,318,315,312,310,307,304,302,299,297,294,292,
      289,287,285,282,280,278,275,273,271,269,267,265,263,261,259];
    let shg_table = [
      9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17,
      17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19,
      19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20,
      20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21,
      21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21,
      21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22,
      22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
      22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23,
      23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
      23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
      23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
      23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
      24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
      24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
      24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
      24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24 ];

    let BlurStack = function () {
      this.r = 0;
      this.g = 0;
      this.b = 0;
      this.a = 0;
      this.next = null;
    };

    let stackBlurCanvasRGBA = function (context, top_x, top_y, width, height, radius) {
      if (isNaN(radius) || radius < 1) return;
      radius |= 0;

      let imageData;

      try {
        try {
          imageData = context.getImageData(top_x, top_y, width, height);
        } catch(e) {

          // NOTE: this part is supposedly only needed if you want to work with local files
          // so it might be okay to remove the whole try/catch block and just use
          // imageData = context.getImageData(top_x, top_y, width, height);
          try {
            netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
            imageData = context.getImageData(top_x, top_y, width, height);
          } catch(e) {
            console.log("Cannot access local image");
            throw new Error("unable to access local image data: " + e);
          }
        }
      } catch(e) {
        console.log("Cannot access image");
        throw new Error("unable to access image data: " + e);
      }

      let pixels = imageData.data;

      let x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum,
        r_out_sum, g_out_sum, b_out_sum, a_out_sum,
        r_in_sum, g_in_sum, b_in_sum, a_in_sum,
        pr, pg, pb, pa, rbs;

      let div = radius + radius + 1;
      let w4 = width << 2;
      let widthMinus1  = width - 1;
      let heightMinus1 = height - 1;
      let radiusPlus1  = radius + 1;
      let sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;

      let stackStart = new BlurStack();
      let stackEnd;
      let stack = stackStart;
      for (let i = 1; i < div; i++) {
        stack = stack.next = new BlurStack();
        if (i == radiusPlus1) stackEnd = stack;
      }
      stack.next = stackStart;
      let stackIn = null;
      let stackOut = null;

      yw = yi = 0;

      let mul_sum = mul_table[radius];
      let shg_sum = shg_table[radius];

      for (let y = 0; y < height; y++) {
        r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;

        r_out_sum = radiusPlus1 * (pr = pixels[yi]);
        g_out_sum = radiusPlus1 * (pg = pixels[yi+1]);
        b_out_sum = radiusPlus1 * (pb = pixels[yi+2]);
        a_out_sum = radiusPlus1 * (pa = pixels[yi+3]);

        r_sum += sumFactor * pr;
        g_sum += sumFactor * pg;
        b_sum += sumFactor * pb;
        a_sum += sumFactor * pa;

        stack = stackStart;

        for(let i = 0; i < radiusPlus1; i++) {
          stack.r = pr;
          stack.g = pg;
          stack.b = pb;
          stack.a = pa;
          stack = stack.next;
        }

        for(let i = 1; i < radiusPlus1; i++) {
          p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
          r_sum += (stack.r = (pr = pixels[p])) * (rbs = radiusPlus1 - i);
          g_sum += (stack.g = (pg = pixels[p+1])) * rbs;
          b_sum += (stack.b = (pb = pixels[p+2])) * rbs;
          a_sum += (stack.a = (pa = pixels[p+3])) * rbs;

          r_in_sum += pr;
          g_in_sum += pg;
          b_in_sum += pb;
          a_in_sum += pa;

          stack = stack.next;
        }

        stackIn = stackStart;
        stackOut = stackEnd;
        for (let x = 0; x < width; x++) {
          pixels[yi+3] = pa = (a_sum * mul_sum) >> shg_sum;
          if (pa != 0) {
            pa = 255 / pa;
            pixels[yi]   = ((r_sum * mul_sum) >> shg_sum) * pa;
            pixels[yi+1] = ((g_sum * mul_sum) >> shg_sum) * pa;
            pixels[yi+2] = ((b_sum * mul_sum) >> shg_sum) * pa;
          } else {
            pixels[yi] = pixels[yi+1] = pixels[yi+2] = 0;
          }

          r_sum -= r_out_sum;
          g_sum -= g_out_sum;
          b_sum -= b_out_sum;
          a_sum -= a_out_sum;

          r_out_sum -= stackIn.r;
          g_out_sum -= stackIn.g;
          b_out_sum -= stackIn.b;
          a_out_sum -= stackIn.a;

          p =  (yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1)) << 2;

          r_in_sum += (stackIn.r = pixels[p]);
          g_in_sum += (stackIn.g = pixels[p+1]);
          b_in_sum += (stackIn.b = pixels[p+2]);
          a_in_sum += (stackIn.a = pixels[p+3]);

          r_sum += r_in_sum;
          g_sum += g_in_sum;
          b_sum += b_in_sum;
          a_sum += a_in_sum;

          stackIn = stackIn.next;

          r_out_sum += (pr = stackOut.r);
          g_out_sum += (pg = stackOut.g);
          b_out_sum += (pb = stackOut.b);
          a_out_sum += (pa = stackOut.a);

          r_in_sum -= pr;
          g_in_sum -= pg;
          b_in_sum -= pb;
          a_in_sum -= pa;

          stackOut = stackOut.next;

          yi += 4;
        }
        yw += width;
      }


      for (let x = 0; x < width; x++) {
        g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;

        yi = x << 2;
        r_out_sum = radiusPlus1 * (pr = pixels[yi]);
        g_out_sum = radiusPlus1 * (pg = pixels[yi+1]);
        b_out_sum = radiusPlus1 * (pb = pixels[yi+2]);
        a_out_sum = radiusPlus1 * (pa = pixels[yi+3]);

        r_sum += sumFactor * pr;
        g_sum += sumFactor * pg;
        b_sum += sumFactor * pb;
        a_sum += sumFactor * pa;

        stack = stackStart;

        for(let i = 0; i < radiusPlus1; i++) {
          stack.r = pr;
          stack.g = pg;
          stack.b = pb;
          stack.a = pa;
          stack = stack.next;
        }

        yp = width;

        for(let i = 1; i <= radius; i++) {
          yi = (yp + x) << 2;

          r_sum += (stack.r = (pr = pixels[yi])) * (rbs = radiusPlus1 - i);
          g_sum += (stack.g = (pg = pixels[yi+1])) * rbs;
          b_sum += (stack.b = (pb = pixels[yi+2])) * rbs;
          a_sum += (stack.a = (pa = pixels[yi+3])) * rbs;

          r_in_sum += pr;
          g_in_sum += pg;
          b_in_sum += pb;
          a_in_sum += pa;

          stack = stack.next;

          if(i < heightMinus1) yp += width;
        }

        yi = x;
        stackIn = stackStart;
        stackOut = stackEnd;
        for (let y = 0; y < height; y++) {
          p = yi << 2;
          pixels[p+3] = pa = (a_sum * mul_sum) >> shg_sum;
          if (pa > 0) {
            pa = 255 / pa;
            pixels[p]   = ((r_sum * mul_sum) >> shg_sum) * pa;
            pixels[p+1] = ((g_sum * mul_sum) >> shg_sum) * pa;
            pixels[p+2] = ((b_sum * mul_sum) >> shg_sum) * pa;
          } else {
            pixels[p] = pixels[p+1] = pixels[p+2] = 0;
          }

          r_sum -= r_out_sum;
          g_sum -= g_out_sum;
          b_sum -= b_out_sum;
          a_sum -= a_out_sum;

          r_out_sum -= stackIn.r;
          g_out_sum -= stackIn.g;
          b_out_sum -= stackIn.b;
          a_out_sum -= stackIn.a;

          p = (x + (((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width)) << 2;

          r_sum += (r_in_sum += (stackIn.r = pixels[p]));
          g_sum += (g_in_sum += (stackIn.g = pixels[p+1]));
          b_sum += (b_in_sum += (stackIn.b = pixels[p+2]));
          a_sum += (a_in_sum += (stackIn.a = pixels[p+3]));

          stackIn = stackIn.next;

          r_out_sum += (pr = stackOut.r);
          g_out_sum += (pg = stackOut.g);
          b_out_sum += (pb = stackOut.b);
          a_out_sum += (pa = stackOut.a);

          r_in_sum -= pr;
          g_in_sum -= pg;
          b_in_sum -= pb;
          a_in_sum -= pa;

          stackOut = stackOut.next;

          yi += width;
        }
      }
      context.putImageData(imageData, top_x, top_y);
    };

    let stackBlurCanvasRGB = function (context, top_x, top_y, width, height, radius) {
      if (isNaN(radius) || radius < 1) return;
      radius |= 0;

      let imageData;

      try {
        try {
          imageData = context.getImageData(top_x, top_y, width, height);
        } catch(e) {

          // NOTE: this part is supposedly only needed if you want to work with local files
          // so it might be okay to remove the whole try/catch block and just use
          // imageData = context.getImageData(top_x, top_y, width, height);
          try {
            netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
            imageData = context.getImageData(top_x, top_y, width, height);
          } catch(e) {
            console.log("Cannot access local image");
            throw new Error("unable to access local image data: " + e);
          }
        }
      } catch(e) {
        console.log("Cannot access image");
        throw new Error("unable to access image data: " + e);
      }

      let pixels = imageData.data;

      let x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum,
        r_out_sum, g_out_sum, b_out_sum,
        r_in_sum, g_in_sum, b_in_sum,
        pr, pg, pb, rbs;

      let div = radius + radius + 1;
      let w4 = width << 2;
      let widthMinus1  = width - 1;
      let heightMinus1 = height - 1;
      let radiusPlus1  = radius + 1;
      let sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;

      let stackStart = new BlurStack();
      let stackEnd;
      let stack = stackStart;
      for (i = 1; i < div; i++) {
        stack = stack.next = new BlurStack();
        if (i == radiusPlus1) stackEnd = stack;
      }
      stack.next = stackStart;
      let stackIn = null;
      let stackOut = null;

      yw = yi = 0;

      let mul_sum = mul_table[radius];
      let shg_sum = shg_table[radius];

      for (let y = 0; y < height; y++) {
        r_in_sum = g_in_sum = b_in_sum = r_sum = g_sum = b_sum = 0;

        r_out_sum = radiusPlus1 * (pr = pixels[yi]);
        g_out_sum = radiusPlus1 * (pg = pixels[yi+1]);
        b_out_sum = radiusPlus1 * (pb = pixels[yi+2]);

        r_sum += sumFactor * pr;
        g_sum += sumFactor * pg;
        b_sum += sumFactor * pb;

        stack = stackStart;

        for(let i = 0; i < radiusPlus1; i++) {
          stack.r = pr;
          stack.g = pg;
          stack.b = pb;
          stack = stack.next;
        }

        for(let i = 1; i < radiusPlus1; i++) {
          p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
          r_sum += (stack.r = (pr = pixels[p])) * (rbs = radiusPlus1 - i);
          g_sum += (stack.g = (pg = pixels[p+1])) * rbs;
          b_sum += (stack.b = (pb = pixels[p+2])) * rbs;

          r_in_sum += pr;
          g_in_sum += pg;
          b_in_sum += pb;

          stack = stack.next;
        }


        stackIn = stackStart;
        stackOut = stackEnd;
        for (x = 0; x < width; x++) {
          pixels[yi]   = (r_sum * mul_sum) >> shg_sum;
          pixels[yi+1] = (g_sum * mul_sum) >> shg_sum;
          pixels[yi+2] = (b_sum * mul_sum) >> shg_sum;

          r_sum -= r_out_sum;
          g_sum -= g_out_sum;
          b_sum -= b_out_sum;

          r_out_sum -= stackIn.r;
          g_out_sum -= stackIn.g;
          b_out_sum -= stackIn.b;

          p =  (yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1)) << 2;

          r_in_sum += (stackIn.r = pixels[p]);
          g_in_sum += (stackIn.g = pixels[p+1]);
          b_in_sum += (stackIn.b = pixels[p+2]);

          r_sum += r_in_sum;
          g_sum += g_in_sum;
          b_sum += b_in_sum;

          stackIn = stackIn.next;

          r_out_sum += (pr = stackOut.r);
          g_out_sum += (pg = stackOut.g);
          b_out_sum += (pb = stackOut.b);

          r_in_sum -= pr;
          g_in_sum -= pg;
          b_in_sum -= pb;

          stackOut = stackOut.next;

          yi += 4;
        }
        yw += width;
      }


      for (x = 0; x < width; x++) {
        g_in_sum = b_in_sum = r_in_sum = g_sum = b_sum = r_sum = 0;

        yi = x << 2;
        r_out_sum = radiusPlus1 * (pr = pixels[yi]);
        g_out_sum = radiusPlus1 * (pg = pixels[yi+1]);
        b_out_sum = radiusPlus1 * (pb = pixels[yi+2]);

        r_sum += sumFactor * pr;
        g_sum += sumFactor * pg;
        b_sum += sumFactor * pb;

        stack = stackStart;

        for(let i = 0; i < radiusPlus1; i++) {
          stack.r = pr;
          stack.g = pg;
          stack.b = pb;
          stack = stack.next;
        }

        yp = width;

        for(let i = 1; i <= radius; i++) {
          yi = (yp + x) << 2;

          r_sum += (stack.r = (pr = pixels[yi])) * (rbs = radiusPlus1 - i);
          g_sum += (stack.g = (pg = pixels[yi+1])) * rbs;
          b_sum += (stack.b = (pb = pixels[yi+2])) * rbs;

          r_in_sum += pr;
          g_in_sum += pg;
          b_in_sum += pb;

          stack = stack.next;

          if(i < heightMinus1)
          {
            yp += width;
          }
        }

        yi = x;
        stackIn = stackStart;
        stackOut = stackEnd;
        for (y = 0; y < height; y++) {
          p = yi << 2;
          pixels[p]   = (r_sum * mul_sum) >> shg_sum;
          pixels[p+1] = (g_sum * mul_sum) >> shg_sum;
          pixels[p+2] = (b_sum * mul_sum) >> shg_sum;

          r_sum -= r_out_sum;
          g_sum -= g_out_sum;
          b_sum -= b_out_sum;

          r_out_sum -= stackIn.r;
          g_out_sum -= stackIn.g;
          b_out_sum -= stackIn.b;

          p = (x + (((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width)) << 2;

          r_sum += (r_in_sum += (stackIn.r = pixels[p]));
          g_sum += (g_in_sum += (stackIn.g = pixels[p+1]));
          b_sum += (b_in_sum += (stackIn.b = pixels[p+2]));

          stackIn = stackIn.next;

          r_out_sum += (pr = stackOut.r);
          g_out_sum += (pg = stackOut.g);
          b_out_sum += (pb = stackOut.b);

          r_in_sum -= pr;
          g_in_sum -= pg;
          b_in_sum -= pb;

          stackOut = stackOut.next;

          yi += width;
        }
      }
      context.putImageData(imageData, top_x, top_y);
    };

    let context = this._ctx;

    if (blurAlphaChannel)
      stackBlurCanvasRGBA(context, 0, 0, this.width, this.height, radius);
    else
      stackBlurCanvasRGB(context, 0, 0, this.width, this.height, radius);
  }

}

Bitmap.eventManager = new Svent.EventManager();

module.exports = Bitmap;