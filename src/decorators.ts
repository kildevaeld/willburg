
import 'reflect-metadata';


import {MetaKeys, setService, ServiceTypes, getService, RouteDefinition} from './metadata';



function defineRoute(method: string, route: string): MethodDecorator {
    return function (target:any, key: string, desc:PropertyDescriptor) {
        //console.log(target.constructor)
        let ctor = target.constructor;
        let routes = getService<RouteDefinition[]>(ctor, ServiceTypes.Route);
        
        if (!routes) routes = [];
        
        routes.push({
            method: method,
            path: route,
            action: key
        })
        
        setService(ctor, ServiceTypes.Route, routes);
    };
}

export function namespace(path:string): ClassDecorator {
    return function (target) {
        setService(target, ServiceTypes.Namespace, {
            path: path
        });
    }
}

export function get(route: string): MethodDecorator {
    return defineRoute('get', route);
}

export function post(route: string): MethodDecorator {
    return defineRoute('post',route);
}

export function put(route: string): MethodDecorator {
    return defineRoute('put',route);
}

export function del(route: string): MethodDecorator {
    return defineRoute('delete', route);
}

export function patch(route: string): MethodDecorator {
    return defineRoute('patch', route);
}


export function controller(name?:string): ClassDecorator {
    return function(target:Function) {
        Reflect.defineMetadata(MetaKeys.Controller, name||target.name, target);
    };
}

export function service(name?:string): ClassDecorator {
    return function (target: Function) {
        Reflect.defineMetadata(MetaKeys.Service, name||target.name, target);
    };
}