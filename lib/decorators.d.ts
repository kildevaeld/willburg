import 'reflect-metadata';
import { MiddlewareFunc } from './interfaces';
import * as joi from 'joi';
export declare const Joi: typeof joi;
export { inject } from 'stick.di';
export declare function namespace(path: string, ...middleware: MiddlewareFunc[]): ClassDecorator;
export declare function get(route: string, ...middleware: MiddlewareFunc[]): MethodDecorator;
export declare function post(route: string, ...middleware: MiddlewareFunc[]): MethodDecorator;
export declare function put(route: string, ...middleware: MiddlewareFunc[]): MethodDecorator;
export declare function del(route: string, ...middleware: MiddlewareFunc[]): MethodDecorator;
export declare function patch(route: string, ...middleware: MiddlewareFunc[]): MethodDecorator;
export declare function use(path: string | MiddlewareFunc, ...middleware: MiddlewareFunc[]): MethodDecorator;
export declare function route(path: string | string[], methods: string | string[], ...middlewares: MiddlewareFunc[]): MethodDecorator;
export declare function options(options: any): ClassDecorator;
export declare function controller(name?: string): ClassDecorator;
export declare function service(name?: any): ClassDecorator;
export declare function task(name?: string): ClassDecorator;
export declare function query(schema: joi.SchemaMap, options?: any, shouldThrow?: boolean): MethodDecorator;
export declare function body(schema: joi.SchemaMap, shouldThrow?: boolean): MethodDecorator;
export declare function params(schema: joi.SchemaMap, shouldThrow?: boolean): MethodDecorator;
