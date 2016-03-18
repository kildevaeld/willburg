"use strict";

require('reflect-metadata');
var validation_1 = require('./validation');
var metadata_1 = require('./metadata');
var joi = require('joi');
exports.Joi = joi;
var stick_di_1 = require('stick.di');
exports.inject = stick_di_1.inject;
exports.autoinject = stick_di_1.autoinject;
function defineRoute(method, route, middlewares) {
    return function (target, key, desc) {
        middlewares = middlewares || [];
        var ctor = target.constructor;
        var routes = metadata_1.getService(ctor, metadata_1.ServiceTypes.Route);
        if (!routes) routes = [];
        routes.push({
            method: method,
            path: route,
            action: key,
            middleware: middlewares
        });
        metadata_1.setService(ctor, metadata_1.ServiceTypes.Route, routes);
    };
}
function namespace(path) {
    for (var _len = arguments.length, middleware = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        middleware[_key - 1] = arguments[_key];
    }

    return function (target) {
        metadata_1.setService(target, metadata_1.ServiceTypes.Namespace, {
            path: path,
            middleware: middleware
        });
    };
}
exports.namespace = namespace;
function get(route) {
    for (var _len2 = arguments.length, middleware = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        middleware[_key2 - 1] = arguments[_key2];
    }

    return defineRoute(['GET'], [route], middleware);
}
exports.get = get;
function post(route) {
    for (var _len3 = arguments.length, middleware = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        middleware[_key3 - 1] = arguments[_key3];
    }

    return defineRoute(['POST'], [route], middleware);
}
exports.post = post;
function put(route) {
    for (var _len4 = arguments.length, middleware = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        middleware[_key4 - 1] = arguments[_key4];
    }

    return defineRoute(['PUT'], [route], middleware);
}
exports.put = put;
function del(route) {
    for (var _len5 = arguments.length, middleware = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
        middleware[_key5 - 1] = arguments[_key5];
    }

    return defineRoute(['DELETE'], [route], middleware);
}
exports.del = del;
function patch(route) {
    for (var _len6 = arguments.length, middleware = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
        middleware[_key6 - 1] = arguments[_key6];
    }

    return defineRoute(['PATCH'], [route], middleware);
}
exports.patch = patch;
function use(path) {
    for (var _len7 = arguments.length, middleware = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
        middleware[_key7 - 1] = arguments[_key7];
    }

    if (typeof path === 'function') {
        middleware = [path].concat(middleware);
        path = null;
    }
    return defineRoute(['USE'], [path], middleware);
}
exports.use = use;
function route(path, methods) {
    if (typeof methods === 'string') methods = [methods];
    var m = methods;
    m = m.map(function (e) {
        return e.toUpperCase();
    });
    path = Array.isArray(path) ? path : [path];
    methods = Array.isArray(methods) ? methods : [methods];

    for (var _len8 = arguments.length, middlewares = Array(_len8 > 2 ? _len8 - 2 : 0), _key8 = 2; _key8 < _len8; _key8++) {
        middlewares[_key8 - 2] = arguments[_key8];
    }

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
        var validations = Reflect.getOwnMetadata(metadata_1.MetaKeys.Validation, target.constructor);
        if (!validations) validations = {};
        if (!validations[key]) validations[key] = [];
        validations[key].push({
            validator: new validation_1.JoiValidator(schema),
            shouldThrow: shouldThrow,
            parameter: params,
            action: key
        });
        Reflect.defineMetadata(metadata_1.MetaKeys.Validation, validations, target.constructor);
    };
}
function query(schema, options) {
    var shouldThrow = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    var joiSchema = joi.object().keys(schema);
    return addValidator(joiSchema, shouldThrow, validation_1.Parameter.Query);
}
exports.query = query;
function body(schema) {
    var shouldThrow = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    var joiSchema = joi.object().keys(schema);
    return addValidator(joiSchema, shouldThrow, validation_1.Parameter.Body);
}
exports.body = body;
function params(schema) {
    var shouldThrow = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    var joiSchema = joi.object().keys(schema);
    return addValidator(joiSchema, shouldThrow, validation_1.Parameter.Params);
}
exports.params = params;