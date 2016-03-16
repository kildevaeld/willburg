import { ITask, IApp } from '../interfaces';
export declare class Middlewares implements ITask {
    name: string;
    run(app: IApp): Promise<void>;
}
