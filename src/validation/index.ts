
import {Context, MiddlewareFunc} from '../interfaces';
import * as Debug from 'debug';

export * from './joi'

const compose = require('koa-compose');
const debug = Debug("willburg:validation");

export enum Parameter {
    Params,
    Query,
    Body
}

export interface IValidator {
    validate(value: any): Promise<any>;
}

export type ValidatorMap = {[key: string]: ValidatorDefinition[]};

export interface ValidatorDefinition {
    validator: IValidator;
    parameter: Parameter;
    shouldThrow: boolean;
    action: string;
}

async function _getValue (ctx: Context, param: Parameter): Promise<any> {
    switch (param) {
        case Parameter.Params: return ctx.params;
        case Parameter.Query: return ctx.query;
        case Parameter.Body: return ctx.readBody();
        default: return null;
    }
}

async function _setValue (ctx: Context, param: Parameter, value: any): Promise<any> {
    switch (param) {
        case Parameter.Params:
            Object.assign(ctx.params, value);
            //ctx.params = value;
            return
        case Parameter.Query:
            Object.assign(ctx.query, value)
            //ctx.query = value;
            return
        case Parameter.Body:
        default: return null;
    }
}

/**
 * Validate wraps a array of middleware, which only a executed, if the request is valid
 * @param  {IValidator}       validator The validator to run
 * @param  {Parameter}        param     Which parameter to validate (url-query, url-parameter or body)
 * @param  {MiddlewareFunc[]} success   Middleware functions to run, if the validator
 * @param  {boolean}          shouldThrow Should throw on invalid, normal behaviour is to skip the middleware stack, and call next
 * @return {MiddlewareFunc}
 */
export function validate(validator:IValidator, param: Parameter, success: MiddlewareFunc[], shouldThrow:boolean = false): MiddlewareFunc {
    return async function (ctx: Context, next: Function) {

        let oldValue = await _getValue(ctx, param);

        if (oldValue == null) ctx.throw(500, `${Parameter[param]} has no value`);

        let value = Object.assign({}, oldValue);

        try {

            debug(`validation '%s' on '%s'`, Parameter[param], ctx.originalUrl);
            let invalid = await validator.validate(value);

            if (invalid instanceof Error) {
                throw invalid;
            }
            
            await _setValue(ctx, param, invalid);
            
           
            
        } catch (e) {
            debug('error while validating "%s" on "%s"', Parameter[param], ctx.originalUrl);
            if (shouldThrow) {
                ctx.throw(400, e.message);
            }
            // Set old value
            await _setValue(ctx, param, null)

            return next();
        }

        return await compose(success)(ctx, next);

    }
}