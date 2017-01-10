const fs = require('fs');
const RGUI = require('./rgui');
const Bitmap = require('./display/bitmap');

const LoadManager = {
  /**
   * 文件加载的目录。
   *
   * @type String
   */
  pathDir: '',
  /**
   * 图片缓存。
   * 
   * @type Map
   */
  cache: new Map(),
  /**
   * 获取欲加载图片的完整路径。会考虑 i18n 和文件是否存在的情况。
   * 
   * @param {String} fileName - 欲加载的文件名。
   * @param {Boolean} i18n - 是否开启本地化。
   * @returns {String} - 完整路径。
   */
  getImagePath: function (fileName, i18n) {
    let path;
    if(i18n) {
      if (fs.existsSync(`${this.pathDir}${fileName}_${RGUI.lang}.png`)) {
        path = `${this.pathDir}${fileName}_${RGUI.lang}.png`
      } else {
        if (fs.existsSync(`${this.pathDir}${fileName}_${RGUI.defaultLang}.png`)) {
          path = `${this.pathDir}${fileName}_${RGUI.defaultLang}.png`
        } else {
          path = ''
        }
      }
    } else {
      path = fs.existsSync(`${this.pathDir}${fileName}.png`) ? `${this.pathDir}${fileName}.png` : ''
    }
    return path
  },

  /**
   * 加载指定图片资源。
   *
   * @param {String} fileName - 欲加载的文件名。
   * @param {Boolean} i18n - 是否开启本地化 。
   * @param {Boolean} isCache - 是否开启缓存。
   * @param {Function} onLoad - Bitmap 加载成功时的回调函数。
   * @param {Function} onError - Bitmap 加载错误时的回调函数。
   * @returns {RGUI.Display.Bitmap}
   */
  loadImage: function (fileName, i18n = false, isCache = true, onLoad = ()=>{}, onError = ()=>{}) {
    let path = this.getImagePath(fileName, i18n);
    if(path == '') {
      RGUI.eventManager.trigger('imageLoadError', {fileName: fileName,path: path, i18n: i18n});
      return new Bitmap(32, 32)
    } else if (isCache){
      if(!this.cacheHas(path)) this.cache.set(path, Bitmap.load(path, onLoad, onError));
      return this.cache.get(path)
    }
    return Bitmap.load(path, onLoad, onError)
  },

  /**
   * 判断该文件是否存在于缓存中。
   *
   * @param {String} path
   * @returns {Boolean}
   */
  cacheHas(path) {
    return this.cache.has(path)
  },
  /**
   * 清除图片资源缓存。可以指定语言选项来清除带有某个语言标记的资源。
   *
   * @param {String} lang - 语言标记。默认为空。
   */
  clear: function (lang = null) {
    if(lang == null) {
      this.cache.clear()
    } else {
      for (let key of this.cache.keys()) {
        key.match(/[^_\s]*_([^_\s][^\s]*)\.png/);
        if($1 == lang) this.cache.delete(key)
      }
    }
  }
};

module.exports = LoadManager;