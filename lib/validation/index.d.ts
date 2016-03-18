import { MiddlewareFunc } from '../interfaces';
export * from './joi';
export declare enum Parameter {
    Params = 0,
    Query = 1,
    Body = 2,
}
export interface IValidator {
    validate(value: any): Promise<any>;
}
export declare type ValidatorMap = {
    [key: string]: ValidatorDefinition[];
};
export interface ValidatorDefinition {
    validator: IValidator;
    parameter: Parameter;
    shouldThrow: boolean;
    action: string;
}
/**
 * Validate wraps a array of middleware, which only a executed, if the request is valid
 * @param  {IValidator}       validator The validator to run
 * @param  {Parameter}        param     Which parameter to validate (url-query, url-parameter or body)
 * @param  {MiddlewareFunc[]} success   Middleware functions to run, if the validator
 * @param  {boolean}          shouldThrow Should throw on invalid, normal behaviour is to skip the middleware stack, and call next
 * @return {MiddlewareFunc}
 */
export declare function validate(validator: IValidator, param: Parameter, success: MiddlewareFunc[], shouldThrow?: boolean): MiddlewareFunc;
