
import {IValidator} from './';
import {Context} from '../'
import * as Joi from 'joi'

export class JoiValidator implements IValidator {    
    constructor(private schema: Joi.Schema) {}
    
    validate(value:any): Promise<any> {
        return new Promise((resolve, reject) => {
            Joi.validate(value, this.schema, {allowUnknown:false} , (err, value) => {
                if (err) return reject(err);
                resolve(value); 
            });
        });
    }
    
}