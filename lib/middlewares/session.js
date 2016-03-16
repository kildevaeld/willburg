"use strict";

var GenericSession = require('koa-generic-session');
var OptionsKey = Symbol("session::options");
var Convert = require('koa-convert');
function Session() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    return Convert(GenericSession(options));
}
exports.Session = Session;