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
var metadata_1 = require('../metadata');
var debug = Debug('willburg:tasks:services');
class Services {
    run(app) {
        return __awaiter(this, void 0, Promise, function* () {
            var _this = this;

            var path = app.settings.paths.services || "services";
            try {
                yield utils_1.requireDir(path, function (mod, path) {
                    return __awaiter(_this, void 0, Promise, function* () {
                        if (typeof mod === 'function') {
                            if (!metadata_1.isService(mod, metadata_1.ServiceTypes.Service)) {
                                return debug('Not a Service');
                            }
                            app.register(mod);
                        } else {
                            for (var key in mod) {
                                var m = mod[key];
                                if (!metadata_1.isService(m, metadata_1.ServiceTypes.Service)) {
                                    return debug('not a service');
                                }
                                app.register(m);
                            }
                        }
                    });
                });
            } catch (e) {
                debug('path %s doest not exists: %s', path, e);
            }
        });
    }
}
exports.Services = Services;