
import {EventEmitter} from 'events';
import {MiddlewareFunc, Context} from '../interfaces';
import {resolve} from 'path';

const GenericSession = require('koa-generic-session');
const OptionsKey = Symbol("session::options");
const Convert = require('koa-convert');

export type SessionObject = {[key: string]: any };

export interface SessionStore extends EventEmitter {
    get(sid:any): Promise<SessionObject>;
    set(): Promise<void>;
    destroy(): Promise<void>;
}

export interface SessionOptions  {
    key?: string;
    prefix?: string;
    store?: SessionStore;
}

export function Session (options:SessionOptions = {}): MiddlewareFunc {
    return Convert(GenericSession(options));
}