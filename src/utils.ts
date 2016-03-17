
import * as fs from 'mz/fs';
import * as Path from 'path';

import {Willburg} from './willburg';
import {isService} from './metadata';

export async function requireDir(path: string, iterator: (mod: any, path?: string) => Promise<any>): Promise<void> {
    if (!Path.isAbsolute(path)) {
        path = Path.resolve(path);
    }
    let files = await fs.readdir(path);
    files.sort();

    for (let i = 0, ii = files.length; i < ii; i++) {
        let fp = Path.join(path, files[i])

        let stat = await fs.stat(fp);
        
        if (stat.isDirectory()) {
            await requireDir(fp, iterator);
            continue;
        }

        let mod = require(fp);
        
        await iterator(mod, fp);

    }

}

export async function processDirectory(path:string, iterator: (fn:Function, key:string, path: string) => any): Promise<number> {
    let found = 0;
    await requireDir(path, async (mod, path) => {
        
        if (typeof mod === 'function') {
            await iterator(mod, null, path);
            found++;
        } else {
            for (let key in mod) {
                if (typeof mod[key] === 'function' ) {
                    await iterator(mod[key], key, path);
                    found++;
                }
            }
        }
    });
    
    return found;
    
} 


/*export async function processDirectory(app:Willburg, path:string): Promise<number> {
    let found = 0;
    await requireDir(path, async (mod, path) => {
        
        if (typeof mod === 'function') {
            if (isService(mod)) {
                app.register(mod);
                found++;
            }
        } else {
            for (let key in mod) {
                if (typeof mod[key] === 'function' && isService(mod[key])) {
                    app.register(mod[key]);
                    found++
                }
            }
        }
    });
    
    return found;
    
} */

export function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}