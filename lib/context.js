"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formidable = require("formidable");
const _context = require('koa/lib/context');
const parse = require('co-body');
const send = require('koa-send');
exports.Context = _context;
Object.defineProperties(_context, {
    "isXHR": {
        get: function () {
            let xhr = this.get('X-Requested-With');
            return xhr === 'XMLHttpRequest';
        }
    },
    "readBody": {
        value: function (accepts = ['json', 'urlencoded']) {
            if (this.__cached_body)
                return this.__cached_body === true ? null : this.__cached_body;
            let out = null;
            switch (this.is(accepts)) {
                case 'json':
                    out = parse.json(this);
                    break;
                case 'urlencoded':
                    out = parse.form(this.req);
                    break;
            }
            return out == null ? null : out.then(e => {
                this.__cached_body = e == null ? true : e;
                return e;
            });
        }
    },
    "readForm": {
        value: function (options) {
            if (!this.is('multipart/form-data')) {
                throw new Error('not multiform');
            }
            return parseFormData(this);
        }
    },
    links: {
        value: function (links) {
            var link = this.response.get('Link') || '';
            if (link)
                link += ', ';
            return this.response.set('Link', link + Object.keys(links).map(function (rel) {
                return '<' + links[rel] + '>; rel="' + rel + '"';
            }).join(', '));
        }
    },
    send: {
        value: function (path, options) {
            return send(this, path, options);
        }
    }
});
function parseFormData(ctx) {
    return new Promise((resolve, reject) => {
        let form = new formidable.IncomingForm();
        form.keepExtensions = true;
        form.parse(ctx.req, (err, fields, files) => {
            if (err)
                return reject(err);
            resolve({ fields, files });
        });
    });
}
