"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const fs = require('mz/fs');
const Path = require('path');
function requireDir(path, iterator) {
    return __awaiter(this, void 0, Promise, function* () {
        if (!Path.isAbsolute(path)) {
            path = Path.resolve(path);
        }
        let files = yield fs.readdir(path);
        files.sort();
        for (let i = 0, ii = files.length; i < ii; i++) {
            let fp = Path.join(path, files[i]);
            let mod = require(fp);
            yield iterator(mod, fp);
        }
    });
}
exports.requireDir = requireDir;
function runTasks() {
    return __awaiter(this, void 0, Promise, function* () {
    });
}
exports.runTasks = runTasks;
