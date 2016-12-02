

import {ITask, IApp} from '../interfaces';
import * as fs from 'mz/fs';
import {requireDir} from '../utils';
import * as Debug from 'debug';

const debug = Debug('willburg:tasks:routes');

export class Routes implements ITask {
    name = "Routes";
    async run(app: IApp): Promise<void> {
        let path = app.settings.paths.routes || "routes";

        try {
            await requireDir(path, async (mod: any, path: string): Promise<void> => {
                if (typeof mod === 'function') {
                    await mod(app.router, app);
                } else {
                    for (let k in mod) {
                        if (typeof mod[k] === 'function') {
                            await mod[k](app.router, app);
                        }
                    }
                }

            });
        } catch (e) {
            if (e.code == 'ENOENT') {
             debug('path %s doest not exists', path);
             return;
            }
            
            throw e;
        }
    }
}