


import {ITask, IApp} from '../interfaces';
import * as fs from 'mz/fs';
import {requireDir} from '../utils';
import * as Debug from 'debug';
import {isService, ServiceTypes} from '../metadata'; 


const debug = Debug('willburg:tasks:services');

export class Services implements ITask {
  async run(app: IApp): Promise<void> {
      let path = app.settings.paths.services|| "services";
      
      try {
        await requireDir(path, async (mod:any, path:string): Promise<void> => {
           
            if (typeof mod === 'function') {
                if (!isService(mod, ServiceTypes.Service)) {
                    return debug('Not a Service')
                }
                
                app.register(mod);
                
            } else {
                for (let key in mod) {
                    let m = mod[key]
                   
                    if (typeof m === 'symbol') continue;
                    if (!isService(m, ServiceTypes.Service)) {
                        return debug('not a service');
                    }
                    
                    app.register(m);
                }
            }
            
        });
      } catch (e) {
          debug('path %s doest not exists: %s', path, e);
          throw e;
      }
  }
}