"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
class JoiValidator {
    constructor(schema) {
        this.schema = schema;
    }
    validate(value) {
        return new Promise((resolve, reject) => {
            Joi.validate(value, this.schema, { allowUnknown: false }, (err, value) => {
                if (err)
                    return reject(err);
                resolve(value);
            });
        });
    }
}
exports.JoiValidator = JoiValidator;
