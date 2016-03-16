import { ITask, IApp } from '../interfaces';
export declare class Views implements ITask {
    name: string;
    run(app: IApp): Promise<void>;
}
