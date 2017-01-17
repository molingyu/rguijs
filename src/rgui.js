const Svent = require('./lib/svent');

/**
 * RPGMaker MV GUI 框架。
 *
 * @module RGUI
 * @namespace RGUI
 * @author shitake <z1522716486@hotmail.com>
 * @license
 *
 * Copyright © 2017 <copyright holders>
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the “Software”), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
const RGUI = {
  Input: require('./input'),
  EventManager: require('./eventManager'),
  Box: require('./box'),
  Display: require('./display'),
  /**
   * RGUI 当前版本。
   *
   * @static
   * @constant
   * @name VERSION
   * @memberof RGUI
   * @type {String}
   */
  VERSION: '0.1.0',
  /**
   * 是否支持鼠标。
   *
   * @name MOUSE
   * @memberof RGUI
   * @type {Boolean}
   */
  MOUSE: true,
  /**
   * 是否支持键盘。
   *
   * @name KEYBOARD
   * @memberof RGUI
   * @type {Boolean}
   */
  KEYBOARD: true,
  /**
   * 已加载控件数。
   *
   * @name Controls
   * @memberof RGUI
   * @type {Number}
   */
  Controls: 0,
  /**
   * 工作目录。
   *
   * @name dirname
   * @memberof RGUI
   * @type {String}
   */
  dirname: require('electron').remote.getGlobal('dir'),
  /**
   * 初始化 RGUI 模块。
   * @memberof RGUI
   */
  init: function () {
    this._ID = 0;
    this._langDir = [this.dirname + '/lang'];
    this._defaultLang = 'zh_cn';
    this._lang = 'zh_cn';
    this.loadControls();
    this.Input.init();
    this._eventManager = new Svent.EventManager();
    this.seyHello()
  },

  /**
   * 获取控件 ID。
   * @memberof RGUI
   * @returns {Number}
   */
  getID: function () {
    return this._ID++
  },

  /**
   * 将指定值转化到特定区间。
   *
   * @memberof RGUI
   * @param {Number} num 欲判断的值。
   * @param {Number} min 区间的下界。
   * @param {Number} max 区间的上界。
   * @returns {Number}
   */
  boundary: function (num, min, max) {
    return num > min ? num < max ? num : max : min
  },

  /**
   * 输出当前运行的 RGUI 的版本和控件数。
   *
   * @memberof RGUI
   */
  seyHello: function () {
    let args = [
      '\n %c %c %c RGUI ' + this.VERSION +' - ✰ Controls:' + this.Controls +  ' ✰  %c ' + ' %c ' + ' http://github.com/molingyu/rguijs/  %c %c ♥%c♥%c♥ \n\n',
      'background: #ff66a5; padding:5px 0;',
      'background: #ff66a5; padding:5px 0;',
      'color: #ff66a5; background: #030307; padding:5px 0;',
      'background: #ff66a5; padding:5px 0;',
      'background: #ffc3dc; padding:5px 0;',
      'background: #ff66a5; padding:5px 0;',
      'color: #ff2424; background: #fff; padding:5px 0;',
      'color: #ff2424; background: #fff; padding:5px 0;',
      'color: #ff2424; background: #fff; padding:5px 0;'
    ];
    console.log.apply(console, args);
  },

  loadControls: function () {
    this.ImageBox = require('./controls/imageBox');
    // this.Button = require('./controls/Button');
    this.SpriteButton = require('./controls/spriteButton');
    // this.ProgressBar = require('./controls/progressBar');
  }
};

/**
 * 全局事件管理器。
 *
 * @name RGUI.eventManager
 * @type {Svent.EventManager}
 */
Object.defineProperty(RGUI, 'eventManager', {
    get() {
      return this._eventManager
    }
  }
);

/**
 * RGUI 当前语言。
 *
 * @name RGUI.lang
 * @type {String}
 */
Object.defineProperty(RGUI, 'langDir', {
    get() {
      return this._langDir
    }
  }
);

/**
 * RGUI 当前语言。
 *
 * @name RGUI.lang
 * @type {String}
 */
Object.defineProperty(RGUI, 'lang', {
    get() {
      return this._lang
    },
    set(value) {
      value = String(value);
      let old = this._lang;
      this._lang = value;
      this.eventManager.trigger('changeLang', {old: old, new: value})
    }
  }
);

/**
 * RGUI 默认语言。
 *
 * @name RGUI.defaultLang
 * @type {String}
 */
Object.defineProperty(RGUI, 'defaultLang', {
    get() {
      return this._defaultLang
    },
    set(value) {
      value = String(value);
      let old = this._defaultLang;
      this._defaultLang = value;
      this.eventManager.trigger('changeDefaultLang', {old: old, new: value})
    }
  }
);

/**
 * 
 * 
 * @param obj
 * @param functionName
 * @param aliasName
 * @param newFunction
 */
window.alias = function (obj, functionName, aliasName, newFunction) {
  if(arguments.length <= 4) aliasName = `${Date.now()}functionName`;
  obj[aliasName] = obj[functionName];
  newFunction.__aliasName__ = aliasName;
  obj[functionName] = newFunction.bind(obj)
};

/**
 * 
 * 
 * @param obj
 * @param functionName
 */
window.unAlias = function (obj, functionName) {
  obj[functionName] = obj[obj[functionName].__aliasName__];
  obj[obj[functionName].__aliasName__] = null
};

/**
 * i18n 函数。
 *
 * @param {String} str - key。
 * @param {String} flag=RGUI.lang - 语言标志。
 * @returns {String}
 * @private
 */
window._ = function (str, flag = RGUI.lang) {
  let value = null;
  RGUI.langDir.forEach(function (langDir) {
    let i18n;
    try {
      i18n = require(`${langDir}/${flag}/ui`);
    } catch (e) {
      RGUI.eventManager.trigger('langFileError', { lang: flag, langDir: langDir, path:`${langDir}/${flag}/ui` })
    }
    if(i18n && i18n[str] != void 0) {
      value = i18n[str]
    }
  });
  if(value == null) {
    RGUI.langDir.forEach((langDir) => {
      try {
        value = require(`${langDir}/${RGUI.defaultLang}/ui`)[str]
      } catch (e) {
        let info = {lang: flag, langDir: langDir, path: `${langDir}/${RGUI.defaultLang}/ui`};
        RGUI.eventManager.trigger('defaultLangFileError', info)
      }
    });
  }
  return value
};

module.exports = RGUI;