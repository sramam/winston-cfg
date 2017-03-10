export declare type Fn = (level: string, msg: string, meta: any) => void;
export interface Config {
    level?: string;
    id?: string;
    emitErrs?: boolean;
    stripColors?: boolean;
    exitOnError?: boolean;
    padLevels?: boolean;
    transports?: any[];
    levels?: string[];
    colors?: string[];
    rewriters?: Fn[];
    filters?: Fn[];
}
export declare function winstonCfg(transportMap?: {}, defaultCfg?: Config): any;
