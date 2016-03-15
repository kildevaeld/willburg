/// <reference path="../typings/main.d.ts" />
import * as Koa from 'koa';
import { DIContainer } from 'stick.di';
export declare type Context = Koa.Context;
export interface MiddlewareFunc {
    (ctx: Koa.Context, next?: Function): any;
}
export interface IApp {
    settings: any;
    router: IRouter;
    register(a: any): any;
    container: DIContainer;
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
}
export interface ITask {
    run(app: IApp): Promise<void>;
}
