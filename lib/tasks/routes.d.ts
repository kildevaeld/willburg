import { ITask, IApp } from '../interfaces';
export declare class Routes implements ITask {
    name: string;
    run(app: IApp): Promise<void>;
}
