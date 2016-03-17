
import {Context, MiddlewareFunc} from '../interfaces';
export * from './joi'
const compose = require('koa-compose');

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
            ctx.params = value;
            return
        case Parameter.Query:
            ctx.query = value;
            return
        case Parameter.Body: //return ctx.readBody();
        default: return null;
    }
}

export function validate(validator:IValidator, param: Parameter, success: MiddlewareFunc[], shouldThrow:boolean = false): MiddlewareFunc {
    return async function (ctx: Context, next: Function) {
          
        let oldValue = await _getValue(ctx, param);
        
        if (oldValue == null) ctx.throw(500);
        
        let value = Object.assign({}, oldValue);
        
        try {
            
            let invalid = await validator.validate(value);
            
            if (invalid instanceof Error) {
                throw invalid;       
            }
            
        } catch (e) {
            console.log(e);
            if (shouldThrow) {
                ctx.throw(400, e.message);
            }
            await _setValue(ctx, param, null)
            return next();
        }
        
        return await compose(success)(ctx, next); 
        
    }
}