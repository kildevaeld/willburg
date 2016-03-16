
import 'reflect-metadata';
import {MiddlewareFunc} from './interfaces';

import {MetaKeys, setService, ServiceTypes, getService, RouteDefinition} from './metadata';

export {inject, autoinject} from 'stick.di';

function defineRoute(method: string, route: string, middlewares: MiddlewareFunc[]): MethodDecorator {
    return function (target:any, key: string, desc:PropertyDescriptor) {
        middlewares = middlewares||[];
        //console.log(target.constructor)
        let ctor = target.constructor;
        let routes = getService<RouteDefinition[]>(ctor, ServiceTypes.Route);
        
        if (!routes) routes = [];
        
        routes.push({
            method: method,
            path: route,
            action: key,
            middleware: middlewares
        })
        
        setService(ctor, ServiceTypes.Route, routes);
    };
}

export function namespace(path:string, ...middleware:MiddlewareFunc[]): ClassDecorator {
    return function (target) {
        setService(target, ServiceTypes.Namespace, {
            path: path,
            middlewares: middleware
        });
    }
}

export function get(route: string, ...middleware:MiddlewareFunc[]): MethodDecorator {
    return defineRoute('get', route, middleware);
}

export function post(route: string, ...middleware:MiddlewareFunc[]): MethodDecorator {
    return defineRoute('post',route, middleware);
}

export function put(route: string, ...middleware:MiddlewareFunc[]): MethodDecorator {
    return defineRoute('put',route, middleware);
}

export function del(route: string, ...middleware:MiddlewareFunc[]): MethodDecorator {
    return defineRoute('delete', route, middleware);
}

export function patch(route: string, ...middleware:MiddlewareFunc[]): MethodDecorator {
    return defineRoute('patch', route, middleware);
}

export function use(...middleware:MiddlewareFunc[]): MethodDecorator {
    return defineRoute('use', null, middleware);
}


export function controller(name?:string): ClassDecorator {
    return function(target:Function) {
        Reflect.defineMetadata(MetaKeys.Controller, name||target.name, target);
    };
}


export function service(name?:string): ClassDecorator {
    return function (target: Function) {
        Reflect.defineMetadata(MetaKeys.Service, name||target, target);
    };
}