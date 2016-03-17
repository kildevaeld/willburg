
import 'reflect-metadata';
import {MiddlewareFunc, Context, ITask} from './interfaces';

import {MetaKeys, setService, ServiceTypes, getService, RouteDefinition} from './metadata';

import * as joi from 'joi';

export const Joi = joi;

export {inject, autoinject} from 'stick.di';

function defineRoute(method: string[], route: string[], middlewares: MiddlewareFunc[]): MethodDecorator {
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
    return defineRoute(['GET'], [route], middleware);
}

export function post(route: string, ...middleware:MiddlewareFunc[]): MethodDecorator {
    return defineRoute(['POST'],[route], middleware);
}

export function put(route: string, ...middleware:MiddlewareFunc[]): MethodDecorator {
    return defineRoute(['PUT'],[route], middleware);
}

export function del(route: string, ...middleware:MiddlewareFunc[]): MethodDecorator {
    return defineRoute(['DELETE'], [route], middleware);
}

export function patch(route: string, ...middleware:MiddlewareFunc[]): MethodDecorator {
    return defineRoute(['PATCH'], [route], middleware);
}

export function use(path:string|MiddlewareFunc, ...middleware:MiddlewareFunc[]): MethodDecorator {
    if (typeof path === 'function') {
        middleware = [<MiddlewareFunc>path].concat(middleware);
        path = null;
    }
    return defineRoute(['USE'], [<string>path], middleware);
}

export function route(path:string|string[], methods:string|string[], ...middlewares: MiddlewareFunc[]): MethodDecorator {
    if (typeof methods === 'string') methods = [<string>methods];
    let m: string[] = <string[]>methods;
    m = m.map( e => e.toUpperCase());
    path = Array.isArray(path) ? path : [path];
    methods = Array.isArray(methods) ? methods : [methods];
    
    return defineRoute(<string[]>methods, <string[]>path, middlewares);
    
}

export function options(options:any): ClassDecorator {
    return function (target: Function) {
        Reflect.defineMetadata(MetaKeys.Options, options, target);
    }
}

export function controller(name?:string): ClassDecorator {
    return function(target:Function) {
        Reflect.defineMetadata(MetaKeys.Controller, name||target.name, target);
    };
}


export function service(name?:any): ClassDecorator {
    return function (target: Function) {
        Reflect.defineMetadata(MetaKeys.Service, name||target, target);
    };
}

export function task(name?:string): ClassDecorator {
    return function (target: Function) {
        Reflect.defineMetadata(MetaKeys.Task, name||target, target);
    }
}

export function query(schema:joi.SchemaMap, options?:any): MethodDecorator {
    
    let joiSchema = joi.object().keys(schema);
    
    return function (target: any, key: string, descriptor: TypedPropertyDescriptor<Function>) {
        let method = descriptor.value;
        descriptor.value =  async function (ctx: Context, next?: Function) {
            try {
                let query = await validate(joiSchema, ctx.query, options);
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
            
            let body = await ctx.readBody();
            
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

export function params(schema:joi.SchemaMap, shouldThrow:boolean = false): MethodDecorator {
    let joiSchema = joi.object().keys(schema);
    
    return function (target: any, key: string, descriptor: TypedPropertyDescriptor<Function>) {
        let method = descriptor.value;
        descriptor.value =  async function (ctx: Context, next?: Function) {
            
            let params = ctx.params;
            
            try {
                let query = await validate(joiSchema, params);
                ctx.query = query;
            } catch (e) {
                if (shouldThrow) {
                    ctx.throw(400, e.toString());    
                }
                console.error('e', e.toString(), params);
                return next();
            }
            
            return await method.call(this, ctx, next);
        };
    }
}


function validate (schema: joi.Schema, value: any, options:any = {allowUnknown:true}): Promise<any> {
    return new Promise((resolve, reject) => {
       joi.validate(value, schema, options ,(err, value) => {
          if (err) return reject(err);
          resolve(value); 
       });
    });
}