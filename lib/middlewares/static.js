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
var assert = require('assert');
var send = require('koa-send');
var debug = Debug('willburg:middleware:static');
function Static(root) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var opts = Object.assign({
        hidden: false,
        index: 'index.html',
        defer: true,
        gzip: false
    }, options);
    if (typeof root === 'string') root = [root];
    var paths = root;
    var handler = void 0;
    var len = paths.length;
    assert(Array.isArray(root) && len !== 0, "Root required");
    debug('static "%s" %j', root, opts);
    if (!opts.defer) {
        handler = function handler(ctx, next) {
            return __awaiter(this, void 0, Promise, function* () {
                if (ctx.method === 'HEAD' || ctx.method === 'GET') {
                    for (var i = 0; i < len; i++) {
                        opts.root = paths[i];
                        if ((yield send(ctx, ctx.path, opts)) != null) return;
                    }
                }
                return next();
            });
        };
    } else {
        handler = function handler(ctx, next) {
            return __awaiter(this, void 0, Promise, function* () {
                yield next();
                if (ctx.method != 'HEAD' && ctx.method != 'GET') return;
                // response is already handled
                if (ctx.body != null || ctx.status != 404) return;
                for (var i = 0; i < len; i++) {
                    opts.root = paths[i];
                    if ((yield send(ctx, ctx.path, opts)) != null) return;
                }
            });
        };
    }
    return handler;
}
exports.Static = Static;