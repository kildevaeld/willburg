import { MiddlewareFunc } from '../interfaces';
export interface StaticOptions {
    hidden?: boolean;
    index?: string;
    defer?: boolean;
    gzip?: boolean;
    root?: string;
}
export declare function Static(root: string | string[], options?: StaticOptions): MiddlewareFunc;
