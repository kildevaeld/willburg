"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator.throw(value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
require('./factories/index');
var Koa = require('koa');
var utils_1 = require('./utils');
var tasks = require('./tasks');
var metadata = require('./metadata');
var metadata_1 = require('./metadata');
var stick_di_1 = require('stick.di');
var container_1 = require('./container');
var route_factory_1 = require('./factories/route-factory');
var bootstrap_1 = require('./bootstrap');
var Debug = require('debug');
var context_1 = require('./context');
var validation_1 = require('./validation');
var debug = Debug('willburg');
var Router = require('koa-router');
var Mount = require('koa-mount');
var Compose = require('koa-compose');
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
        this._initTasks();
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
    use(fn) {
        super.use(fn);
        return this;
    }
    register(some) {
        if (metadata.isService(some, metadata.ServiceTypes.Controller)) {
            this.registerController(some);
        } else if (metadata.isService(some, metadata_1.ServiceTypes.Service)) {
            this.registerService(some);
        } else if (metadata.isService(some, metadata_1.ServiceTypes.Task)) {
            if (this.boot) this.boot.pushFront(new tasks.Runner([some]));
        }
    }
    registerService(service) {
        var name = metadata.getService(service, metadata.ServiceTypes.Service);
        var routes = metadata.getService(service, metadata_1.ServiceTypes.Route);
        if (routes) {
            var $route = this._container.get(metadata_1.Factories.Route);
            for (var i = 0, ii = routes.length; i < ii; i++) {
                var route = routes[i];
                var middlewares = route.middleware.concat($route(route.action, name));
                if (!route.path) {} else {}
            }
        }
        debug('register service: "%s"', service.name);
        this._container.registerSingleton(name, service);
    }
    registerController(controller) {
        var name = metadata.getService(controller, metadata.ServiceTypes.Controller);
        var namespace = metadata.getService(controller, metadata_1.ServiceTypes.Namespace);
        var router = this.router;
        var ns = namespace.path;
        if (namespace != null) {
            /*router = this._routers[ns];
            if (router) {
                router = new Router();
                router.prefix(namespace.path);
                //(<any>router).use(...(<any>namespace.middleware));
            }*/
            router = new Router();
            router.prefix(namespace.path);
            if (this._routers[ns]) {
                ns += 1 + "";
            }
            this._routers[ns] = router;
        }
        var validations = Reflect.getOwnMetadata(metadata.MetaKeys.Validation, controller);
        validations = validations || {};
        var routes = metadata.getService(controller, metadata_1.ServiceTypes.Route);
        if (!routes) return;
        var cName = '$controller:' + name;
        debug('register controller: "%s" as %s', name, cName);
        this._container.registerSingleton(cName, controller);
        var $route = this.container.get(metadata_1.Factories.Route);
        for (var i = 0, ii = routes.length; i < ii; i++) {
            var route = routes[i];
            var middlewares = (namespace ? namespace.middleware : []).concat(route.middleware.concat($route(route.action, cName)));
            if (validations[route.action]) {
                var m = null;
                for (var _i = 0, _ii = validations[route.action].length; _i < _ii; _i++) {
                    var def = validations[route.action][_i];
                    m = validation_1.validate(def.validator, def.parameter, m == null ? middlewares : [m], def.shouldThrow);
                }
                middlewares = [m];
            }
            if (route.path == null) {
                var _router;

                (_router = router).use.apply(_router, [null].concat(_toConsumableArray(middlewares)));
            } else {
                router.register(route.path, route.method, middlewares);
            }
        }
        if (router !== this._router) {}
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
            if (this.boot == null) return this;
            debug('starting willburg');
            yield this.boot.run();
            this._boot = void 0;
            debug('willburg started');
            return this;
        });
    }
    startAndListen(port) {
        return __awaiter(this, void 0, Promise, function* () {
            yield this.start();
            this.listen(port);
            return this;
        });
    }
    listen(port) {
        /*for (const key in this._routers) {
            if (key == '/') continue;
            
            this.use(this._routers[key].routes());
        }*/
        var keys = Object.keys(this._routers);
        keys.sort(function (a, b) {
            return b.length - a.length;
        });
        for (var i = 0, ii = keys.length; i < ii; i++) {
            debug('mounting router %s', keys[i]);
            this.use(this._routers[keys[i]].routes());
        }
        //this.use(this._routers['/'].routes());
        //this.use(this.router.routes());
        return super.listen(port);
    }
    configure(service) {
        var has = Reflect.hasOwnMetadata(metadata.MetaKeys.Options, service);
        if (!has) return null;
        var options = Reflect.getOwnMetadata(metadata.MetaKeys.Options, service);
        return this.container.get(options);
    }
    _normalizeOptions(options) {
        options = options || { paths: {}, middlewares: {} };
        options = Object.assign({ paths: {}, middlewares: {} }, options);
        return options;
    }
    _initTasks() {
        var _this = this;

        this._boot.push(new tasks.Middlewares());
        var dirs = ['services', 'controllers', 'paths'].map(function (e) {
            return _this._opts.paths[e];
        }).filter(function (e) {
            return e != null;
        });
        dirs = utils_1.flatten(dirs);
        console.log('dirs', dirs);
        this.boot.push(new (Function.prototype.bind.apply(tasks.Directory, [null].concat(_toConsumableArray(dirs))))());
        this.boot.push([new tasks.Initializers(), new tasks.Views(), new tasks.Routes()]);
        /*this._boot.push([
            new tasks.Middlewares(),
            new tasks.Directory()
            //new tasks.Services(),
            //new tasks.Initializers(),
            //new tasks.Views(),
            //new tasks.Controllers(),
            //new tasks.Routes()
        ]);*/
    }
}
exports.Willburg = Willburg;