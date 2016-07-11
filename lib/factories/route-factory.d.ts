import { DIContainer } from 'stick.di';
import { MiddlewareFunc } from '../interfaces';
export interface IRouteFactory {
    (action: string, controllerName: string): MiddlewareFunc;
}
export declare function RouteFactory($container: DIContainer): (action: string, controllerName: string) => MiddlewareFunc;
