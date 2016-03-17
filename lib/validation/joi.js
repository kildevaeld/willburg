"use strict";

var Joi = require('joi');
class JoiValidator {
    constructor(schema) {
        this.schema = schema;
    }
    validate(value) {
        var _this = this;

        return new Promise(function (resolve, reject) {
            Joi.validate(value, _this.schema, { allowUnknown: false }, function (err, value) {
                if (err) return reject(err);
                resolve(value);
            });
        });
    }
}
exports.JoiValidator = JoiValidator;