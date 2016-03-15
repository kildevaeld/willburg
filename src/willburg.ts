import './factories/index';

import * as Koa from 'koa';
import {IRouter, IApp, ITask} from './interfaces';
import * as tasks from './tasks';
import * as metadata from './metadata';
import {ServiceTypes, Factories} from './metadata';
import {DIContainer, factory} from 'stick.di';
import {Container} from './container'
import {RouteFactory} from './factories/route-factory'

const Router = require('koa-router');

export interface WillburgPaths {

}

export interface WillburgOptions {
  paths?: WillburgPaths
}

export class Willburg extends Koa implements IApp {
  private _router: IRouter;
  private _opts : WillburgOptions
  private _tasks: ITask[]
  private _container: DIContainer;
  get router (): IRouter {
    return this._router;
  }
  
  get settings (): WillburgOptions {
      return this._opts;
  }

  constructor (options?:WillburgOptions) {
    options = options||{};
    
    super();
    
    factory()(RouteFactory);
    
    this._opts = options;
    this._opts.paths = this._normalizePaths(this._opts.paths);
    this._container = Container.createChild();
    this._container.registerInstance('container', this._container);
    
    this._router = new Router();
    this._tasks = [
      new tasks.Initializers(),
      new tasks.Controllers(),
      new tasks.Routes()
    ]
  }

  register(some: any) {
      if (metadata.isService(some, metadata.ServiceTypes.Controller)) {
        this.registerController(some);    
      } else if (metadata.isService(some, ServiceTypes.Service)) {
        this.registerService(some);
      }
  }
  
  registerService(service: Function) {
      
  }
  
  registerController(controller:Function) {
      let name = metadata.getService(controller, metadata.ServiceTypes.Controller);
      
      
      let namespace = metadata.getService(controller, ServiceTypes.Namespace);
      
      let router = this.router;
      if (namespace != null) {
          
      }
      
      let routes = metadata.getService<metadata.RouteDefinition[]>(controller, ServiceTypes.Route);
      
      if (!routes) return;
      
      let cName = '$controller:' + name;
      this._container.registerSingleton(cName, controller);
      
      let $route: RouteFactory = this._container.get(Factories.RouteFactory);
      for (let i = 0, ii = routes.length; i < ii; i++) {
        let route = routes[i];
        this.router[route.method](route.path, $route(route.action, cName));
      }
      
  }

  async start (): Promise<Willburg> {
    for (let i = 0, ii = this._tasks.length; i < ii; i ++) {
      await this._tasks[i].run(this);
    }
   
    return this;
  }
  
  async startAndListen(port:number): Promise<Willburg> {
      await this.start();
      this.listen(port);
      return this;
  }

  listen (port:number) {
    this.use(this.router.routes());
    return super.listen(port);
  }


  private _normalizePaths (paths: WillburgPaths): WillburgPaths {
      return paths ? paths : {};
  }

}