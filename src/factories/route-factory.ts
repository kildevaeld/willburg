
import {DIContainer, factory} from 'stick.di'
import {MiddlewareFunc, Context} from '../interfaces';
import {Factories} from '../metadata'
import * as Koa from 'koa';
import {Container} from '../container';
import {Controller} from '../controller';

import * as Debug from 'debug';

const debug = Debug('willburg:factories:route')

export interface IRouteFactory {
    (action: string, controllerName: string): MiddlewareFunc;
}

export function RouteFactory ( $container: DIContainer) {
    return function (action: string, controllerName:string): MiddlewareFunc {
        var controller;
        return async function(ctx: Context, next?: Function): Promise<any> {
            debug('calling %s on %s', action, controllerName);
            if (!controller)
                controller = $container.get(controllerName);
            if (controller instanceof Controller) {
                return await controller.handleRequest(action, ctx, next);
            } 
            return await controller[action].call(controller, ctx, next);
        };
    };
}

factory()(RouteFactory);
Container.registerTransient(Factories.Route, RouteFactory);