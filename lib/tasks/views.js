"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const Debug = require("debug");
const metadata_1 = require("../metadata");
const debug = Debug('willburg:tasks:views');
class Views {
    constructor() {
        this.name = "Views";
    }
    run(app) {
        return __awaiter(this, void 0, void 0, function* () {
            let path = app.settings.paths.views || "views";
            path = path_1.resolve(path);
            let con = app.container;
            if (!con.hasHandler(metadata_1.Variables.ViewRoot)) {
                app.container.registerInstance(metadata_1.Variables.ViewRoot, path);
            }
            if (!con.hasHandler(metadata_1.Variables.ViewEngine)) {
                app.container.registerInstance(metadata_1.Variables.ViewEngine, 'html');
            }
            debug("view root: %s", con.get(metadata_1.Variables.ViewRoot));
            debug("view engine: %s", con.get(metadata_1.Variables.ViewEngine));
        });
    }
}
exports.Views = Views;
