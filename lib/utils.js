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
var fs = require('mz/fs');
var Path = require('path');
function requireDir(path, iterator) {
    return __awaiter(this, void 0, Promise, function* () {
        if (!Path.isAbsolute(path)) {
            path = Path.resolve(path);
        }
        var files = yield fs.readdir(path);
        files.sort();
        for (var i = 0, ii = files.length; i < ii; i++) {
            var fp = Path.join(path, files[i]);
            var stat = yield fs.stat(fp);
            if (stat.isDirectory()) {
                yield requireDir(fp, iterator);
                continue;
            }
            var mod = require(fp);
            yield iterator(mod, fp);
        }
    });
}
exports.requireDir = requireDir;
function processDirectory(path, iterator) {
    return __awaiter(this, void 0, Promise, function* () {
        var _this = this;

        var found = 0;
        yield requireDir(path, function (mod, path) {
            return __awaiter(_this, void 0, void 0, function* () {
                if (typeof mod === 'function') {
                    yield iterator(mod, null, path);
                    found++;
                } else {
                    for (var key in mod) {
                        if (typeof mod[key] === 'function') {
                            yield iterator(mod[key], key, path);
                            found++;
                        }
                    }
                }
            });
        });
        return found;
    });
}
exports.processDirectory = processDirectory;
/*export async function processDirectory(app:Willburg, path:string): Promise<number> {
    let found = 0;
    await requireDir(path, async (mod, path) => {
        
        if (typeof mod === 'function') {
            if (isService(mod)) {
                app.register(mod);
                found++;
            }
        } else {
            for (let key in mod) {
                if (typeof mod[key] === 'function' && isService(mod[key])) {
                    app.register(mod[key]);
                    found++
                }
            }
        }
    });
    
    return found;
    
} */
function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}
exports.flatten = flatten;