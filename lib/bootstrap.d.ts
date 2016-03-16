import { Willburg } from './willburg';
import { ITask } from './interfaces';
export declare class Bootstrap {
    private app;
    _tasks: ITask[];
    length: number;
    constructor(app: Willburg);
    push(task: ITask | ITask[], ...tasks: ITask[]): this;
    pushFront(task: ITask | ITask[], ...tasks: ITask[]): this;
    run(): Promise<void>;
}
