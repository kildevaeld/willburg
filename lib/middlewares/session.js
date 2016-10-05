"use strict";
const GenericSession = require('koa-generic-session');
const OptionsKey = Symbol("session::options");
const Convert = require('koa-convert');
function Session(options = {}) {
    return Convert(GenericSession(options));
}
exports.Session = Session;
