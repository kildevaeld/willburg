"use strict";

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator.throw(value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var stick_di_1 = require('stick.di');
var metadata_1 = require('../metadata');
var container_1 = require('../container');
var controller_1 = require('../controller');
var Debug = require('debug');
var debug = Debug('willburg:factories:route');
function RouteFactory($container) {
    return function (action, controllerName) {
        var controller;
        return function (ctx, next) {
            return __awaiter(this, void 0, Promise, function* () {
                debug('calling %s on %s', action, controllerName);
                if (!controller) controller = $container.get(controllerName);
                if (controller instanceof controller_1.Controller) {
                    return yield controller.handleRequest(action, ctx, next);
                }
                return yield controller[action].call(controller, ctx, next);
            });
        };
    };
}
exports.RouteFactory = RouteFactory;
stick_di_1.factory()(RouteFactory);
container_1.Container.registerTransient(metadata_1.Factories.Route, RouteFactory);