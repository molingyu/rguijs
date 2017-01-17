const Base = require('../base');
const RGUI = require('../rgui');
const Input = RGUI.Input;

RGUI.Controls = RGUI.Controls + 1;

/**
 * 基础容器控件。
 *
 * @memberof RGUI
 * @extends RGUI.Base
 */
class Container extends Base {

  constructor(obj) {
    super(obj);
    this.controls = new Set();
    this.top = null;
    this.create()
  }

  /**
   * 更新函数。原则上每帧调用一次。
   */
  update() {
    super.update();
    this.controls.forEach((control)=>{ control.update() })
  }

  /**
   * 往容器里添加控件。
   * @param {...Control} controls - 欲添加的控件。
   */
  push(...controls) {
      controls.forEach((control)=>{
        //TODO Maybe we have better method.
        if(!control.penetration) alias(control.eventManager, 'mouseUpdate', 'mouseUpdateHook', ()=>{});
        this.controls.add(control)
      })
  }

  /**
   * 从容器里删除指定控件。
   *
   * @param {Control} control - 欲删除的控件。
   */
  remove(control) {
    unAlias(control.eventManager, 'mouseUpdate');
    this.controls.delete(control)
  }

  /**
   * 删除整个容器里的控件。
   */
  clear() {
    this.controls.clear()
  }

  defEventCallback() {
    this.eventManager.on('mouseIn', {}, (self, info)=>{
      let top = null;
      self.controls.forEach((control)=>{ if(control.box.hit(info.x, info.y)) top = control });
      if(top) {
        if(!this.mouseFocus) {
          top.eventManager.trigger('mouseIn',{x: x, y: y});
          top.eventManager.mouseFocus = true;
        }
        if(Input.mouseScroll != 0) {
          top.eventManager.trigger('mouseScroll', {scrollValue: Input.mouseScroll})
        }
      }
      if(self.top && self.top != top) self.top.eventManager.trigger('mouseOut', {x: info.x, y: info.y});
      self.top = top
    });
    this.eventManager.on('mouseOut', {}, (self)=>{
      if(self.top) {
        self.top.eventManager.trigger('mouseOut', {x: info.x, y: info.y});
        self.top = null
      }
    })
  }
}

module.exports = Container;