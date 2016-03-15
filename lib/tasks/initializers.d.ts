import { ITask, IApp } from '../interfaces';
export declare class Initializers implements ITask {
    run(app: IApp): Promise<void>;
}
