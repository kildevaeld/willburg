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
export declare function validate(validator: IValidator, param: Parameter, success: MiddlewareFunc[], shouldThrow?: boolean): MiddlewareFunc;
