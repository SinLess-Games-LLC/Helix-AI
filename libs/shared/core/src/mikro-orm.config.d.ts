import { Options } from '@mikro-orm/core';
export type { Options as DatabaseOptions } from '@mikro-orm/core';
export declare class MikroORMConfig {
    private options;
    orm: any;
    entityManager: any;
    constructor(options: Options);
}
