import { DIContainer } from 'stick.di';
import { MiddlewareFunc } from '../interfaces';
export declare function RouteFactory($container: DIContainer): (action: string, controllerName: string) => MiddlewareFunc;
