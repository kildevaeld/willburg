
import {DIContainer, factory} from 'stick.di'
import {MiddlewareFunc} from '../interfaces';
import {Factories, Variables} from '../metadata'
import * as Koa from 'koa';
import * as Path from 'path'
import * as fs from 'mz/fs';
import {Container} from '../container';

const consolidate = require('consolidate');

const toFile = (fileName, ext) => `${fileName}.${ext}`;

function getPaths(abs, rel, ext): Promise<{rel:string, abs: string}> {
  return fs.stat(Path.join(abs, rel)).then((stats) => {
    if (stats.isDirectory()) {
      // a directory
      return {
        rel: Path.join(rel, toFile('index', ext)),
        abs: Path.join(abs, Path.dirname(rel), rel)
      }
    }

    // a file
    return {
      rel,
      abs
    }
  })
  .catch((e) => {
    // not a valid file/directory
    if (!Path.extname(rel)) {
      // Template file has been provided without extension
      // so append to it to try another lookup
      return getPaths(abs, `${rel}.${ext}`, ext)
    }

    throw e
  });
}

export interface View {
    (path: string, locals?: any, engine?: any): Promise<string>;
}

export function ViewFactory ( root: string, defaultEngine: string ) {
    
    root = Path.resolve(root);
    
    return async function (path: string, locals: any = {}, engine?:any): Promise<string> {
        
        let ext = (Path.extname(path) || '.' +(engine||defaultEngine)).slice(1);
        let {rel, abs} = await getPaths(root, path, ext);
        
        let fp = Path.resolve(abs, rel);
        
        if (ext === 'html') {
            let str = await  fs.readFile(fp, 'utf8');
            return str;
        } else {
            engine = ext;
            // Implement engine/ext map
            return await consolidate[engine](fp, locals); 
        }
    };
}

(<any>ViewFactory).inject = [Variables.ViewRoot, Variables.ViewEngine];
factory()(ViewFactory);
Container.registerTransient(Factories.View, ViewFactory);