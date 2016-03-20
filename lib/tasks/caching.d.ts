import { ITask } from '../interfaces';
import { Willburg } from '../';
export declare class Caching implements ITask {
    name: string;
    run(app: Willburg): Promise<void>;
}
