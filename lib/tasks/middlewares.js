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
var middlewares = require('../middlewares');
var Debug = require('debug');
var debug = Debug('willburg:tasks:middlewares');
class Middlewares {
    constructor() {
        this.name = "Middlewares";
    }
    run(app) {
        return __awaiter(this, void 0, Promise, function* () {
            var _arr = ['ErrorHandler', 'Session'];

            for (var _i = 0; _i < _arr.length; _i++) {
                var key = _arr[_i];
                var opts = app.settings.middlewares[key.toLowerCase()];
                debug('injecting middleware: %s: %j', key.toLowerCase(), opts);
                app.use(middlewares[key](opts));
            }
        });
    }
}
exports.Middlewares = Middlewares;