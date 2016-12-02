import {MiddlewareFunc, Context} from './interfaces';
import {EventEmitter} from 'events';
import * as Debug from 'debug';

const debug = Debug('willburg:controller');
const compose = require('koa-compose');

export class Controller extends EventEmitter {
    static isController = true;
    private _stack: MiddlewareFunc[] = [];
    private _methods: {[key:string]: MiddlewareFunc} = {};
    private _dirty: boolean = true;

    use (... fns:MiddlewareFunc[]) {
        this._stack.push(...fns.map(m => m.bind(this)));
        this._dirty = true;
        return this;
    }
    
    handleRequest (action: string, ctx: Context, next: () => Promise<any>) {
        this.emit('before:action', action);

        if (this._dirty || !this._methods[action]) {
            debug('composing action %s:%s', this.constructor.name, action);
            if (this._stack.length) {
                this._methods[action] = compose(this._stack.concat(this[action].bind(this)));
            } else {
                this._methods[action] = this[action].bind(this);
            }

            this._dirty = false;
        }
        
        return Promise.resolve(this._methods[action](ctx, next)).then( ret => {
             this.emit('action', action);
            return ret;
        });
    }
}