
import {MiddlewareFunc, Context} from '../interfaces';
import {resolve} from 'path';
import * as Debug from 'debug';
import * as assert from 'assert';

const send = require('koa-send')
const debug = Debug('willburg:middleware:static');

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
    
    assert(Array.isArray(root) && len !== 0, "Root required");
    
    debug('static "%s" %j', root, opts);
    
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