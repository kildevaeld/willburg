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
}
export declare class Willburg extends Koa implements IApp {
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
    register(some: any): void;
    registerService(service: Function): void;
    registerController(controller: Function): void;
    mount(path: string, middleware: MiddlewareFunc | Willburg | Koa): void;
    /**
     * Start willburg. This will run the bootstrapper.
     * Task order of execution is:
     * Middlewares, Services, Initializers, Views, Controllers, Routes
     * @return {Promise<Willburg>}
     */
    start(): Promise<Willburg>;
    startAndListen(port: number): Promise<Willburg>;
    listen(port: number): Server;
    configure<T extends Configurable<U>, U>(service: {
        new (...o: any[]): T;
    }): U;
    private _normalizeOptions(options);
    private _initTasks();
}
