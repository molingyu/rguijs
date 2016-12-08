/**
 * Created by shitake on 16-12-7.
 */
import Svent from 'svent'

/**
 * Class EventManger.
 * @author shitake <z1522716486@hotmail.com>
 * @license MIT <https://mit-license.org/>
 */
class EventManger extends Svent.EventManger {
  constructor(obj) {
    super();
    this.obj = obj;
    this.keyboardEvent = []
  }

  update() {
    super.update();
    if(this.obj.status && this.obj.visible) {
      this.mouseUpdate();
      this.keyboardEvent.forEach((o)=>{
        keyboardUpdate(o)
      })
    }
  }

  mouseUpdate() {

  }

  keyboardUpdate(event) {

  }

}

export default EventManger