import { ITask, IApp } from '../interfaces';
export declare class Controllers implements ITask {
    run(app: IApp): Promise<void>;
}
