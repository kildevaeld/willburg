
import {ITask, IApp} from '../interfaces';
import * as fs from 'mz/fs';
import {requireDir} from '../utils';
import * as Debug from 'debug';
import {Willburg} from '../';
const debug = Debug('willburg:tasks:initializers');

const etag = require('koa-etag');
const conditional = require('koa-conditional-get');
const convert = require('koa-convert');

export class Caching implements ITask {
 name = "Caching";
  async run(app: Willburg): Promise<void> {
      
      if (app.env !== 'development') {
          app.use(convert(conditional()));
          app.use(etag());
      }
  }
}