/// <reference types="node" />
import { MiddlewareFunc, Context } from './interfaces';
import { EventEmitter } from 'events';
export declare class Controller extends EventEmitter {
    static isController: boolean;
    private _stack;
    private _methods;
    private _dirty;
    use(...fns: MiddlewareFunc[]): this;
    handleRequest(action: string, ctx: Context, next: () => Promise<any>): Promise<any>;
}
