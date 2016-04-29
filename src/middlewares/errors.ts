
import {MiddlewareFunc, Context} from '../interfaces';
import {resolve} from 'path';

const send = require('koa-send')


export function ErrorHandler(fn?: (ctx: Context, error: Error) => any, propagateError: boolean = true): MiddlewareFunc {
    return async function(ctx: Context, next: Function): Promise<void> {
        try {
            await next();
        } catch (e) {

            if (fn) return fn(ctx, e);
            let statusCode = e.status || e.statusCode;

            let [type, data] = (() => {
                switch ((<any>ctx).accepts('json', 'html')) {
                    case "json": return [
                        'application/json',
                        { status: statusCode || 500, error: e.message }
                    ];
                    case "html":
                    default:
                        return ['text/html', e.message];
                }
            })();
            if (statusCode == null) {
                let app = ctx.app;
                ctx.res.once('finish', () => {
                    if (propagateError)
                        return app.emit('error', e);
                    throw e;
                });
            } else {
                ctx.app.emit('http:error', e);
            }

            ctx.status = statusCode || 500;
            ctx.type = type;
            ctx.body = data;


        }


    }
}