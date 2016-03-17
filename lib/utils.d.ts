export declare function requireDir(path: string, iterator: (mod: any, path?: string) => Promise<any>): Promise<void>;
export declare function processDirectory(path: string, iterator: (fn: Function, key: string, path: string) => any): Promise<number>;
export declare function flatten(arr: any): any;
