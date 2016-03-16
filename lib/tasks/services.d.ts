import { ITask, IApp } from '../interfaces';
export declare class Services implements ITask {
    name: string;
    run(app: IApp): Promise<void>;
}
