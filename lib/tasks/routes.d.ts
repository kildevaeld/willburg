import { ITask, IApp } from '../interfaces';
export declare class Routes implements ITask {
    run(app: IApp): Promise<void>;
}
