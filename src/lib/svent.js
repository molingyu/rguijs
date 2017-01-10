/**
 * Svent
 * version 0.0.8
 * @author shitake <z1522716486@hotmail.com>
 * @license MIT <https://mit-license.org/>
 */

/*
 * Fibers
 * version 1.0.15
 * @author laverdet <https://www.npmjs.com/package/fibers>
 * @license MIT <https://mit-license.org/>
 */

var fs = require('fs'), path = require('path');

// Seed random numbers [gh-82]
Math.random();

// Look for binary for this platform
var modPath = path.join(__dirname, 'bin', process.platform+ '-'+ process.arch+ '-'+ process.versions.modules, 'fibers');
try {
  fs.statSync(modPath+ '.node');
} catch (ex) {
  // No binary!
  console.error(
    '## There is an issue with `node-fibers` ##\n'+
    '`'+ modPath+ '.node` is missing.\n\n'+
    'Try running this to fix the issue: '+ process.execPath+ ' '+ __dirname.replace(' ', '\\ ')+ '/build'
  );
  throw new Error('Missing binary. See message above.');
}

// Pull in fibers implementation
const Fiber = require(modPath).Fiber;

/**
 * Class Event.
 * @extends Array
 * @author shitake <z1522716486@hotmail.com>
 * @license MIT <https://mit-license.org/>
 */
class Event extends Array {
  constructor(name, info) {
    super();
    this.name = name;
    this.info = info;
  }
}

/**
 * Class EventCallbackFiber.
 * @author shitake <z1522716486@hotmail.com>
 * @license MIT <https://mit-license.org/>
 */
class EventCallbackFiber {
  constructor(em, name, callback, info) {
    this.objectId = Date.now().toString();
    this.name = name;
    this.info = info;
    this.callback = callback;
    this.alive = true;
    let self = this;
    this.fiber = new Fiber(()=>{
      self.callback(em, self.info);
      self.fiber = null;
      this.alive = false
    });
    if(callback.immediately) {
      em.self = this;
      em.fiberDeep += 1;
      this.next();
      if(em.fiberDeep == 1) em.self = null;
      em.fiberDeep -= 1
    }
  }

  next() {
    if(!this.fiber){
      return console.error(`Fiber(${this.name}) is not alive!`)
    }
    if(this.return) {
      this.fiber = null;
      this.alive = false
    } else {
      this.return = this.fiber.run()
    }
  }
}

/**
 * Class eventManager.
 * @author shitake <z1522716486@hotmail.com>
 * @license MIT <https://mit-license.org/>
 */
class EventManager {
  /**
   * Create a eventManager.
   */
  constructor() {
    this.fiberDeep = 0;
    this.events = new Map();
    this.eventCallbackFibers = [];
    this.eventCallbackFibers.delete = function (obj) {
      this.splice(this.indexOf(obj), 1)
    };
    this.timers = new Map();
    this.counters = new Map();
    this.timerFilters = new Map();
    this.counterfilters = new Map();
  }

  /**
   * Update evnManager.
   */
  update() {
    if(this.eventCallbackFibers.size != 0) {
      this.eventCallbackFibers.forEach(obj => {
        this.self = obj;
        this.fiberDeep += 1;
        obj.next();
        this.fiberDeep -= 1;
        this.self = null;
        if(!obj.alive) this.eventCallbackFibers.delete(obj)
      })
    }
  }

  /**
   * trigger a event.
   * @param {String} name - The event name.
   * @param {Object} info - The event info.
   */
  trigger(name, info = {}) {
    let event = this.events[name];
    if(event) {
      event.map(callback => {
        if(callback.async) {
          this.eventCallbackFibers.push(new EventCallbackFiber(this, name, callback, info))
        } else {
          if(callback.immediately){
            callback(this, info)
          } else {
            let callbackFiber = {
              name: name,
              info: info,
              alive: true,
              callback: callback,
              next: function () {
                callback(this, this.info);
                this.alive = false
              }
            };
            this.eventCallbackFibers.push(callbackFiber)
          }
        }
      })
    }
  }

  /**
   * change event info.
   * @param name - event name.
   * @param key - event info key.
   * @param value event info value.
   */
  eventInfo(name, key, value) {
    let event = this.events[name];
    if(event) {
      event.info = event.info || {};
      event.info[key] = value
    }
  }

  /**
   * Whether to include the specified event.
   * @param name
   * @returns {boolean}
   */
  have(name) {
    return this.events[name] != void 0
  }

  _on(name, conf, callback, immediately) {
    if(name == 'isEventManagerStop'){
      Error("error:The event(isEventManagerStop) can only have one callback.")
    }
    let event = this.events[name] = this.events[name] ? this.events[name] : new Event(name, conf.info);
    callback.immediately = immediately;
    conf.index == void 0 ? event.push(callback) : event[conf.index] = callback
  }

  /**
   * on a async event callback.
   * @param {String} name - The event name.
   * @param {Object} conf - The event callback conf.
   * @param {EventManager~eventCallback} callback - The event callback.
   * @param {Boolean} immediately
   */
  onAsync(name, conf, callback, immediately = false) {
    callback.async = true;
    this._on(name, conf, callback, immediately)
  }

