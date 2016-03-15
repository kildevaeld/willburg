
import * as Koa from 'koa';
import {IRouter} from './interfaces';

const Router = require('koa-router');

export interface WillburgPaths {

}

export interface WillburgOptions {
  paths?: WillburgPaths
}

export class Willburg extends Koa {
  private _router: IRouter;
  private _opts : WillburgOptions
  get router (): IRouter {
    return this._router;
  }

  constructor (options:WillburgOptions = {}) {
    super();
    this._opts = options;
    this._opts.paths = this._normalizePaths(this._opts.paths);

    this._router = new Router();
  }







  async start (): Promise<Willburg> {
    return this;
  }

  listen (port:number) {
    this.use(this.router.routes);
    return super.listen(port)
  }


  private _normalizePaths (paths: WillburgPaths): WillburgPaths {

  }

}