
import {MiddlewareFunc, Context} from '../interfaces';
import {resolve} from 'path';

const send = require('koa-send')

export interface StaticOptions {
    hidden?: boolean;
    index?: string;
    defer?: boolean;
    gzip?: boolean
    root?: string;
}

export function Static (root:string|string[], options:StaticOptions={}): MiddlewareFunc {
    
    let opts = Object.assign({
        hidden: false,
        index: 'index.html',
        defer: true,
        gzip: false
    }, options);
    
    if (typeof root === 'string') root = [<string>root];
    
    let paths = <string[]>root;
    
    let handler: MiddlewareFunc;
    
    let len = paths.length;
    if (!opts.defer) {
        handler =  async function (ctx: Context, next?:Function): Promise<any> {
            if (ctx.method === 'HEAD' || ctx.method === 'GET') {
                for (let i = 0; i < len; i++ ) {
                    opts.root = paths[i];
                    if ((await send(ctx, ctx.path, opts)) != null) return;
                }
            }
            
            return next();
        };
    } else {
        handler = async function (ctx: Context, next?:Function): Promise<any> {
            await next();
            if (ctx.method != 'HEAD' && ctx.method != 'GET') return;
            // response is already handled
            if (ctx.body != null || ctx.status != 404) return;
            
            for (let i = 0; i < len; i++ ) {
                opts.root = paths[i];
                if ((await send(ctx, ctx.path, opts)) != null) return;
            }
            
        }
    }
    
    return handler;
}