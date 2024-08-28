import { BaseEntity } from '../base.entity';
export declare class Image extends BaseEntity {
    fileName: string;
    basePath?: string;
    url: string;
    size: number;
    tags: string[];
    hash: string;
    deleteHash: string;
}
