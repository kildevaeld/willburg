
import {ITask, IApp} from '../interfaces';
import * as fs from 'mz/fs';
import {requireDir} from '../utils';
import * as Debug from 'debug';

const debug = Debug('willburg:tasks:initializers');

export class Initializers implements ITask {
 name = "Initializers";
  async run(app: IApp): Promise<void> {
      
      let path = app.settings.paths.initializers|| "initializers";
      
      let fns : Function[] = [];
      try {
        await requireDir(path, async (mod:any, path:string): Promise<void> => {
            if (typeof mod === 'function') {
                debug('running initializer %s', path)
                await mod(app);
            } else {
                for (let k in mod) {
                    if (typeof mod[k] === 'function') {
                        await mod[k](app);
                    }
                }
            }
            
        });
      } catch (e) {
          
          if (e.code == 'ENOENT') {
             debug('path %s doest not exists: %s', path, e);
             return;
          }
          throw e;
      }
  }
}