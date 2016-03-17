import { Willburg } from '../willburg';
import { ITask } from '../interfaces';
export declare class Runner implements ITask {
    private fns;
    private remove;
    name: string;
    constructor(fns: Function[], remove?: boolean);
    run(app: Willburg): Promise<void>;
}
