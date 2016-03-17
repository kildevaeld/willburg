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
var Debug = require('debug');
var metadata_1 = require('../metadata');
var debug = Debug('willburg:tasks:runner');
class Runner {
    constructor(fns) {
        var remove = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

        this.fns = fns;
        this.remove = remove;
        this.name = "Runner";
    }
    run(app) {
        return __awaiter(this, void 0, Promise, function* () {
            for (var i = 0, ii = this.fns.length; i < ii; i++) {
                var fn = this.fns[i];
                if (!fn) continue;
                debug('running %s', fn.name);
                var ret = app.container.get(fn);
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