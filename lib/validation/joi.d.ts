import { IValidator } from './';
import * as Joi from 'joi';
export declare class JoiValidator implements IValidator {
    private schema;
    constructor(schema: Joi.Schema);
    validate(value: any): Promise<any>;
}
