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
var utils_1 = require('../utils');
var Debug = require('debug');
var debug = Debug('willburg:tasks:initializers');
class Initializers {
    constructor() {
        this.name = "Initializers";
    }
    run(app) {
        return __awaiter(this, void 0, Promise, function* () {
            var _this = this;

            var path = app.settings.paths.initializers || "initializers";
            try {
                yield utils_1.requireDir(path, function (mod, path) {
                    return __awaiter(_this, void 0, Promise, function* () {
                        if (typeof mod === 'function') {
                            debug('running initializer %s', path);
                            yield mod(app);
                        } else {
                            for (var k in mod) {
                                if (typeof mod[k] === 'function') {
                                    yield mod[k](app);
                                }
                            }
                        }
                    });
                });
            } catch (e) {
                if (e.code == 'ENOENT') {
                    debug('path %s doest not exists: %s', path, e);
                    return;
                }
                throw e;
            }
        });
    }
}
exports.Initializers = Initializers;