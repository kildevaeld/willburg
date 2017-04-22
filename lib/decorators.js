"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const validation_1 = require("./validation");
const metadata_1 = require("./metadata");
const joi = require("joi");
exports.Joi = joi;
var stick_di_1 = require("stick.di");
exports.inject = stick_di_1.inject;
function defineRoute(method, route, middlewares) {
    return function (target, key, desc) {
        middlewares = middlewares || [];
        let ctor = target.constructor;
        let routes = metadata_1.getService(ctor, metadata_1.ServiceTypes.Route);
        if (!routes)
            routes = [];
        routes.push({
            method: method,
            path: route,
            action: key,
            middleware: middlewares
        });
        metadata_1.setService(ctor, metadata_1.ServiceTypes.Route, routes);
    };
}
function namespace(path, ...middleware) {
    return function (target) {
        metadata_1.setService(target, metadata_1.ServiceTypes.Namespace, {
            path: path,
            middleware: middleware
        });
    };
}
exports.namespace = namespace;
function get(route, ...middleware) {
    return defineRoute(['GET'], [route], middleware);
}
exports.get = get;
function post(route, ...middleware) {
    return defineRoute(['POST'], [route], middleware);
}
exports.post = post;
function put(route, ...middleware) {
    return defineRoute(['PUT'], [route], middleware);
}
exports.put = put;
function del(route, ...middleware) {
    return defineRoute(['DELETE'], [route], middleware);
}
exports.del = del;
function patch(route, ...middleware) {
    return defineRoute(['PATCH'], [route], middleware);
}
exports.patch = patch;
function use(path, ...middleware) {
    if (typeof path === 'function') {
        middleware = [path].concat(middleware);
        path = null;
    }
    return defineRoute(['USE'], [path], middleware);
}
exports.use = use;
function route(path, methods, ...middlewares) {
    if (typeof methods === 'string')
        methods = [methods];
    let m = methods;
    m = m.map(e => e.toUpperCase());
    path = Array.isArray(path) ? path : [path];
    methods = Array.isArray(methods) ? methods : [methods];
    return defineRoute(methods, path, middlewares);
}
exports.route = route;
function options(options) {
    return function (target) {
        Reflect.defineMetadata(metadata_1.MetaKeys.Options, options, target);
    };
}
exports.options = options;
function controller(name) {
    return function (target) {
        Reflect.defineMetadata(metadata_1.MetaKeys.Controller, name || target.name, target);
    };
}
exports.controller = controller;
function service(name) {
    return function (target) {
        Reflect.defineMetadata(metadata_1.MetaKeys.Service, name || target, target);
    };
}
exports.service = service;
function task(name) {
    return function (target) {
        Reflect.defineMetadata(metadata_1.MetaKeys.Task, name || target, target);
    };
}
exports.task = task;
/*************************
 *****   Validator   *****
 *************************/
function addValidator(schema, shouldThrow, params) {
    return function (target, key, descriptor) {
        let validations = Reflect.getOwnMetadata(metadata_1.MetaKeys.Validation, target.constructor);
        if (!validations)
            validations = {};
        if (!validations[key])
            validations[key] = [];
        validations[key].push({
            validator: new validation_1.JoiValidator(schema),
            shouldThrow: shouldThrow,
            parameter: params,
            action: key
        });
        Reflect.defineMetadata(metadata_1.MetaKeys.Validation, validations, target.constructor);
    };
}
function query(schema, options, shouldThrow = false) {
    let joiSchema = joi.object().keys(schema);
    return addValidator(joiSchema, shouldThrow, validation_1.Parameter.Query);
}
exports.query = query;
function body(schema, shouldThrow = false) {
    let joiSchema = joi.object().keys(schema);
    return addValidator(joiSchema, shouldThrow, validation_1.Parameter.Body);
}
exports.body = body;
function params(schema, shouldThrow = false) {
    let joiSchema = joi.object().keys(schema);
    return addValidator(joiSchema, shouldThrow, validation_1.Parameter.Params);
}
exports.params = params;
