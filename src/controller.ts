import { MiddlewareFunc, Context } from './interfaces';
import { EventEmitter } from 'events';
import * as Debug from 'debug';

const debug = Debug('willburg:controller');
const compose = require('koa-compose');

export class Controller extends EventEmitter {
    static isController = true;
    private _stack: MiddlewareFunc[] = [];
    private _methods: { [key: string]: MiddlewareFunc } = {};
    private _dirty: boolean = true;

    use(...fns: MiddlewareFunc[]) {
        this._stack.push(...fns.map(m => m.bind(this)));
        this._dirty = true;
        return this;
    }

    handleRequest(action: string, ctx: Context, middlewares: MiddlewareFunc[], next: () => Promise<any>) {
        this.emit('before:action', action);
        
        var fn: MiddlewareFunc;

        if ( (this._dirty || !this._methods[action]) && (!middlewares || middlewares.length == 0)) {
            debug('composing static action %s:%s', this.constructor.name, action);
            if (this._stack.length) {
                this._methods[action] = fn = compose(this._stack.concat(this[action].bind(this)));
            } else {
                this._methods[action] = fn = this[action].bind(this);
            }

            this._dirty = false;
        } else if (middlewares && middlewares.length) {
            debug('composing dynamic action %s:%s', this.constructor.name, action);
            let m = this._stack.concat(middlewares).concat(this[action].bind(this));
            fn = compose(m);
        } else {
            fn = this._methods[action];
        }

        return Promise.resolve(fn(ctx, next)).then(ret => {
            this.emit('action', action);
            return ret;
        });
    }
}