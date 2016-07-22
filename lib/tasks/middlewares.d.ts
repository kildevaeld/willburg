import { ITask } from '../interfaces';
import { Willburg } from '../willburg';
export declare class Middlewares implements ITask {
    name: string;
    run(app: Willburg): Promise<void>;
}
