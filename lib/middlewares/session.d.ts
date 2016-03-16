import { EventEmitter } from 'events';
import { MiddlewareFunc } from '../interfaces';
export declare type SessionObject = {
    [key: string]: any;
};
export interface SessionStore extends EventEmitter {
    get(sid: any): Promise<SessionObject>;
    set(): Promise<void>;
    destroy(): Promise<void>;
}
export interface SessionOptions {
    key?: string;
    prefix?: string;
    store?: SessionStore;
}
export declare function Session(options?: SessionOptions): MiddlewareFunc;
