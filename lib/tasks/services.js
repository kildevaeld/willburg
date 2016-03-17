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
var debug = Debug('willburg:tasks:directory');
class Directory {
    constructor() {
        this.name = "Services";

        for (var _len = arguments.length, paths = Array(_len), _key = 0; _key < _len; _key++) {
            paths[_key] = arguments[_key];
        }

        this.paths = paths;
    }
    run(app) {
        return __awaiter(this, void 0, Promise, function* () {
            var _this = this;

            for (var i = 0, ii = this.paths.length; i < ii; i++) {
                try {
                    var found = yield utils_1.processDirectory(this.paths[i], function (mod, path) {
                        return __awaiter(_this, void 0, void 0, function* () {
                            if (metadata_1.isService(mod)) {
                                app.register(mod);
                            }
                        });
                    });
                } catch (e) {
                    if (e.code == 'ENOENT') {
                        debug('path %s doest not exists: %s', this.paths[i], e);
                        continue;
                    }
                    debug("Error %s", e);
                    throw e;
                }
            }
            return;
        });
    }
}
exports.Directory = Directory;