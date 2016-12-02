/// <reference types="node" />
import * as Koa from 'koa';
import { Willburg } from './willburg';
import { DIContainer } from 'stick.di';
import { SessionObject } from './middlewares/session';
import * as formidable from 'formidable';
import { Stats } from 'fs';
export interface Configurable<T> {
}
export interface MultipartResult {
    files: formidable.Files;
    fields: formidable.Fields;
}
export declare type File = formidable.File;
export declare type Files = {
    [key: string]: File;
};
export interface TypedMultipartResult<T> {
    files: Files;
    fields: T;
}
export interface SendOptions {
    maxage?: number;
    hidden?: boolean;
    root?: string;
    gzip?: boolean;
    format?: boolean;
    setHeaders?: (res: Koa.Response, path: string, stats: Stats) => void;
}
export interface Context extends Koa.Context {
    matched: any[];
    captures: string[];
    app: Willburg;
    params: {
        [key: string]: any;
    };
    isXHR: boolean;
    readBody<T>(accepts?: string[]): Promise<T>;
    readForm<T>(o?: any): Promise<TypedMultipartResult<T>>;
    session?: SessionObject | (() => Promise<SessionObject>);
    links(links: any): any;
    send(path: string, options?: SendOptions): Promise<string>;
}
export interface MiddlewareFunc {
    (ctx: Context, next: () => Promise<any>): any;
}
export interface IApp {
    settings: any;
    router: IRouter;
    register(a: any): any;
    container: DIContainer;
    use(...MiddlewareFunc: any[]): any;
}
export interface IRouteOptions {
    end?: boolean;
    name?: string;
    sensitive?: boolean;
    strict?: boolean;
    prefix?: string;
}
export interface IRouter {
    routes(): MiddlewareFunc;
    allowedMethods(): MiddlewareFunc;
    get(route: string | RegExp, ...middlewares: MiddlewareFunc[]): IRouter;
    post(route: string | RegExp, ...middlewares: MiddlewareFunc[]): IRouter;
    put(route: string | RegExp, ...middlewares: MiddlewareFunc[]): IRouter;
    delete(route: string | RegExp, ...middlewares: MiddlewareFunc[]): IRouter;
    patch(route: string | RegExp, ...middlewares: MiddlewareFunc[]): IRouter;
    head(route: string | RegExp, ...middlewares: MiddlewareFunc[]): IRouter;
    use(path: string | RegExp | MiddlewareFunc, ...middlewares: MiddlewareFunc[]): IRouter;
    prefix(prefix: any): any;
    register(path: string | string[], method: string[], middlewares: MiddlewareFunc[], options?: IRouteOptions): any;
}
export interface ITask {
    name?: string;
    run(app: IApp): Promise<void>;
}
