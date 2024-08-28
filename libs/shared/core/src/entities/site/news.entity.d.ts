import { UserProfile } from '../user';
import { BaseEntity } from '../base.entity';
export interface NewsInterface {
    sid: number;
    name: string;
    description: string;
    content: string;
    image: string;
    alt: string;
    slug: string;
}
export declare class News extends BaseEntity {
    name: string;
    description: string;
    content: string;
    image: string;
    alt: string;
    slug: string;
    added_by: UserProfile;
    slugify(): Promise<void>;
}
