const fs = require('fs');
const RGUI = require('./rgui');
const Bitmap = require('./display/bitmap');

const LoadManager = {
  loadImage: function (str, i18n) {
    let url;
    if(i18n) {
      if (fs.existsSync(str + RGUI.lang + '.png')) {
        url = str + RGUI.lang + '.png'
      } else if (fs.existsSync(str + RGUI.defaultLang + '.png')) {
        url = str + RGUI.defaultLang + '.png'
      } else {
        RGUI.eventManager.trigger('imageLoadError', {url: str, i18n: i18n});
      }
    } else {
      url = str + '.png';
      if(!fs.existsSync(url)) {
        RGUI.eventManager.trigger('imageLoadError', {url: str, i18n: i18n});
        return new Bitmap(32, 32)
      }
    }
    return new Bitmap.load(url)
  }
};

module.exports = LoadManager;