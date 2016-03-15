"use strict";

require('reflect-metadata');
(function (ServiceTypes) {
    ServiceTypes[ServiceTypes["Controller"] = 0] = "Controller";
    ServiceTypes[ServiceTypes["Route"] = 1] = "Route";
    ServiceTypes[ServiceTypes["Namespace"] = 2] = "Namespace";
    ServiceTypes[ServiceTypes["Service"] = 3] = "Service";
})(exports.ServiceTypes || (exports.ServiceTypes = {}));
var ServiceTypes = exports.ServiceTypes;
exports.MetaKeys = {
    Route: Symbol("route"),
    Controller: Symbol('controller'),
    Namespace: Symbol('namespace'),
    Service: Symbol('service')
};
exports.Factories = {
    Route: Symbol('route::factory'),
    View: Symbol('view::factory')
};
exports.Variables = {
    ViewRoot: Symbol('view::root'),
    ViewEngine: Symbol('view::engine')
};
function isService(target, service) {
    return Reflect.hasOwnMetadata(exports.MetaKeys[ServiceTypes[service]], target);
}
exports.isService = isService;
function getService(target, service) {
    return Reflect.getOwnMetadata(exports.MetaKeys[ServiceTypes[service]], target);
}
exports.getService = getService;
function setService(target, type, service) {
    Reflect.defineMetadata(exports.MetaKeys[ServiceTypes[type]], service, target);
}
exports.setService = setService;