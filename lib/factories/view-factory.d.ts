export interface View {
    (path: string, locals?: any, engine?: any): Promise<string>;
}
export declare function ViewFactory(root: string, defaultEngine: string): (path: string, locals?: any, engine?: any) => Promise<string>;
