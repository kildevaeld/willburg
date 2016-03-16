
import * as Koa from 'koa';
import * as i from './interfaces';
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
    }
});
