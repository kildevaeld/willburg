import { MiddlewareFunc, Context } from './interfaces';
export declare class Controller {
    static isController: boolean;
    _stack: MiddlewareFunc[];
    use(...fns: MiddlewareFunc[]): this;
    handleRequest(action: string, ctx: Context, next: Function): any;
}
