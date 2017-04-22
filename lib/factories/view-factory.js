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
const stick_di_1 = require("stick.di");
const metadata_1 = require("../metadata");
const Path = require("path");
const fs = require("mz/fs");
const container_1 = require("../container");
const consolidate = require('consolidate');
const toFile = (fileName, ext) => `${fileName}.${ext}`;
function getPaths(abs, rel, ext) {
    return fs.stat(Path.join(abs, rel)).then((stats) => {
        if (stats.isDirectory()) {
            // a directory
            return {
                rel: Path.join(rel, toFile('index', ext)),
                abs: Path.join(abs, Path.dirname(rel), rel)
            };
        }
        // a file
        return {
            rel,
            abs
        };
    })
        .catch((e) => {
        // not a valid file/directory
        if (!Path.extname(rel)) {
            // Template file has been provided without extension
            // so append to it to try another lookup
            return getPaths(abs, `${rel}.${ext}`, ext);
        }
        throw e;
    });
}
function ViewFactory(root, defaultEngine) {
    root = Path.resolve(root);
    return function (path, locals = {}, engine) {
        return __awaiter(this, void 0, void 0, function* () {
            let ext = (Path.extname(path) || '.' + (engine || defaultEngine)).slice(1);
            let { rel, abs } = yield getPaths(root, path, ext);
            let fp = Path.resolve(abs, rel);
            if (ext === 'html') {
                let str = yield fs.readFile(fp, 'utf8');
                return str;
            }
            else {
                engine = ext;
                // Implement engine/ext map
                return yield consolidate[engine](fp, locals);
            }
        });
    };
}
exports.ViewFactory = ViewFactory;
ViewFactory.inject = [metadata_1.Variables.ViewRoot, metadata_1.Variables.ViewEngine];
stick_di_1.factory()(ViewFactory);
container_1.Container.registerTransient(metadata_1.Factories.View, ViewFactory);
