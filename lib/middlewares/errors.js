"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator.throw(value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var send = require('koa-send');
function ErrorHandler(fn) {
    var propagateError = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    return function (ctx, next) {
        return __awaiter(this, void 0, Promise, function* () {
            try {
                yield next();
            } catch (e) {
                var _ret = function () {
                    if (fn) return {
                            v: fn(ctx, e)
                        };
                    var statusCode = e.status || e.statusCode;

                    var _ref = function () {
                        switch (ctx.accepts('json', 'html')) {
                            case "json":
                                return ['application/json', { status: statusCode || 500, error: e.message }];
                            case "html":
                            default:
                                return ['text/html', e.message];
                        }
                    }();

                    var _ref2 = _slicedToArray(_ref, 2);

                    var type = _ref2[0];
                    var data = _ref2[1];

                    if (statusCode == null) {
                        (function () {
                            var app = ctx.app;
                            ctx.res.once('finish', function () {
                                if (propagateError) return app.emit('error', e);
                                throw e;
                            });
                        })();
                    } else {
                        ctx.app.emit('http:error', e);
                    }
                    ctx.status = statusCode || 500;
                    ctx.type = type;
                    ctx.body = data;
                }();

                if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
            }
        });
    };
}
exports.ErrorHandler = ErrorHandler;