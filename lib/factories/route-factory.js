"use strict";
const stick_di_1 = require("stick.di");
const metadata_1 = require("../metadata");
const container_1 = require("../container");
const controller_1 = require("../controller");
const Debug = require("debug");
const debug = Debug('willburg:factories:route');
function RouteFactory($container) {
    return function (action, controllerName) {
        var fn;
        return function (ctx, next) {
            debug('calling %s on %s', action, controllerName);
            if (!fn) {
                let controller = $container.get(controllerName);
                if (controller instanceof controller_1.Controller) {
                    fn = (ctx, next) => controller.handleRequest(action, ctx, null, next);
                }
                else {
                    fn = controller[action].bind(controller);
                }
            }
            return fn(ctx, next);
        };
    };
}
exports.RouteFactory = RouteFactory;
stick_di_1.factory()(RouteFactory);
container_1.Container.registerTransient(metadata_1.Factories.Route, RouteFactory);
