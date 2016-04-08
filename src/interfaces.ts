/// <reference path="../typings/main.d.ts" />

import * as Koa from 'koa';
import {Willburg} from './willburg';
import {DIContainer} from 'stick.di';
import {SessionObject} from './middlewares/session';
import * as formidable from 'formidable';

export interface Configurable<T> { }

export interface MultipartResult {
    files: formidable.Files;
    fields: formidable.Fields;
}

export type File = formidable.File;
export type Files = {[key: string]: File};

export interface TypedMultipartResult<T> {
    files: Files;
    fields: T;
}

export interface Context extends Koa.Context {
    matched: any[];
    captures: string[];
    app: Willburg;
    params: { [key: string]: any };
    isXHR: boolean;
    readBody<T>(accepts?: string[]): Promise<T>;
    readForm<T>(o?): Promise<TypedMultipartResult<T>>
    session?:SessionObject|(() => Promise<SessionObject>);
    links (links:any): any;
}

export interface MiddlewareFunc {
    (ctx: Context, next?: Function): any;
}


export interface IApp {
    settings: any;
    router: IRouter;
    register(a: any);
    container: DIContainer;
    use(MiddlewareFunc)
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
    prefix(prefix);
    register(path: string|string[], method:string[], middlewares:MiddlewareFunc[], options?:IRouteOptions)
}

export interface ITask {
    name?: string;
    run(app: IApp): Promise<void>;
}


