"use strict";

var _context = require('koa/lib/context');
exports.Context = _context;
/*
Object.assign(_context, {
    get isXHR (): boolean {
        console.log(_context)
        let xhr = this.req.get('X-Requested-With');
        return xhr === 'XMLHttpRequest';
    }
});*/
Object.defineProperties(_context, {
    "isXHR": {
        get: function get() {
            var xhr = this.req.get('X-Requested-With');
            return xhr === 'XMLHttpRequest';
        }
    }
});