
import 'reflect-metadata';
import {MiddlewareFunc} from './interfaces';

export enum ServiceTypes {
    Controller,
    Route,
    Namespace,
    Service
}

export const MetaKeys = {
    Route: Symbol("route"),
    Controller: Symbol('controller'),
    Namespace: Symbol('namespace'),
    Service: Symbol('service')
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
    path: RegExp;
    method: string;
    middleware: MiddlewareFunc[];
}

export function isService(target:any, service: ServiceTypes): boolean {
    return Reflect.hasOwnMetadata(MetaKeys[ServiceTypes[service]], target);
}

export function getService<T>(target:any, service:ServiceTypes): T {
    return Reflect.getOwnMetadata(MetaKeys[ServiceTypes[service]], target);
} 

export function setService<T>(target:any, type:ServiceTypes, service: T) {
    
    Reflect.defineMetadata(MetaKeys[ServiceTypes[type]], service, target);
}