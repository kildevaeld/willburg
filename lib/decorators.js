"use strict";
require('reflect-metadata');
const metadata_1 = require('./metadata');
function defineRoute(method, route) {
    return function (target, key, desc) {
        //console.log(target.constructor)
        let ctor = target.constructor;
        let routes = metadata_1.getService(ctor, metadata_1.ServiceTypes.Route);
        if (!routes)
            routes = [];
        routes.push({
            method: method,
            path: route,
            action: key
        });
        metadata_1.setService(ctor, metadata_1.ServiceTypes.Route, routes);
    };
}
function namespace(path) {
    return function (target) {
        metadata_1.setService(target, metadata_1.ServiceTypes.Namespace, {
            path: path
        });
    };
}
exports.namespace = namespace;
function get(route) {
    return defineRoute('get', route);
}
exports.get = get;
function post(route) {
    return defineRoute('post', route);
}
exports.post = post;
function put(route) {
    return defineRoute('put', route);
}
exports.put = put;
function del(route) {
    return defineRoute('delete', route);
}
exports.del = del;
function patch(route) {
    return defineRoute('patch', route);
}
exports.patch = patch;
function controller(name) {
    return function (target) {
        Reflect.defineMetadata(metadata_1.MetaKeys.Controller, name || target.name, target);
    };
}
exports.controller = controller;
function service(name) {
    return function (target) {
        Reflect.defineMetadata(metadata_1.MetaKeys.Service, name || target.name, target);
    };
}
exports.service = service;
