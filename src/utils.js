/**
 *
 * @namespace RGUI.Utils
 */
const Utils = {
  cutBitmap: function (srcBitmap, width, height, type) {
    let bitmaps = [];
    switch (type) {
      case 0:
        bitmaps = this.cutRow(srcBitmap, width, height);
        break;
      case 1:
        bitmaps = this.cutRank(srcBitmap, width, height);
        break;
      case 2:
        bitmaps = this.cutRowRank(srcBitmap, width, height);
        break;
      case 3:
        bitmaps = this.cutRankRow(srcBitmap, width, height);
        break;
      default:
        throw new Error('Type error')
    }
    return bitmaps;
  },

  cutBitmapConfig: function (srcBitmap, config) {
    let bitmaps = [];
    let length = config.length;
    for (var i = 0; i < length; i++) {
      var bitmap = new Bitmap(config[i][0], config[i][1]);
      bitmap.blt(0, 0, srcBitmap, config[i][0], config[i][1], config[i][2], config[i][3]);
      bitmaps.push(bitmap);
    }
    return bitmaps;
  },

  cut: function (srcBitmap, dx, dy, number, width, height) {
    let bitmaps = [];
    for (var i = 0; i < number; i++) {
      var x = i * dx;
      var y = i * dy;
      var bitmap = new Bitmap(width, height);
      bitmap.blt(srcBitmap, x, y, width, height, 0, 0);
      bitmaps.push(bitmap);
    }
    return bitmaps;
  }
};

module.exports = Utils;

//
// SUtils.cutRow = function(srcBitmap, width, height) {
//   var number = srcBitmap.width / width;
//   var dx = width;
//   var dy = 0;
//   return this.cut(srcBitmap, dx, dy, number, width, height);
// };
//
// SUtils.cutRank = function(srcBitmap, width, height) {
//   var number = srcBitmap.height / height;
//   var dx = 0;
//   var dy = height;
//   return this.cut(srcBitmap, dx, dy, number, width, height);
// };
//
// SUtils.cutRowRank = function(srcBitmap, width, height) {
//   var bitmaps1 = this.cutRow(srcBitmap, width, srcBitmap.height);
//   var bitmaps2 = [];
//   for (var i = 0; i < bitmaps1.length; i++) {
//     bitmaps2 = bitmaps2.concat(this.cutRank(bitmaps1[i], width, height));
//   }
//   return bitmaps2;
// };
//
// SUtils.cutRankRow = function(srcBitmap, width, height) {
//   var bitmaps1 = this.cutRank(srcBitmap, srcBitmap.width, height);
//   var bitmaps2 = [];
//   for (var i = 0; i < bitmaps1.length; i++) {
//     bitmaps2 = bitmaps2.concat(this.cutRow(bitmaps1[i], width, height));
//   }
//   return bitmaps2;
// };