
import {DIContainer, factory} from 'stick.di'
import {MiddlewareFunc} from '../interfaces';
import {Factories} from '../metadata'
import * as Koa from 'koa';
import {Container} from '../container';

import * as Debug from 'debug';

const debug = Debug('willburg:factories:route')

export function RouteFactory ( $container: DIContainer) {
    return function (action: string, controllerName:string): MiddlewareFunc {
        return async function(ctx: Koa.Context, next?: Function): Promise<any> {
            debug('calling %s on %s', action, controllerName);
            let controller = $container.get(controllerName); 
            return await controller[action].call(controller, ctx, next);
        };
    };
}

factory()(RouteFactory);
Container.registerTransient(Factories.Route, RouteFactory);