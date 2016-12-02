
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
        var fn: MiddlewareFunc;
        return function(ctx: Context, next?: () => Promise<any>): Promise<any> {
            debug('calling %s on %s', action, controllerName);
            if (!fn) {
                let controller = $container.get(controllerName);

                if (controller instanceof Controller) {
                    fn = (ctx, next) => controller.handleRequest(action, ctx, next);
                } else {
                    fn = controller[action].bind(controller);
                }
            }
                
            return fn(ctx, next);
            
        };
    };
}

factory()(RouteFactory);
Container.registerTransient(Factories.Route, RouteFactory);