

import {Willburg} from '../willburg';
import {ITask, IApp} from '../interfaces';
import * as fs from 'mz/fs';
import {resolve} from 'path';
import {requireDir, processDirectory} from '../utils';
import * as Debug from 'debug';
import {isService, ServiceTypes, Variables} from '../metadata';


const debug = Debug('willburg:tasks:runner');

export class Runner implements ITask {
    name = "Runner";
   
    constructor(private fns: Function[], private remove: boolean = false) { 
       
    }
    
    async run(app: Willburg): Promise<void> {
        
        for (let i = 0, ii = this.fns.length; i < ii; i++ ) {
           let fn = this.fns[i];
           if (!fn) continue;
           debug('running %s', fn.name)
           let ret = app.container.get(fn);
           
           if (ret && isService(fn, ServiceTypes.Task)) {
               app.boot.pushFront(ret);
           }
           
           if (this.remove) {
               app.container.unregister(fn);
           }
           
        }
        
        
    }
}