"use strict";
const events_1 = require("events");
const Debug = require("debug");
const debug = Debug('willburg:controller');
const compose = require('koa-compose');
class Controller extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this._stack = [];
        this._methods = {};
        this._dirty = true;
    }
    use(...fns) {
        this._stack.push(...fns.map(m => m.bind(this)));
        this._dirty = true;
        return this;
    }
    handleRequest(action, ctx, next) {
        this.emit('before:action', action);
        if (this._dirty || !this._methods[action]) {
            debug('composing action %s:%s', this.constructor.name, action);
            if (this._stack.length) {
                this._methods[action] = compose(this._stack.concat(this[action].bind(this)));
            }
            else {
                this._methods[action] = this[action].bind(this);
            }
            this._dirty = false;
        }
        return Promise.resolve(this._methods[action](ctx, next)).then(ret => {
            this.emit('action', action);
            return ret;
        });
    }
}
exports.Controller = Controller;
Controller.isController = true;
