"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
const Debug = require('debug');
__export(require('./joi'));
const compose = require('koa-compose');
const debug = Debug("willburg:validation");
(function (Parameter) {
    Parameter[Parameter["Params"] = 0] = "Params";
    Parameter[Parameter["Query"] = 1] = "Query";
    Parameter[Parameter["Body"] = 2] = "Body";
})(exports.Parameter || (exports.Parameter = {}));
var Parameter = exports.Parameter;
function _getValue(ctx, param) {
    return __awaiter(this, void 0, Promise, function* () {
        switch (param) {
            case Parameter.Params: return ctx.params;
            case Parameter.Query: return ctx.query;
            case Parameter.Body: return ctx.readBody();
            default: return null;
        }
    });
}
function _setValue(ctx, param, value) {
    return __awaiter(this, void 0, Promise, function* () {
        switch (param) {
            case Parameter.Params:
                Object.assign(ctx.params, value);
                //ctx.params = value;
                return;
            case Parameter.Query:
                Object.assign(ctx.query, value);
                //ctx.query = value;
                return;
            case Parameter.Body:
            default: return null;
        }
    });
}
/**
 * Validate wraps a array of middleware, which only a executed, if the request is valid
 * @param  {IValidator}       validator The validator to run
 * @param  {Parameter}        param     Which parameter to validate (url-query, url-parameter or body)
 * @param  {MiddlewareFunc[]} success   Middleware functions to run, if the validator
 * @param  {boolean}          shouldThrow Should throw on invalid, normal behaviour is to skip the middleware stack, and call next
 * @return {MiddlewareFunc}
 */
function validate(validator, param, success, shouldThrow = false) {
    return function (ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let oldValue = yield _getValue(ctx, param);
            if (oldValue == null)
                ctx.throw(500, `${Parameter[param]} has no value`);
            let value = Object.assign({}, oldValue);
            if (ctx.matched) {
                if (param === Parameter.Params && ctx.matched.length) {
                    // Get the last match
                    let match = ctx.matched[ctx.matched.length - 1];
                    value = match.params(ctx.path, ctx.captures, {});
                }
            }
            try {
                debug(`validation '%s' on '%s': %j`, Parameter[param], ctx.originalUrl, value);
                let invalid = yield validator.validate(value);
                if (invalid instanceof Error) {
                    throw invalid;
                }
                yield _setValue(ctx, param, invalid);
            }
            catch (e) {
                debug('error while validating "%s" on "%s": %s', Parameter[param], ctx.originalUrl, e.message);
                if (shouldThrow) {
                    ctx.throw(400, e.message);
                }
                // Set old value
                yield _setValue(ctx, param, null);
                return next();
            }
            return yield compose(success)(ctx, next);
        });
    };
}
exports.validate = validate;
