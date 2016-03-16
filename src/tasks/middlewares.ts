
import {ITask, IApp} from '../interfaces';
import * as middlewares from '../middlewares';

import * as Debug from 'debug';


const debug = Debug('willburg:tasks:middlewares');

export class Middlewares implements ITask {
  name = "Middlewares";
  async run(app: IApp): Promise<void> {
      
      for (let key of ['ErrorHandler']) {
          
          let opts = app.settings.middlewares[key];
          debug('injecting middleware: %s: %j', key.toLowerCase(), opts);
          app.use(middlewares[key](opts));
      }

  }
}