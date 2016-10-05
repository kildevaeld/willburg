"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const Debug = require('debug');
const metadata_1 = require('../metadata');
const debug = Debug('willburg:tasks:runner');
class Runner {
    constructor(fns, remove = false) {
        this.fns = fns;
        this.remove = remove;
        this.name = "Runner";
    }
    run(app) {
        return __awaiter(this, void 0, Promise, function* () {
            for (let i = 0, ii = this.fns.length; i < ii; i++) {
                let fn = this.fns[i];
                if (!fn)
                    continue;
                debug('running %s', fn.name);
                let ret = app.container.get(fn);
                if (ret && metadata_1.isService(fn, metadata_1.ServiceTypes.Task)) {
                    app.boot.pushFront(ret);
                }
                if (this.remove) {
                    app.container.unregister(fn);
                }
            }
        });
    }
}
exports.Runner = Runner;
