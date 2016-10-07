import './factories/index';
import * as Koa from 'koa';
import { IRouter, IApp, MiddlewareFunc, Configurable } from './interfaces';
import { DIContainer } from 'stick.di';
import { Server } from 'http';
import { Bootstrap } from './bootstrap';
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
        [key: string]: any;
    };
    directories?: string[];
    session?: boolean;
    name?: string;
}
export declare class Willburg extends Koa implements IApp {
    name: string;
    private _router;
    private _routers;
    private _opts;
    private _container;
    private _boot;
    boot: Bootstrap;
    router: IRouter;
    settings: WillburgOptions;
    container: DIContainer;
    options: WillburgOptions;
    constructor(options?: WillburgOptions);
    use(fn: MiddlewareFunc): this;
    register(some: any): this;
    registerService(service: Function): this;
    registerController(controller: Function): this;
    mount(path: string, middleware: MiddlewareFunc | Willburg | Koa): void;
    /**
     * Start willburg. This will run the bootstrapper.
     * Task order of execution is:
     * Middlewares, Services, Initializers, Views, Controllers, Routes
     * @return {Promise<Willburg>}
     */
    start(): Promise<Willburg>;
    startAndListen(port: number): Promise<Server>;
    listen(port: number | string, hostname?: string | number | Function, backlog?: number | Function, listeningListener?: Function): Server;
    configure<U>(service: {
        new (...o: any[]): Configurable<U>;
    }): U;
    private _normalizeOptions(options);
    private _initTasks();
}
