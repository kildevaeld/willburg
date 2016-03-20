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
var Debug = require('debug');
var debug = Debug('willburg:tasks:initializers');
var etag = require('koa-etag');
var conditional = require('koa-conditional-get');
var convert = require('koa-convert');
class Caching {
    constructor() {
        this.name = "Caching";
    }
    run(app) {
        return __awaiter(this, void 0, Promise, function* () {
            if (app.env !== 'development') {
                app.use(convert(conditional()));
                app.use(etag());
            }
        });
    }
}
exports.Caching = Caching;