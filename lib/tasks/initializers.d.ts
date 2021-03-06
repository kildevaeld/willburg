import { ITask, IApp } from '../interfaces';
export declare class Initializers implements ITask {
    name: string;
    run(app: IApp): Promise<void>;
}
