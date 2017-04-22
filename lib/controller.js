"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    handleRequest(action, ctx, middlewares, next) {
        this.emit('before:action', action);
        var fn;
        if ((this._dirty || !this._methods[action]) && (!middlewares || middlewares.length == 0)) {
            debug('composing static action %s:%s', this.constructor.name, action);
            if (this._stack.length) {
                this._methods[action] = fn = compose(this._stack.concat(this[action].bind(this)));
            }
            else {
                this._methods[action] = fn = this[action].bind(this);
            }
            this._dirty = false;
        }
        else if (middlewares && middlewares.length) {
            debug('composing dynamic action %s:%s', this.constructor.name, action);
            let m = this._stack.concat(middlewares).concat(this[action].bind(this));
            fn = compose(m);
        }
        else {
            fn = this._methods[action];
        }
        return Promise.resolve(fn(ctx, next)).then(ret => {
            this.emit('action', action);
            return ret;
        });
    }
}
Controller.isController = true;
exports.Controller = Controller;
