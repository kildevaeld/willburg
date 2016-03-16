"use strict";

require('reflect-metadata');
var metadata_1 = require('./metadata');
var stick_di_1 = require('stick.di');
exports.inject = stick_di_1.inject;
exports.autoinject = stick_di_1.autoinject;
function defineRoute(method, route, middlewares) {
    return function (target, key, desc) {
        middlewares = middlewares || [];
        //console.log(target.constructor)
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
            middlewares: middleware
        });
    };
}
exports.namespace = namespace;
function get(route) {
    for (var _len2 = arguments.length, middleware = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        middleware[_key2 - 1] = arguments[_key2];
    }

    return defineRoute('get', route, middleware);
}
exports.get = get;
function post(route) {
    for (var _len3 = arguments.length, middleware = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        middleware[_key3 - 1] = arguments[_key3];
    }

    return defineRoute('post', route, middleware);
}
exports.post = post;
function put(route) {
    for (var _len4 = arguments.length, middleware = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        middleware[_key4 - 1] = arguments[_key4];
    }

    return defineRoute('put', route, middleware);
}
exports.put = put;
function del(route) {
    for (var _len5 = arguments.length, middleware = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
        middleware[_key5 - 1] = arguments[_key5];
    }

    return defineRoute('delete', route, middleware);
}
exports.del = del;
function patch(route) {
    for (var _len6 = arguments.length, middleware = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
        middleware[_key6 - 1] = arguments[_key6];
    }

    return defineRoute('patch', route, middleware);
}
exports.patch = patch;
function use() {
    for (var _len7 = arguments.length, middleware = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        middleware[_key7] = arguments[_key7];
    }

    return defineRoute('use', null, middleware);
}
exports.use = use;
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