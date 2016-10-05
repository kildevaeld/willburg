"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const send = require('koa-send');
function ErrorHandler(fn, propagateError = true) {
    return function (ctx, next) {
        return __awaiter(this, void 0, Promise, function* () {
            try {
                yield next();
            }
            catch (e) {
                if (fn)
                    return fn(ctx, e);
                let statusCode = e.status || e.statusCode;
                let [type, data] = (() => {
                    switch (ctx.accepts('json', 'html')) {
                        case "json": return [
                            'application/json',
                            { status: statusCode || 500, error: e.message }
                        ];
                        case "html":
                            return ['text/html', e.message];
                        default:
                            return ["text/plain", e.message];
                    }
                })();
                if (statusCode == null) {
                    let app = ctx.app;
                    ctx.res.once('finish', () => {
                        if (propagateError)
                            return app.emit('error', e);
                        throw e;
                    });
                }
                else {
                    ctx.app.emit('http:error', e);
                }
                ctx.status = statusCode || 500;
                ctx.type = type;
                ctx.body = data;
            }
        });
    };
}
exports.ErrorHandler = ErrorHandler;
