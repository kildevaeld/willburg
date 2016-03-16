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
var tasks = require('./tasks');
var metadata = require('./metadata');
var metadata_1 = require('./metadata');
var stick_di_1 = require('stick.di');
var container_1 = require('./container');
var route_factory_1 = require('./factories/route-factory');
var Router = require('koa-router');
var Mount = require('koa-mount');
var Compose = require('koa-compose');
class Willburg extends Koa {
    constructor(options) {
        options = options || {};
        super();
        stick_di_1.factory()(route_factory_1.RouteFactory);
        this._opts = options;
        this._opts.paths = this._normalizePaths(this._opts.paths);
        this._container = container_1.Container; //.createChild();
        this._container.registerInstance('container', this._container);
        this._router = new Router();
        this._tasks = [new tasks.Services(), new tasks.Initializers(), new tasks.Views(), new tasks.Controllers(), new tasks.Routes()];
    }
    get router() {
        return this._router;
    }
    get settings() {
        return this._opts;
    }
    get container() {
        return this._container;
    }
    register(some) {
        if (metadata.isService(some, metadata.ServiceTypes.Controller)) {
            this.registerController(some);
        } else if (metadata.isService(some, metadata_1.ServiceTypes.Service)) {
            this.registerService(some);
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
                if (!route.path) {
                    var _router;

                    (_router = this.router)[route.method].apply(_router, _toConsumableArray(middlewares));
                } else {
                    var _router2;

                    (_router2 = this.router)[route.method].apply(_router2, [route.path].concat(_toConsumableArray(middlewares)));
                }
            }
        }
        this._container.registerSingleton(name, service);
    }
    registerController(controller) {
        var name = metadata.getService(controller, metadata.ServiceTypes.Controller);
        var namespace = metadata.getService(controller, metadata_1.ServiceTypes.Namespace);
        var router = this.router;
        if (namespace != null) {
            router = new Router();
        }
        var routes = metadata.getService(controller, metadata_1.ServiceTypes.Route);
        if (!routes) return;
        var cName = '$controller:' + name;
        this._container.registerSingleton(cName, controller);
        var $route = this.container.get(metadata_1.Factories.Route);
        for (var i = 0, ii = routes.length; i < ii; i++) {
            var _router3;

            var route = routes[i];
            var middlewares = route.middleware.concat($route(route.action, cName));
            (_router3 = router)[route.method].apply(_router3, [route.path].concat(_toConsumableArray(middlewares)));
        }
        if (router !== this._router) {
            var _router4;

            var _middlewares = (namespace.middleware || []).concat([router.routes(), router.allowedMethods()]);
            (_router4 = this.router).use.apply(_router4, [namespace.path].concat(_toConsumableArray(_middlewares)));
        }
    }
    mount(path, middleware) {
        this.use(Mount(path, middleware));
    }
    start() {
        return __awaiter(this, void 0, Promise, function* () {
            for (var i = 0, ii = this._tasks.length; i < ii; i++) {
                yield this._tasks[i].run(this);
            }
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
        this.use(this.router.routes());
        return super.listen(port);
    }
    _normalizePaths(paths) {
        return paths ? paths : {};
    }
}
exports.Willburg = Willburg;