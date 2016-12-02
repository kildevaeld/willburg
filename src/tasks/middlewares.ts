
import {ITask} from '../interfaces';
import {Willburg} from '../willburg'
import * as middlewares from '../middlewares';

import * as Debug from 'debug';


const debug = Debug('willburg:tasks:middlewares');

export class Middlewares implements ITask {
  name = "Middlewares";
  async run(app: Willburg): Promise<void> {
      
      for (let key of ['ErrorHandler', 'Session']) {
      		if (key == 'Session' && !app.options.session) {
            debug('skipping session middleware')
            continue;
          }
          
          let opts = app.settings.middlewares[key.toLowerCase()];
          debug('injecting middleware: %s: %j', key.toLowerCase(), opts||{});
          app.use(middlewares[key](opts));
      }

  }
}
