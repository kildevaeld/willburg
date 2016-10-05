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
const debug = Debug('willburg:tasks:directory');
class Directory {
    constructor(...paths) {
        this.name = "Services";
        this.paths = paths;
    }
    run(app) {
        return __awaiter(this, void 0, Promise, function* () {
            for (let i = 0, ii = this.paths.length; i < ii; i++) {
                debug('loading directory: %s', this.paths[i]);
                try {
                    let found = yield utils_1.processDirectory(this.paths[i], (mod, name, path) => __awaiter(this, void 0, void 0, function* () {
                        if (metadata_1.isService(mod)) {
                            app.register(mod);
                        }
                    }));
                }
                catch (e) {
                    if (e.code == 'ENOENT') {
                        debug('path %s doest not exists: %s', this.paths[i], e);
                        continue;
                    }
                    debug("Error %s in %s", e, e.path, this.paths[i]);
                    throw e;
                }
            }
            return;
        });
    }
}
exports.Directory = Directory;
