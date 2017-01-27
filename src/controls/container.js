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
    this.pos = {x: Input.x, y: Input.y};
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
    let self = this;
    controls.forEach((control)=>{
      //TODO Maybe we have better method.
      if(!control.penetration) alias(control.eventManager, 'mouseUpdate', 'mouseUpdateHook', ()=>{});
      self.controls.add(control);
      self.addChild(control)
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

  update() {
    this.controls.forEach((o)=>{ o.update() });
    if(this.pos.x != Input.x && this.pos.x != Input.y && this.box.hit(Input.x, Input.y)) {
      let top;
      this.controls.forEach((control)=>{ if(control.box.hit(Input.x, Input.y)) top = control });
      if(top) {
        if(!top.eventManager.mouseFocus) {
          top.eventManager.trigger('mouseIn', {x: Input.x, y: Input.y});
          top.eventManager.mouseFocus = true;
        }
        if(Input.mouseScroll != 0) {
          top.eventManager.trigger('mouseScroll', {scrollValue: Input.mouseScroll})
        }
      }
      if(this.top && this.top != top) this.top.eventManager.trigger('mouseOut', {x: Input.x, y: Input.y});
      this.top = top;
      this.pos.x = Input.x;
      this.pos.y = Input.y
    }
  }

  defEventCallback() {
    let self = this;
    this.eventManager.on('mouseOut', {}, (self, info)=>{
      if(self.top) {
        self.top.eventManager.trigger('mouseOut', {x: info.x, y: info.y});
        self.top = null
      }
    })
  }
}

module.exports = Container;