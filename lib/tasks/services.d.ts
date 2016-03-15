import { ITask, IApp } from '../interfaces';
export declare class Services implements ITask {
    run(app: IApp): Promise<void>;
}
