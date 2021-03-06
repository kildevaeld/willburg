import './factories/index';

import * as Koa from 'koa';
import { IRouter, IApp, ITask, MiddlewareFunc, Configurable } from './interfaces';
import * as iface from './interfaces';

import { flatten } from './utils';
import * as tasks from './tasks';
import * as metadata from './metadata';
import { ServiceTypes, Factories } from './metadata';
import { DIContainer, factory } from 'stick.di';
import { Container } from './container'
import { RouteFactory } from './factories/route-factory'
import { Server } from 'http';
import { ListenOptions } from 'net'
import { Bootstrap } from './bootstrap';
import * as Debug from 'debug';
import { Context } from './context'

import { ValidatorMap, validate } from './validation';

const debug = Debug('willburg');
const Router = require('koa-router');
const Mount = require('koa-mount');
const Compose = require('koa-compose');

export interface WillburgPaths {
    initializers?: string;
    routes?: string;
    controllers?: string;
    services?: string;
    directories?: string[];
}

export interface WillburgOptions {
    paths?: WillburgPaths;
    middlewares?: {
        [key: string]: any
    };
    directories?: string[];
    session?: boolean;
    name?: string;
}

export class Willburg extends Koa implements IApp {
    public name: string;
    private _router: IRouter;
    private _routers: { [key: string]: IRouter };
    private _opts: WillburgOptions
    //private _tasks: ITask[]
    private _container: DIContainer;
    private _boot: Bootstrap;

    get boot(): Bootstrap {
        return this._boot;
    }

    get router(): IRouter {
        return this._routers['/'];
    }

    get settings(): WillburgOptions {
        return this._opts;
    }

    get container(): DIContainer {
        return this._container;
    }

    get options(): WillburgOptions {
        return this._opts;
    }

    constructor(options?: WillburgOptions) {
        options = options || {};

        super();

        factory()(RouteFactory);

        this.context = Object.create(Context);
        this._opts = this._normalizeOptions(options);
        this._container = Container //.createChild();
        this._container.registerInstance('container', this._container);
        this._container.registerInstance(Willburg, this);
        this._routers = { '/': new Router() };
        this._boot = new Bootstrap(this);

        //this._initTasks();
        if (options.name) (<any>this).name = options.name;

    }

    use(...fn: MiddlewareFunc[]) {
        for (let i = 0, ii = fn.length; i < ii; i++) {
            super.use(fn[i]);
        }
        return this;
    }

    register(some: any) {

        if (metadata.isService(some, metadata.ServiceTypes.Controller)) {
            this.registerController(some);
        } else if (metadata.isService(some, ServiceTypes.Service)) {
            this.registerService(some);
        } else if (metadata.isService(some, ServiceTypes.Task)) {
            if (this.boot) this.boot.pushFront(new tasks.Runner([some]));
        }

        return this;
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
                    //this.router[route.method](...middlewares);
                } else {
                    //this.router[route.method](route.path, ...middlewares);
                }

            }
        }

        if (this._container.hasHandler(name)) {
            debug('service "%s" already defined', service.name || name);
        } else {
            debug('register service: "%s"', service.name || name)
            this._container.registerSingleton(name, service);
        }

        return this;
    }

    registerController(controller: Function) {
        let name = metadata.getService(controller, metadata.ServiceTypes.Controller);
        let namespace = metadata.getService<metadata.NamespaceDefinition>(controller, ServiceTypes.Namespace);

        let router = this.router;

        if (namespace != null) {
            let ns = namespace.path;

            router = new Router();
            router.prefix(namespace.path);
            if (this._routers[ns]) {
                ns += 1 + "";
            }

            this._routers[ns] = router;

        }

        let validations: ValidatorMap = Reflect.getOwnMetadata(metadata.MetaKeys.Validation, controller);
        validations = validations || {};

        let routes = metadata.getService<metadata.RouteDefinition[]>(controller, ServiceTypes.Route);

        if (!routes) return this;

        let cName = '$controller:' + name;
        debug('register controller: "%s" as %s', name, cName)
        this._container.registerSingleton(cName, controller);

        let $route = this.container.get(Factories.Route);

        for (let i = 0, ii = routes.length; i < ii; i++) {
            let route = routes[i];

            let middlewares = (namespace ? namespace.middleware : [])
                .concat(route.middleware.concat($route(route.action, cName)));

            if (validations[route.action]) {
                let m = null;
                for (let i = 0, ii = validations[route.action].length; i < ii; i++) {
                    let def = validations[route.action][i];
                    m = validate(def.validator, def.parameter, (m == null ? middlewares : [m]), def.shouldThrow)
                }
                middlewares = [m];
            }


            if (route.path == null) {
                router.use(null, ...middlewares)
            } else {
                router.register(route.path, route.method, middlewares);
            }
        }

        return this;
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
        let name = (<any>this).displayName || (<any>this).name || 'willburg';
        if (this.boot == null) {
            debug('%s already started', name)
            return this;
        }

        this._initTasks();

        debug('starting %s', name);
        await this.boot.run();
        this._boot = void 0;
        debug('%s started', name);

        return this;
    }

    startAndListen(port: number): Promise<Server> {
        return this.start()
            .then(() => {
                return this.listen(port);
            });
    }

    listen(): Server;
    listen(port: number, hostname?: string, backlog?: number, listeningListener?: Function): Server;
    listen(port: number, hostname?: string, listeningListener?: Function): Server;
    listen(port: number, backlog?: number, listeningListener?: Function): Server;
    listen(port: number, listeningListener?: Function): Server;
    listen(path: string, backlog?: number, listeningListener?: Function): Server;
    listen(path: string, listeningListener?: Function): Server;
    listen(handle: any, backlog?: number, listeningListener?: Function): Server;
    listen(handle: any, listeningListener?: Function): Server;
    listen(options: ListenOptions, listeningListener?: Function): Server;
    listen(...args): Server {
        if (this.boot != null) throw new Error("not started")
        // Mount router sorted by route-path length
        let keys = Object.keys(this._routers);
        keys.sort((a, b) => b.length - a.length)
        for (let i = 0, ii = keys.length; i < ii; i++) {
            debug('mounting router %s', keys[i]);
            this.use(this._routers[keys[i]].routes());
        }

        return super.listen.apply(this, args)

    }

    configure<U>(service: { new (...o: any[]): Configurable<U> }): U {
        let has = Reflect.hasOwnMetadata(metadata.MetaKeys.Options, service);
        if (!has) return null;
        let options = Reflect.getOwnMetadata(metadata.MetaKeys.Options, service);
        return this.container.get(options);
    }


    private _normalizeOptions(options: WillburgOptions): WillburgOptions {
        options = options || { paths: {}, middlewares: {}, directories: [], session: false };
        options = Object.assign({ paths: {}, middlewares: {}, directories: [], session: false }, options);
        return options;
    }

    private _initTasks() {
        this.boot.pushFront(new tasks.Middlewares())
        this.boot.push(new tasks.Directory(...this._opts.directories));
        this.boot.push(new tasks.Caching())
        this.boot.push([
            new tasks.Initializers(),
            new tasks.Views(),
            new tasks.Routes()
        ]);
    }

}