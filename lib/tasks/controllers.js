"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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
var metadata_1 = require('../metadata');
var debug = Debug('willburg:tasks:controllers');
class Controllers {
    constructor() {
        this.name = 'Controllers';
    }
    run(app) {
        return __awaiter(this, void 0, Promise, function* () {
            var _this = this;

            var path = app.settings.paths.controllers || "controllers";
            this.path = path;
            try {
                yield utils_1.requireDir(path, function (mod, path) {
                    return __awaiter(_this, void 0, Promise, function* () {
                        if (typeof mod === 'function') {
                            if (!metadata_1.isService(mod, metadata_1.ServiceTypes.Controller)) {
                                return debug('Not a controller');
                            }
                            app.register(mod);
                            debug('register controller %s', mod.name);
                        } else {
                            for (var key in mod) {
                                var m = mod[key];
                                if ((typeof m === 'undefined' ? 'undefined' : _typeof(m)) === 'symbol') continue;
                                if (!metadata_1.isService(m, metadata_1.ServiceTypes.Controller)) {
                                    return debug('not a controller');
                                }
                                app.register(m);
                                debug('register controller %s', m.name);
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
    toString() {
        return '[Controllers path: ' + this.path + ']';
    }
}
exports.Controllers = Controllers;