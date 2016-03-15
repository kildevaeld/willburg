import './factories/index';

import * as Koa from 'koa';
import {IRouter, IApp, ITask, MiddlewareFunc} from './interfaces';
import * as tasks from './tasks';
import * as metadata from './metadata';
import {ServiceTypes, Factories} from './metadata';
import {DIContainer, factory} from 'stick.di';
import {Container} from './container'
import {RouteFactory} from './factories/route-factory'
import {Server} from 'http';

const Router = require('koa-router');
const Mount = require('koa-mount');


export interface WillburgPaths {
    initializers?: string;
    routes?: string;
    controllers?: string;
    services?: string;
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
  
  get container (): DIContainer {
      return this._container;
  }

  constructor (options?:WillburgOptions) {
    options = options||{};
    
    super();
    
    factory()(RouteFactory);
    
    this._opts = options;
    this._opts.paths = this._normalizePaths(this._opts.paths);
    this._container = Container //.createChild();
    this._container.registerInstance('container', this._container);
    
    this._router = new Router();
    this._tasks = [
      new tasks.Services(),
      new tasks.Initializers(),
      new tasks.Controllers(),
      new tasks.Routes(),
      new tasks.Views()
    ];
  }

  register(some: any) {
      if (metadata.isService(some, metadata.ServiceTypes.Controller)) {
        this.registerController(some);    
      } else if (metadata.isService(some, ServiceTypes.Service)) {
        this.registerService(some);
      }
  }
  
  registerService(service: Function) {
      let name = metadata.getService(service, metadata.ServiceTypes.Service);
      this._container.registerSingleton(name, service);
  }
  
  registerController(controller:Function) {
      let name = metadata.getService(controller, metadata.ServiceTypes.Controller);
      
      
      let namespace = metadata.getService<metadata.NamespaceDefinition>(controller, ServiceTypes.Namespace);
      
      let router = this.router;
      if (namespace != null) {
          /*let ns = '$namespace:' + String(namespace.path)
          if (!this._container.hasHandler(ns)) {
              let n = new Router();
              
          }*/
        router = new Router();
        
      }
      
      let routes = metadata.getService<metadata.RouteDefinition[]>(controller, ServiceTypes.Route);
      
      if (!routes) return;
      
      let cName = '$controller:' + name;
      this._container.registerSingleton(cName, controller);
      
      let $route = this._container.get(Factories.Route);
      
      for (let i = 0, ii = routes.length; i < ii; i++) {
        let route = routes[i];
        let middlewares = route.middleware.concat($route(route.action, cName));
        
        router[route.method](route.path, ...middlewares);
      }
      
      if (router !== this._router) {
          let middlewares = (namespace.middleware||[]).concat([router.routes(), router.allowedMethods()]);
          this._router.use(namespace.path, ...middlewares);
      }
      
  }
  
  mount(path:string, middleware:MiddlewareFunc|Willburg|Koa) {
      this.use(Mount(path, middleware));
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

  listen (port:number): Server {
    this.use(this.router.routes());
    return super.listen(port);
  }


  private _normalizePaths (paths: WillburgPaths): WillburgPaths {
      return paths ? paths : {};
  }

}