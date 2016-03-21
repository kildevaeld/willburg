"use strict";

var compose = require('koa-compose');
class Controller {
    constructor() {
        this._stack = [];
    }
    use() {
        var _stack;

        (_stack = this._stack).push.apply(_stack, arguments);
        return this;
    }
    handleRequest(action, ctx, next) {
        var _this = this;

        if (this._stack.length > 0) {
            return compose(this._stack)(ctx, next).then(function () {
                return _this[action].call(_this, ctx, next);
            });
        }
        return this[action](ctx, next);
    }
}
Controller.isController = true;
exports.Controller = Controller;