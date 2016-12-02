"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const middlewares = require("../middlewares");
const Debug = require("debug");
const debug = Debug('willburg:tasks:middlewares');
class Middlewares {
    constructor() {
        this.name = "Middlewares";
    }
    run(app) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let key of ['ErrorHandler', 'Session']) {
                if (key == 'Session' && !app.options.session) {
                    debug('skipping session middleware');
                    continue;
                }
                let opts = app.settings.middlewares[key.toLowerCase()];
                debug('injecting middleware: %s: %j', key.toLowerCase(), opts || {});
                app.use(middlewares[key](opts));
            }
        });
    }
}
exports.Middlewares = Middlewares;
