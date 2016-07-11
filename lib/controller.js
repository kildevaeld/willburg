"use strict";

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator.throw(value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
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
        return __awaiter(this, void 0, void 0, function* () {
            this.emit('before:action', action);
            if (this._stack.length > 0) {
                var i = this._stack.length;
                while (i--) {
                    yield this._stack[i].call(this, ctx, next);
                }
            }
            var ret = this[action](ctx, next);
            this.emit('action', action);
            return ret;
        });
    }
}
Controller.isController = true;
exports.Controller = Controller;