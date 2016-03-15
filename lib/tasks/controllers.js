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
const metadata_1 = require('../metadata');
const debug = Debug('willburg:tasks:controllers');
class Controllers {
    run(app) {
        return __awaiter(this, void 0, Promise, function* () {
            let path = app.settings.paths.controllers || "controllers";
            try {
                yield utils_1.requireDir(path, (mod, path) => __awaiter(this, void 0, Promise, function* () {
                    if (typeof mod === 'function') {
                    }
                    else {
                        for (let key in mod) {
                            let m = mod[key];
                            if (!metadata_1.isService(m, metadata_1.ServiceTypes.Controller)) {
                                debug('not a controller');
                            }
                            app.register(m);
                        }
                    }
                }));
            }
            catch (e) {
                debug('path %s doest not exists: %s', path, e);
            }
        });
    }
}
exports.Controllers = Controllers;
