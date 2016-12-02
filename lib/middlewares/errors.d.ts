/// <reference types="node" />
import { MiddlewareFunc, Context } from '../interfaces';
export declare function ErrorHandler(fn?: (ctx: Context, error: Error) => any, propagateError?: boolean): MiddlewareFunc;
