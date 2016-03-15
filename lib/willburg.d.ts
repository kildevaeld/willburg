import './factories/index';
import * as Koa from 'koa';
import { IRouter, IApp, MiddlewareFunc } from './interfaces';
import { DIContainer } from 'stick.di';
import { Server } from 'http';
export interface WillburgPaths {
    initializers?: string;
    routes?: string;
    controllers?: string;
    services?: string;
}
export interface WillburgOptions {
    paths?: WillburgPaths;
}
export declare class Willburg extends Koa implements IApp {
    private _router;
    private _opts;
    private _tasks;
    private _container;
    router: IRouter;
    settings: WillburgOptions;
    container: DIContainer;
    constructor(options?: WillburgOptions);
    register(some: any): void;
    registerService(service: Function): void;
    registerController(controller: Function): void;
    mount(path: string, middleware: MiddlewareFunc | Willburg | Koa): void;
    start(): Promise<Willburg>;
    startAndListen(port: number): Promise<Willburg>;
    listen(port: number): Server;
    private _normalizePaths(paths);
}
