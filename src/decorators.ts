
import 'reflect-metadata';
import {MiddlewareFunc, Context, ITask} from './interfaces';
import {Parameter, ValidatorDefinition, ValidatorMap, JoiValidator} from './validation';
import {MetaKeys, setService, ServiceTypes, getService, RouteDefinition} from './metadata';

import * as joi from 'joi';

export const Joi = joi;

export {inject} from 'stick.di';

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

/*************************
 *****   Validator   *****
 *************************/

function addValidator(schema:joi.Schema, shouldThrow: boolean, params: Parameter): MethodDecorator {
    return function (target: any, key: string, descriptor: TypedPropertyDescriptor<Function>) {

        let validations: ValidatorMap = Reflect.getOwnMetadata(MetaKeys.Validation, target.constructor);

        if (!validations) validations = {};

        if (!validations[key]) validations[key] = [];

        validations[key].push({
            validator: new JoiValidator(schema),
            shouldThrow: shouldThrow,
            parameter: params,
            action: key
        });

        Reflect.defineMetadata(MetaKeys.Validation, validations, target.constructor);
    }
}

export function query(schema: joi.SchemaMap, options?: any, shouldThrow: boolean = false): MethodDecorator {
  let joiSchema = joi.object().keys(schema);
  return addValidator(joiSchema, shouldThrow, Parameter.Query);
}

export function body(schema: joi.SchemaMap, shouldThrow: boolean = false): MethodDecorator {
  let joiSchema = joi.object().keys(schema);
  return addValidator(joiSchema, shouldThrow, Parameter.Body);
}

export function params(schema:joi.SchemaMap, shouldThrow:boolean = false): MethodDecorator {
    let joiSchema = joi.object().keys(schema);
    return addValidator(joiSchema, shouldThrow, Parameter.Params);
}
