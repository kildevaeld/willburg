"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const utils_1 = require('../utils');
const Debug = require('debug');
const debug = Debug('willburg:tasks:routes');
class Routes {
    run(app) {
        return __awaiter(this, void 0, Promise, function* () {
            let path = app.settings.paths.routes || "routes";
            try {
                yield utils_1.requireDir(path, (mod, path) => __awaiter(this, void 0, Promise, function* () {
                    if (typeof mod === 'function') {
                        yield mod(app);
                    }
                    else {
                        for (let k in mod) {
                            if (typeof mod[k] === 'function') {
                                yield mod[k](app.router, app);
                            }
                        }
                    }
                }));
            }
            catch (e) {
                debug('path %s doest not exists', path);
            }
        });
    }
}
exports.Routes = Routes;
