/// <reference path="../typings/main.d.ts" />

import * as Koa from 'koa';
import {Willburg} from './willburg';
import {DIContainer} from 'stick.di';
import {SessionObject} from './middlewares/session';

export interface Context extends Koa.Context {
    app: Willburg;
    params: { [key: string]: any };
    isXHR: boolean;
    readBody<T>(accepts?: string[]): Promise<T>;
    session?:SessionObject|(() => Promise<SessionObject>);
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
}

export interface ITask {
    name?: string;
    run(app: IApp): Promise<void>;
}


