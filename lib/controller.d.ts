import { MiddlewareFunc, Context } from './interfaces';
import { EventEmitter } from 'events';
export declare class Controller extends EventEmitter {
    static isController: boolean;
    _stack: MiddlewareFunc[];
    use(...fns: MiddlewareFunc[]): this;
    handleRequest(action: string, ctx: Context, next: Function): any;
}
