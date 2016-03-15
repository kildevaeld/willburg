import * as Koa from 'koa';

export interface MiddlewareFunc {
  (ctx: Koa.Context, next?: Function): any;
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