import {Willburg} from './willburg';
import {ITask} from './interfaces';
import * as Debug from 'debug';

const debug = Debug('willburg:bootstrap');

export class Bootstrap {
    _tasks: ITask[] = [];
    get length(): number {
        return this._tasks.length;
    }

    constructor(private app: Willburg) { }

    add(task:ITask|ITask[],...tasks: ITask[]) {
        if (!Array.isArray(task)) task = [<ITask>task];
        tasks = (<ITask[]>task).concat(tasks);
        for (let i = 0, ii = tasks.length; i < ii; i++) {
            debug('add tasks %s', tasks[i].name||tasks[i]);
            this._tasks.push(tasks[i]);
        }
        return this;
    }

    async run(): Promise<void> {
        while (this.length > 0) {
            let task = this._tasks.shift();
            debug('run task %s', task.name||task);
            await task.run(this.app);
        }
        Object.freeze(this);
    }

}