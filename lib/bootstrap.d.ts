import { Willburg } from './willburg';
import { ITask } from './interfaces';
export declare class Bootstrap {
    private app;
    private _tasks;
    private _frozen;
    private _running;
    readonly length: number;
    constructor(app: Willburg);
    push(task: ITask | ITask[], ...tasks: ITask[]): this;
    pushFront(task: ITask | ITask[], ...tasks: ITask[]): this;
    run(): Promise<void>;
    runParallel(): Promise<void>;
}
