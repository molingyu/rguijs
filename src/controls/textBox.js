const RGUI = require('../rgui');
const Base = require('../base');
const Sprite = require('../display/sprite');
const LoadManager = require('../loadManager');

RGUI.Controls = RGUI.Controls + 1;

class Node {

  constructor(name, value = '') {
    this.name = name;
    this.value = value;
    this.parent = null;
    this.attr = new Map();
    this.child = new Set()
  }

  addAttr(key, value) {
    this.attr.set(key, value)
  }

  addChild(value) {
    value.parent = this;
    this.child.add(value)
  }

  _attr2str() {
    let str = '';
    if(this.attr.size == 1) {
      this.attr.forEach((v, k)=>{ str += `=${v}` })
    } else {
      this.attr.forEach((v, k)=>{ str += typeof(v) == 'number' ? ` ${k}=${v}` : `${k}="${v}"` })
    }
    return str;
  }

  toString() {
    if(this.name != 'text') {
      let body = '';
      this.child.forEach((o)=>{ body += o.toString() });
      if(body == '') {
        return `[${this.name}${this._attr2str()}/]`
      } else {
        return `[${this.name}${this._attr2str()}]${body}[/${this.name}]`
      }
    } else {
      return this.value;
    }

  }

}

class Parser {

  constructor(obj, tags, codeStr) {
    this.obj = obj;
    this.tags = tags;
    this.codeStr = codeStr;
    this.pos = 0;
    this.lines = 1;
    this.list = new Set()
  }

  error(str) {
    let cols = this.pos - this.codeStr.slice(0, this.pos).match(/^.*\n/)[0].length();
    let errorStr = `line ${this.lines} col ${cols}, ${str}\nString: ${this.codeStr.slice(this.pos - 10, this.pos + 10)}`;
    RGUI.eventManager.trigger('TextBoxParseError', {objId: this.obj.uID, errorMessage: errorStr})
  }

  getChr() {
    return this.codeStr[this.pos]
  }

  match(str) {
    return str.indexOf(this.getChr()) >= 0
  }

  skip(str, not = false) {
    while(not ? !this.match(str) : this.match(str)) {
      if(this.getChr() == "\n") this.lines += 1;
      this.pos += 1
    }
  }

  next() {
    this.pos += 1
  }

  number() {
    let index = null;
    if(this.match('123456789')) {
      index = this.pos;
      this.skip('0123456789');
      if(this.match('.')) {
        this.next();
        this.skip('0123456789')
      }
      if (this.match('eE')) {
        this.next();
        this.skip('0123456789+-')
      }
    } else {
      // 错误处理
    }
    return Number(this.codeStr.slice(index, this.pos))
  }

  string() {
    let index = this.pos;
    this.skip('[', true);
    return this.codeStr.slice(index, this.pos)
  }

  name() {
    let index = this.pos;
    this.skip('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_');
    return this.codeStr.slice(index, this.pos)
  }

  value(){
    let value;
    if (this.match('=')) {
      this.next();
      if (this.match('"')) {
        this.next();
        let index = this.pos;
        while(!this.match('"')) { this.next() }
        value = this.codeStr.slice(index, this.pos);
        this.next()
      } else {
        value = this.number();
      }
    }
    this.skip(' ');
    return value
  }

  tagAttr(obj) {
    while(!this.match('/]')) {
      let a = this.name();
      let b = this.value();
      obj.addAttr(a, b)
    }
  }

  tag() {
    this.next();
    let index = this.pos;
    this.skip('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_');
    let name = this.codeStr.slice(index, this.pos);
    let node = new Node(name);
    if(!this.match('/]')) {
      if(this.match(' ')) {
        this.skip(' ');
        this.tagAttr(node)
      } else if(this.match('=')) {
        this.next();
        node.addAttr(name, this.value());
      }
    }
    if(this.match('/')) {
      this.skip('/]')
    } else {
      this.next();
      while(!(this.match('[') && this.codeStr[this.pos + 1] == '/')){
        this.parse(node.child)
      }
      this.pos += node.name.length + 2
    }
    return node
  }

  text() {
    return new Node('text', this.string())
  }

  parse(list) {
    if(this.match('[')) {
      list.add(this.tag())
    } else {
      list.add(this.text())
    }
  }

  run() {
    while(this.pos != this.codeStr.length - 1) {
      this.parse(this.list)
    }
  }

}

class TextBox extends Base {

  constructor(obj) {

  }

}

module.exports = TextBox;