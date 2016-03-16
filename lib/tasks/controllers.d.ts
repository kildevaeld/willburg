import { ITask, IApp } from '../interfaces';
export declare class Controllers implements ITask {
    name: string;
    path: string;
    run(app: IApp): Promise<void>;
    toString(): string;
}
