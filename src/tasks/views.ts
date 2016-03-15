
import {ITask, IApp} from '../interfaces';
import * as fs from 'mz/fs';
import {resolve} from 'path';
import {requireDir} from '../utils';
import * as Debug from 'debug';
import {isService, ServiceTypes,  Variables} from '../metadata'; 


const debug = Debug('willburg:tasks:views');

export class Views implements ITask {
  async run(app: IApp): Promise<void> {
      let path = app.settings.paths.views|| "views";
      path = resolve(path);
      
      app.container.registerInstance(Variables.ViewRoot, path);
      app.container.registerInstance(Variables.ViewEngine, 'html');
      
  }
}