  /**
   * on a event callback.
   * @param {String} name - The event name.
   * @param {Object} conf - The event callback conf.
   * @param {EventManager~eventCallback} callback - The event callback.
   * @param {Boolean} immediately
   */
  on(name, conf, callback, immediately = false) {
    callback.async = false;
    this._on(name, conf, callback, immediately)
  }
  /**
   * This eventCallback is added a event event.
   * @callback eventManager~eventCallback
   * @param {EventManager} eventManager
   * @param {Object} callback info.
   */

  /**
   * Stop eventManager.
   */
  stop() {
    this.trigger('eventManagerStop');
    this.trigger('isEventManagerStop')
  }

  /**
   * Determines whether the eventManager is stopped.
   */
  isStop() {
    return this.eventCallbackFibers.length == 1 && this.eventCallbackFibers[0].name == 'isEventManagerStop'
  }

  // helper function

  /**
   * kill the designated event callback.
   * @param {String|RegExp} name - The event name. It can be a regexp(exact match).
   */
  killEventCallback(name) {
    if(typeof name == "string") {
      this.eventCallbackFibers.forEach((obj)=>{
        if(obj.name == name) this.eventCallbackFibers.delete(obj)
      })
    } else {
      this.eventCallbackFibers.forEach((obj)=>{
        if(obj.name.match(name) == obj.name) this.eventCallbackFibers.delete(obj)
      })
    }
  }

  /**
   * if the event callback is running, it returns true.
   * @param {String|RegExp} name - The event name. It can be a regexp(exact match).
   * @returns {boolean}
   */
  isEventCallbackRun(name) {
    let back = false;
    if(typeof name == "string") {
      this.eventCallbackFibers.forEach((obj)=>{if(obj.name == name) return back = true})
    } else {
      this.eventCallbackFibers.forEach((obj)=>{if(obj.name.match(name) == obj.name) return back = true})
    }
    return back
  }

  /**
   * Helper methods.<br>
   * Delete this callback.
   */
  delete() {
    this.afterDelete();
    Fiber.yield(true)
  }

  /**
   * Helper methods.<br>
   * Delete this callback.
   */
  afterDelete() {
    let event = this.events[this.self.name];
    let index = event.indexOf(this.self.callback);
    event.splice(index, 1)
  }

  /**
   * Helper methods.<br>
   * isOk.
   * @param {EventManager~isOkCallback} callback
   */
  isOk(callback) {
    while(true){
      if(callback()) break;
      Fiber.yield()
    }
  }
  /**
   * This isOkCallback is added a event event.
   * @callback eventManager~isOkCallback
   * @return {Boolean} The callback function executes the result.
   */

  /**
   * Helper methods.<br>
   * @param {EventManager~filterCallback} callback
   */
  filter(callback) {
    if(!callback()) Fiber.yield(true)
  }
  /**
   * This filterCallback is added a event event.
   * @callback eventManager~filterCallback
   * @return {Boolean} The callback function executes the result.
   */


  /**
   * Helper methods.<br>
   * @param {Number} value - sec.
   */
  wait(value) {
    if(this.timers[this.self.objectId] == void 0) this.timers[this.self.objectId] = Date.now();
    while(true) {
      if(Date.now() - this.timers[this.self.objectId] > value * 1000) break;
      Fiber.yield()
    }
    this.timers.delete(this.self.objectId)
  }

  /**
   * Helper methods.<br>
   * @param {Number} value - times.
   */
  times(value) {
    if (this.counters[this.self.name]) {
      this.counters[this.self.name] += 1;
    } else {
      this.counters[this.self.name] = 1;
    }
    while(true) {
      if(this.counters[this.self.name] >= value) {
        this.counters[this.self.name] = 0;
        break
      }
      Fiber.yield()
    }
  }

  /**
   * Helper methods.<br>
   * @param {Number} value - sec.
   */
  waitFilter(value) {
    if(!this.timerFilters[this.self.name]) this.timerFilters[this.self.name] = Date.now();
    while(true){
      if(Date.now() - this.timerFilters[this.self.name] > value * 1000) {
        this.timerFilters[this.self.name] = Date.now();
        break
      }
      Fiber.yield(true)
    }
  }

  /**
   * Helper methods.<br>
   * @param {Number} value - times.
   */
  timesFilter(value) {
    if( this.counterfilters[this.self.name]) {
      this.counterfilters[this.self.name] += 1
    } else {
      return this.counterfilters[this.self.name] = 1
    }
    while(true) {
      if( this.counterfilters[this.self.name] > value) {
        this.counterfilters[this.self.name] = 0;
        break
      }
      Fiber.yield(true)
    }
  }
}

/**
 * @module Svent
 */
const Svent = {
  VERSION: '0.0.8',
  EventManager: EventManager,
  /**
   * @method run
   * @description Run a Svent server.
   * @param {EventManager} eventManager a eventManager object.
   * @param {Function} func callback func.
   */
  run: function (eventManager, func) {
    this.eventManager = eventManager || new this.EventManager();
    this.isStop = false;
    func(this.eventManager);
    while(!this.isStop) {
      this.eventManager.update()
    }
  },
  /**
   * @method stop
   * @description Stop Svent server.
   */
  stop: function () {
    this.eventManager.onAsync('isEventManagerStop', {}, (em)=>{
      em.isOk(()=>{ return em.isStop() });
      this.isStop = true
    });
    this.eventManager.stop()
  },
  /**
   * @method kill
   * @description Kill Svent server.
   */
  kill: function () {
    this.isStop = true
  },
};

module.exports = Svent;