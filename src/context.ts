
import * as Koa from 'koa';
import * as i from './interfaces';
import * as formidable from 'formidable'

const _context = require('koa/lib/context');
const parse = require('co-body');

export const Context: i.Context = _context; 

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
        get: function () {
           let xhr = this.req.get('X-Requested-With');
            return xhr === 'XMLHttpRequest'; 
        }
    },
    
    "readBody": {
        value: function (accepts:string[] = ['json', 'urlencoded']): Promise<any> {
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
        value: function (options?): Promise<i.MultipartResult> {
            if (!this.is('multipart/form-data')) {
                throw new Error('not multiform');
            }
            return 
        }  
    },
    
    links: {
        value: function (links) {
            var link = this.response.get('Link') || '';
            if (link) link += ', ';
            return this.response.set('Link', link + Object.keys(links).map(function(rel){
            return '<' + links[rel] + '>; rel="' + rel + '"';
            }).join(', '));
        }
    }
});


function parseFormData (ctx: i.Context): Promise<i.MultipartResult> {
    return new Promise((resolve,reject) => {

           let form = new formidable.IncomingForm();
           form.keepExtensions = true;
           form.parse(ctx.req, (err, fields: formidable.Fields, files: formidable.Files) => {
                if (err) return reject(err);
                resolve({fields,files});
           });

        });
}