
import 'reflect-metadata';
import {MiddlewareFunc, Context} from './interfaces';

import {MetaKeys, setService, ServiceTypes, getService, RouteDefinition} from './metadata';

import * as joi from 'joi';

export const Joi = joi;

export {inject, autoinject} from 'stick.di';

function defineRoute(method: string, route: string, middlewares: MiddlewareFunc[]): MethodDecorator {
    return function (target:any, key: string, desc:PropertyDescriptor) {
        middlewares = middlewares||[];
        
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
            middleware: middleware
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

export function use(path:string|MiddlewareFunc, ...middleware:MiddlewareFunc[]): MethodDecorator {
    if (typeof path === 'function') {
        middleware = [<MiddlewareFunc>path].concat(middleware);
        path = null;
    }
    return defineRoute('use', <string>path, middleware);
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

export function query(schema:joi.SchemaMap): MethodDecorator {
    
    let joiSchema = joi.object().keys(schema);
    
    return function (target: any, key: string, descriptor: TypedPropertyDescriptor<Function>) {
        let method = descriptor.value;
        descriptor.value =  async function (ctx: Context, next?: Function) {
            try {
                let query = await validate(joiSchema, ctx.query);
                ctx.query = query;
            } catch (e) {
                ctx.throw(400, e.toString());
            }
            
            return await method.call(this, ctx, next);
        };
    }
}

export function body(schema:joi.SchemaMap): MethodDecorator {
    let joiSchema = joi.object().keys(schema);
    
    return function (target: any, key: string, descriptor: TypedPropertyDescriptor<Function>) {
        let method = descriptor.value;
        descriptor.value =  async function (ctx: Context, next?: Function) {
            try {
                let query = await validate(joiSchema, ctx.query);
                ctx.query = query;
            } catch (e) {
                ctx.throw(400, e.toString());
            }
            
            return await method.call(this, ctx, next);
        };
    }
}


function validate (schema: joi.Schema, value: any): Promise<any> {
    return new Promise((resolve, reject) => {
       joi.validate(value, schema, (err, value) => {
          if (err) return reject(err);
          resolve(value); 
       });
    });
}