import { TechCategory } from '../../enums';
import { UserProfile } from '../user';
import { BaseEntity } from '../base.entity';
export interface TechnologyInterface {
    sid: number;
    name: string;
    description: string;
    content: string;
    image: string;
    alt: string;
    category1: TechCategory;
    category2: TechCategory;
    website: string;
    slug: string;
    added_by: number;
    updatedAt: Date;
    createdAt: Date;
}
export declare class Technology extends BaseEntity {
    name: string;
    description: string;
    content: string;
    image: string;
    alt: string;
    category1: TechCategory;
    category2: TechCategory;
    website: string;
    slug: string;
    added_by: UserProfile;
    generateSlug(): void;
}
