import 'reflect-metadata';
import { MiddlewareFunc } from './interfaces';
export declare enum ServiceTypes {
    Controller = 0,
    Route = 1,
    Namespace = 2,
    Service = 3,
    Task = 4,
}
export declare const MetaKeys: {
    Route: symbol;
    Controller: symbol;
    Namespace: symbol;
    Service: symbol;
    Task: symbol;
    Options: symbol;
};
export declare const Factories: {
    Route: symbol;
    View: symbol;
};
export declare const Variables: {
    ViewRoot: symbol;
    ViewEngine: symbol;
};
export interface RouteDefinition {
    path: string[];
    method: string[];
    action: string;
    middleware: MiddlewareFunc[];
}
export interface NamespaceDefinition {
    path: string;
    method: string;
    middleware: MiddlewareFunc[];
}
export declare function isService(target: any, service?: ServiceTypes): boolean;
export declare function getService<T>(target: any, service: ServiceTypes): T;
export declare function setService<T>(target: any, type: ServiceTypes, service: T): void;
