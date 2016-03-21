"use strict";

var events_1 = require('events');
var compose = require('koa-compose');
class Controller extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this._stack = [];
    }
    use() {
        var _stack;

        (_stack = this._stack).push.apply(_stack, arguments);
        return this;
    }
    handleRequest(action, ctx, next) {
        var _this = this;

        this.emit('before:action', action);
        if (this._stack.length > 0) {
            return compose(this._stack)(ctx, next).then(function () {
                return _this[action].call(_this, ctx, next);
            });
        }
        var ret = this[action](ctx, next);
        this.emit('action', action);
        return ret;
    }
}
Controller.isController = true;
exports.Controller = Controller;