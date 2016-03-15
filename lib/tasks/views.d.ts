import { ITask, IApp } from '../interfaces';
export declare class Views implements ITask {
    run(app: IApp): Promise<void>;
}
