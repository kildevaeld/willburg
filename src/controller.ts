import {MiddlewareFunc, Context} from './interfaces';
import {EventEmitter} from 'events';

const compose = require('koa-compose');

export class Controller extends EventEmitter {
    static isController = true;
    _stack: MiddlewareFunc[] = [];
    
    use (... fns:MiddlewareFunc[]) {
        this._stack.push(...fns);
        return this;
    }
    
    handleRequest (action: string, ctx: Context, next: Function) {
        this.emit('before:action', action);
        if (this._stack.length > 0) {
            return compose(this._stack)(ctx, next).then( () => {
                return this[action].call(this, ctx, next); 
            });
        }
        
        let ret = this[action](ctx, next);
        this.emit('action', action);
        
        return ret;
    }
}