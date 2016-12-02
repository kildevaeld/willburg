"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const Debug = require("debug");
const assert = require("assert");
const send = require('koa-send');
const debug = Debug('willburg:middleware:static');
function Static(root, options = {}) {
    let opts = Object.assign({
        hidden: false,
        index: 'index.html',
        defer: true,
        gzip: false
    }, options);
    if (typeof root === 'string')
        root = [root];
    let paths = root;
    let handler;
    let len = paths.length;
    assert(Array.isArray(root) && len !== 0, "Root required");
    debug('static "%s" %j', root, opts);
    if (!opts.defer) {
        handler = function (ctx, next) {
            return __awaiter(this, void 0, void 0, function* () {
                if (ctx.method === 'HEAD' || ctx.method === 'GET') {
                    for (let i = 0; i < len; i++) {
                        opts.root = paths[i];
                        let ret = yield send(ctx, ctx.path, opts);
                        if (ret != null) {
                            debug('file sent: %s', ret);
                            return;
                        }
                    }
                }
                return next();
            });
        };
    }
    else {
        handler = function (ctx, next) {
            return __awaiter(this, void 0, void 0, function* () {
                yield next();
                if (ctx.method != 'HEAD' && ctx.method != 'GET')
                    return;
                // response is already handled
                if (ctx.body != null || ctx.status != 404)
                    return;
                for (let i = 0; i < len; i++) {
                    opts.root = paths[i];
                    let ret = yield send(ctx, ctx.path, opts);
                    if (ret != null) {
                        debug('file sent: %s', ret);
                        return;
                    }
                }
            });
        };
    }
    return handler;
}
exports.Static = Static;
