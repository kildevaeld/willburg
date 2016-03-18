"use strict";

var formidable = require('formidable');
var _context = require('koa/lib/context');
var parse = require('co-body');
exports.Context = _context;
Object.defineProperties(_context, {
    "isXHR": {
        get: function get() {
            var xhr = this.req.get('X-Requested-With');
            return xhr === 'XMLHttpRequest';
        }
    },
    "readBody": {
        value: function value() {
            var accepts = arguments.length <= 0 || arguments[0] === undefined ? ['json', 'urlencoded'] : arguments[0];

            switch (this.is(accepts)) {
                case 'json':
                    return parse.json(this.req);
                case 'urlencoded':
                    return parse.form(this.req);
            }
            return null;
        }
    },
    "readForm": {
        value: function value(options) {
            if (!this.is('multipart/form-data')) {
                throw new Error('not multiform');
            }
            return;
        }
    },
    links: {
        value: function value(links) {
            var link = this.response.get('Link') || '';
            if (link) link += ', ';
            return this.response.set('Link', link + Object.keys(links).map(function (rel) {
                return '<' + links[rel] + '>; rel="' + rel + '"';
            }).join(', '));
        }
    }
});
function parseFormData(ctx) {
    return new Promise(function (resolve, reject) {
        var form = new formidable.IncomingForm();
        form.keepExtensions = true;
        form.parse(ctx.req, function (err, fields, files) {
            if (err) return reject(err);
            resolve({ fields: fields, files: files });
        });
    });
}