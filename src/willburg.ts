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
import {Bootstrap} from './bootstrap';
import * as Debug from 'debug';

const debug = Debug('willburg');

const Router = require('koa-router');
const Mount = require('koa-mount');
const Compose = require('koa-compose');

export interface WillburgPaths {
    initializers?: string;
    routes?: string;
    controllers?: string;
    services?: string;
}

export interface WillburgOptions {
    paths?: WillburgPaths;
    middlewares?: {
        [key: string]: any
    };
}

export class Willburg extends Koa implements IApp {
    private _router: IRouter;
    private _opts: WillburgOptions
    //private _tasks: ITask[]
    private _container: DIContainer;
    private _boot: Bootstrap;
    
    get boot (): Bootstrap {
        return this._boot;
    }
    
    get router(): IRouter {
        return this._router;
    }

    get settings(): WillburgOptions {
        return this._opts;
    }

    get container(): DIContainer {
        return this._container;
    }

    constructor(options?: WillburgOptions) {
        options = options || {};

        super();

        factory()(RouteFactory);

        
        this._opts = this._normalizeOptions(options);
        this._container = Container //.createChild();
        this._container.registerInstance('container', this._container);
        this._container.registerInstance(Willburg, Willburg);
        this._router = new Router();
        this._boot = new Bootstrap(this);
        this._boot.push([
            new tasks.Middlewares(),
            new tasks.Services(),
            new tasks.Initializers(),
            new tasks.Views(),
            new tasks.Controllers(),
            new tasks.Routes()
        ]);
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

        let routes = metadata.getService<metadata.RouteDefinition[]>(service, ServiceTypes.Route);

        if (routes) {
            let $route = this._container.get(Factories.Route);

            for (let i = 0, ii = routes.length; i < ii; i++) {
                let route = routes[i];
                let middlewares = route.middleware.concat($route(route.action, name));
                if (!route.path) {
                    this.router[route.method](...middlewares);
                } else {
                    this.router[route.method](route.path, ...middlewares);
                }
                
            }
        }


        this._container.registerSingleton(name, service);
    }

    registerController(controller: Function) {
        let name = metadata.getService(controller, metadata.ServiceTypes.Controller);


        let namespace = metadata.getService<metadata.NamespaceDefinition>(controller, ServiceTypes.Namespace);

        let router = this.router;
        if (namespace != null) {
            router = new Router();

        }

        let routes = metadata.getService<metadata.RouteDefinition[]>(controller, ServiceTypes.Route);

        if (!routes) return;

        let cName = '$controller:' + name;
        this._container.registerSingleton(cName, controller);

        let $route = this.container.get(Factories.Route);

        for (let i = 0, ii = routes.length; i < ii; i++) {
            let route = routes[i];
            let middlewares = route.middleware.concat($route(route.action, cName));

            router[route.method](route.path, ...middlewares);
        }


        if (router !== this._router) {
            let middlewares = (namespace.middleware || []).concat([router.routes(), router.allowedMethods()]);
            this.router.use(namespace.path, ...middlewares);
        }

    }
    
    mount(path: string, middleware: MiddlewareFunc | Willburg | Koa) {
        this.use(Mount(path, middleware));
    }

    /**
     * Start willburg. This will run the bootstrapper.
     * Task order of execution is:
     * Middlewares, Services, Initializers, Views, Controllers, Routes
     * @return {Promise<Willburg>}
     */
    async start(): Promise<Willburg> {
        if (this.boot == null) return this;
        debug('starting willburg');
        await this.boot.run();
        this._boot = void 0;
        debug('willburg started');
        
        return this;
    }

    async startAndListen(port: number): Promise<Willburg> {
        await this.start();
        this.listen(port);
        return this;
    }

    listen(port: number): Server {
        this.use(this.router.routes());
        return super.listen(port);
    }


    private _normalizeOptions(options: WillburgOptions): WillburgOptions {
        options = options||{paths:{}, middlewares:{}};   
        options = Object.assign({paths:{}, middlewares:{}}, options);
        return options;
    }

}