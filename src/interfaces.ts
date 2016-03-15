/// <reference path="../typings/main.d.ts" />

import * as Koa from 'koa';
import {Willburg} from './willburg';

export interface MiddlewareFunc {
  (ctx: Koa.Context, next?: Function): any;
}

export interface IApp {
    settings: any;
    router: IRouter;
    register(a:any);
}

export interface IRouter {
  routes(): MiddlewareFunc;
  get(route: string | RegExp, ...middlewares: MiddlewareFunc[]): IRouter;
  post(route: string | RegExp, ...middlewares: MiddlewareFunc[]): IRouter;
  put(route: string | RegExp, ...middlewares: MiddlewareFunc[]): IRouter;
  delete(route: string | RegExp, ...middlewares: MiddlewareFunc[]): IRouter;
  patch(route: string | RegExp, ...middlewares: MiddlewareFunc[]): IRouter;
  head(route: string | RegExp, ...middlewares: MiddlewareFunc[]): IRouter;
}

export interface ITask {
  run(app: IApp): Promise<void>;
}