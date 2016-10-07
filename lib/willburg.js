"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
require('./factories/index');
const Koa = require('koa');
const tasks = require('./tasks');
const metadata = require('./metadata');
const metadata_1 = require('./metadata');
const stick_di_1 = require('stick.di');
const container_1 = require('./container');
const route_factory_1 = require('./factories/route-factory');
const bootstrap_1 = require('./bootstrap');
const Debug = require('debug');
const context_1 = require('./context');
const validation_1 = require('./validation');
const debug = Debug('willburg');
const Router = require('koa-router');
const Mount = require('koa-mount');
const Compose = require('koa-compose');
class Willburg extends Koa {
    constructor(options) {
        options = options || {};
        super();
        stick_di_1.factory()(route_factory_1.RouteFactory);
        this.context = Object.create(context_1.Context);
        this._opts = this._normalizeOptions(options);
        this._container = container_1.Container; //.createChild();
        this._container.registerInstance('container', this._container);
        this._container.registerInstance(Willburg, this);
        this._routers = { '/': new Router() };
        this._boot = new bootstrap_1.Bootstrap(this);
        //this._initTasks();
        if (options.name)
            this.name = options.name;
    }
    get boot() {
        return this._boot;
    }
    get router() {
        return this._routers['/'];
    }
    get settings() {
        return this._opts;
    }
    get container() {
        return this._container;
    }
    get options() {
        return this._opts;
    }
    use(fn) {
        super.use(fn);
        return this;
    }
    register(some) {
        if (metadata.isService(some, metadata.ServiceTypes.Controller)) {
            this.registerController(some);
        }
        else if (metadata.isService(some, metadata_1.ServiceTypes.Service)) {
            this.registerService(some);
        }
        else if (metadata.isService(some, metadata_1.ServiceTypes.Task)) {
            if (this.boot)
                this.boot.pushFront(new tasks.Runner([some]));
        }
        return this;
    }
    registerService(service) {
        let name = metadata.getService(service, metadata.ServiceTypes.Service);
        let routes = metadata.getService(service, metadata_1.ServiceTypes.Route);
        if (routes) {
            let $route = this._container.get(metadata_1.Factories.Route);
            for (let i = 0, ii = routes.length; i < ii; i++) {
                let route = routes[i];
                let middlewares = route.middleware.concat($route(route.action, name));
                if (!route.path) {
                }
                else {
                }
            }
        }
        if (this._container.hasHandler(name)) {
            debug('service "%s" already defined', service.name || name);
        }
        else {
            debug('register service: "%s"', service.name || name);
            this._container.registerSingleton(name, service);
        }
        return this;
    }
    registerController(controller) {
        let name = metadata.getService(controller, metadata.ServiceTypes.Controller);
        let namespace = metadata.getService(controller, metadata_1.ServiceTypes.Namespace);
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
        let validations = Reflect.getOwnMetadata(metadata.MetaKeys.Validation, controller);
        validations = validations || {};
        let routes = metadata.getService(controller, metadata_1.ServiceTypes.Route);
        if (!routes)
            return this;
        let cName = '$controller:' + name;
        debug('register controller: "%s" as %s', name, cName);
        this._container.registerSingleton(cName, controller);
        let $route = this.container.get(metadata_1.Factories.Route);
        for (let i = 0, ii = routes.length; i < ii; i++) {
            let route = routes[i];
            let middlewares = (namespace ? namespace.middleware : [])
                .concat(route.middleware.concat($route(route.action, cName)));
            if (validations[route.action]) {
                let m = null;
                for (let i = 0, ii = validations[route.action].length; i < ii; i++) {
                    let def = validations[route.action][i];
                    m = validation_1.validate(def.validator, def.parameter, (m == null ? middlewares : [m]), def.shouldThrow);
                }
                middlewares = [m];
            }
            if (route.path == null) {
                router.use(null, ...middlewares);
            }
            else {
                router.register(route.path, route.method, middlewares);
            }
        }
        return this;
    }
    mount(path, middleware) {
        this.use(Mount(path, middleware));
    }
    /**
     * Start willburg. This will run the bootstrapper.
     * Task order of execution is:
     * Middlewares, Services, Initializers, Views, Controllers, Routes
     * @return {Promise<Willburg>}
     */
    start() {
        return __awaiter(this, void 0, Promise, function* () {
            let name = this.displayName || this.name || 'willburg';
            if (this.boot == null) {
                debug('%s already started', name);
                return this;
            }
            this._initTasks();
            debug('starting %s', name);
            yield this.boot.run();
            this._boot = void 0;
            debug('%s started', name);
            return this;
        });
    }
    startAndListen(port) {
        return this.start()
            .then(() => {
            return this.listen(port);
        });
    }
    listen(port, hostname, backlog, listeningListener) {
        // Mount router sorted by route-path length
        let keys = Object.keys(this._routers);
        keys.sort((a, b) => b.length - a.length);
        for (let i = 0, ii = keys.length; i < ii; i++) {
            debug('mounting router %s', keys[i]);
            this.use(this._routers[keys[i]].routes());
        }
        return super.listen(port, hostname, backlog, listeningListener);
    }
    configure(service) {
        let has = Reflect.hasOwnMetadata(metadata.MetaKeys.Options, service);
        if (!has)
            return null;
        let options = Reflect.getOwnMetadata(metadata.MetaKeys.Options, service);
        return this.container.get(options);
    }
    _normalizeOptions(options) {
        options = options || { paths: {}, middlewares: {}, directories: [], session: true };
        options = Object.assign({ paths: {}, middlewares: {}, directories: [], session: true }, options);
        return options;
    }
    _initTasks() {
        this.boot.pushFront(new tasks.Middlewares());
        this.boot.push(new tasks.Directory(...this._opts.directories));
        this.boot.push(new tasks.Caching());
        this.boot.push([
            new tasks.Initializers(),
            new tasks.Views(),
            new tasks.Routes()
        ]);
    }
}
exports.Willburg = Willburg;
