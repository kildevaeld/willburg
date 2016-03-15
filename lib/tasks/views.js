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
var path_1 = require('path');
var Debug = require('debug');
var metadata_1 = require('../metadata');
var debug = Debug('willburg:tasks:views');
class Views {
    run(app) {
        return __awaiter(this, void 0, Promise, function* () {
            var path = app.settings.paths.views || "views";
            path = path_1.resolve(path);
            var con = app.container;
            if (!con.hasHandler(metadata_1.Variables.ViewRoot)) {
                app.container.registerInstance(metadata_1.Variables.ViewRoot, path);
            } else if (!con.hasHandler(metadata_1.Variables.ViewEngine)) {
                app.container.registerInstance(metadata_1.Variables.ViewEngine, 'html');
            }
        });
    }
}
exports.Views = Views;