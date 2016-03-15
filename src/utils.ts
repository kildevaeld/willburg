
import * as fs from 'mz/fs';
import * as Path from 'path';


export async function requireDir(path: string, iterator: (mod:any, path?: string) => Promise<any>) : Promise<void> {
    if (!Path.isAbsolute(path)) {
        path = Path.resolve(path);
    }
  let files = await fs.readdir(path);
  files.sort();

  for (let i = 0, ii = files.length; i < ii; i++ ) {
    let fp = Path.join(path, files[i])
    let mod = require(fp);

    await iterator(mod, fp);

  }

}

export async function runTasks (): Promise<void> {



}