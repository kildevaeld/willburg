"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const stick_di_1 = require('stick.di');
const metadata_1 = require('../metadata');
const container_1 = require('../container');
function RouteFactory($container) {
    return function (action, controllerName) {
        return function (ctx, next) {
            return __awaiter(this, void 0, Promise, function* () {
                let controller = $container.get(controllerName);
                return yield controller[action].call(controller, ctx, next);
            });
        };
    };
}
exports.RouteFactory = RouteFactory;
stick_di_1.factory()(RouteFactory);
container_1.Container.registerTransient(metadata_1.Factories.RouteFactory, RouteFactory);
