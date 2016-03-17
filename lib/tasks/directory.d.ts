import { Willburg } from '../willburg';
import { ITask } from '../interfaces';
export declare class Directory implements ITask {
    name: string;
    paths: string[];
    constructor(...paths: string[]);
    run(app: Willburg): Promise<void>;
}
