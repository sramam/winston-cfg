import * as winston from 'winston';
export declare type Fn = (level: string, msg: string, meta: any) => void;
export interface Config {
    level?: string;
    id?: string;
    emitErrs?: boolean;
    stripColors?: boolean;
    exitOnError?: boolean;
    padLevels?: boolean;
    transports?: any[];
    levels?: winston.AbstractConfigSetLevels;
    colors?: string[];
    rewriters?: Fn[];
    filters?: winston.MetadataFilter[];
}
export declare function winstonCfg(transportMap?: {}, defaultCfg?: Config): any;
