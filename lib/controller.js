"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const events_1 = require('events');
const compose = require('koa-compose');
class Controller extends events_1.EventEmitter {
    constructor(...args) {
        super(...args);
        this._stack = [];
    }
    use(...fns) {
        this._stack.push(...fns);
        return this;
    }
    handleRequest(action, ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            this.emit('before:action', action);
            if (this._stack.length > 0) {
                let i = this._stack.length;
                while (i--) {
                    yield this._stack[i].call(this, ctx, next);
                }
            }
            let ret = this[action](ctx, next);
            this.emit('action', action);
            return ret;
        });
    }
}
Controller.isController = true;
exports.Controller = Controller;
