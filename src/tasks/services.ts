

import {Willburg} from '../willburg';
import {ITask, IApp} from '../interfaces';
import * as fs from 'mz/fs';
import {resolve} from 'path';
import {requireDir, processDirectory} from '../utils';
import * as Debug from 'debug';
import {isService, ServiceTypes, Variables} from '../metadata';


const debug = Debug('willburg:tasks:directory');

export class Directory implements ITask {
    name = "Services";
    paths: string[];
    constructor(...paths: string[]) {
        this.paths = paths;
    }

    async run(app: Willburg): Promise<void> {

        for (let i = 0, ii = this.paths.length; i < ii; i++) {
            debug('loading directory: %s', this.paths[i]);
            try {
                let found = await processDirectory(this.paths[i], async (mod, name, path) => {
                    if (isService(mod)) {
                        app.register(mod);
                    } 
                });


            } catch (e) {
                if (e.code == 'ENOENT') {
                    debug('path %s doest not exists', this.paths[i]);
                    continue;
                }
                debug("Error %s in %s", e, e.path, this.paths[i])
                throw e;
            }
        }

    }
}