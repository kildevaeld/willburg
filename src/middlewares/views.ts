
import {MiddlewareFunc, Context} from '../interfaces';
import {resolve} from 'path';

const send = require('koa-send')

export interface ViewOptions {
    root?: string;
}



export function View (root: string) {
    
}