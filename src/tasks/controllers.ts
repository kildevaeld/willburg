

import {ITask, IApp} from '../interfaces';
import * as fs from 'mz/fs';
import {requireDir} from '../utils';
import * as Debug from 'debug';
import {isService, ServiceTypes} from '../metadata'; 


const debug = Debug('willburg:tasks:controllers');

export class Controllers implements ITask {
  name = 'Controllers';
  path:string;
  async run(app: IApp): Promise<void> {
      let path = app.settings.paths.controllers|| "controllers";
      this.path = path;
      try {
        await requireDir(path, async (mod:any, path:string): Promise<void> => {
            
            if (typeof mod === 'function') {
                if (!isService(mod, ServiceTypes.Controller)) {
                    return debug('Not a controller')
                }
                app.register(mod);
                debug('register controller %s', mod.name)
                
            } else {
                for (let key in mod) {
                    let m = mod[key]
                    if (typeof m === 'symbol') continue;
                    if (!isService(m, ServiceTypes.Controller)) {
                        return debug('not a controller');
                    }
                    
                    app.register(m);
                    debug('register controller %s', m.name)
                }
            }
            
        });
      } catch (e) {
          debug('path %s doest not exists: %s', path, e);
          throw e;
      }
  }
  
  toString (): string {
      return `[Controllers path: ${this.path}]`;
  }
}