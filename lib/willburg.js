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
const Router = require('koa-router');
class Willburg extends Koa {
    constructor(options) {
        options = options || {};
        super();
        stick_di_1.factory()(route_factory_1.RouteFactory);
        this._opts = options;
        this._opts.paths = this._normalizePaths(this._opts.paths);
        this._container = container_1.Container.createChild();
        this._container.registerInstance('container', this._container);
        this._router = new Router();
        this._tasks = [
            new tasks.Initializers(),
            new tasks.Controllers(),
            new tasks.Routes()
        ];
    }
    get router() {
        return this._router;
    }
    get settings() {
        return this._opts;
    }
    register(some) {
        if (metadata.isService(some, metadata.ServiceTypes.Controller)) {
            this.registerController(some);
        }
        else if (metadata.isService(some, metadata_1.ServiceTypes.Service)) {
            this.registerService(some);
        }
    }
    registerService(service) {
    }
    registerController(controller) {
        let name = metadata.getService(controller, metadata.ServiceTypes.Controller);
        let namespace = metadata.getService(controller, metadata_1.ServiceTypes.Namespace);
        let router = this.router;
        if (namespace != null) {
        }
        let routes = metadata.getService(controller, metadata_1.ServiceTypes.Route);
        if (!routes)
            return;
        let cName = '$controller:' + name;
        this._container.registerSingleton(cName, controller);
        let $route = this._container.get(metadata_1.Factories.RouteFactory);
        for (let i = 0, ii = routes.length; i < ii; i++) {
            let route = routes[i];
            this.router[route.method](route.path, $route(route.action, cName));
        }
    }
    start() {
        return __awaiter(this, void 0, Promise, function* () {
            for (let i = 0, ii = this._tasks.length; i < ii; i++) {
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
