
import 'reflect-metadata';
import {MiddlewareFunc} from './interfaces';

export enum ServiceTypes {
    Controller,
    Route,
    Namespace,
    Service,
    Task
}

export const MetaKeys = {
    Route: Symbol("route"),
    Controller: Symbol('controller'),
    Namespace: Symbol('namespace'),
    Service: Symbol('service'),
    Task: Symbol("task")
} 

export const Factories = {
    Route: Symbol('route::factory'),
    View: Symbol('view::factory')
};

export const Variables = {
    ViewRoot: Symbol('view::root'),
    ViewEngine: Symbol('view::engine')
}

export interface RouteDefinition {
    path: string;
    method: string;
    action: string;
    middleware: MiddlewareFunc[];
}

export interface NamespaceDefinition {
    path: string;
    method: string;
    middleware: MiddlewareFunc[];
}

export function isService(target:any, service?: ServiceTypes): boolean {
    var check = (service: ServiceTypes) => {
        return Reflect.hasOwnMetadata(MetaKeys[ServiceTypes[service]], target);
    }
    if (service != null) {
        return check(service);
    }
    return check(ServiceTypes.Controller) || check(ServiceTypes.Task) || check(ServiceTypes.Service);
}

export function getService<T>(target:any, service:ServiceTypes): T {
    return Reflect.getOwnMetadata(MetaKeys[ServiceTypes[service]], target);
} 

export function setService<T>(target:any, type:ServiceTypes, service: T) {
    
    Reflect.defineMetadata(MetaKeys[ServiceTypes[type]], service, target);
}