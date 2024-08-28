import { UserProfile } from '../user';
import { BaseEntity } from '../base.entity';
export interface MicroserviceInterface {
    sid: number;
    name: string;
    description: string;
    content: string;
    image: string;
    alt: string;
    added_by: number;
    slug: string;
}
export declare class Microservice extends BaseEntity {
    name: string;
    description: string;
    content: string;
    image: string;
    alt: string;
    added_by: UserProfile;
    slug: string;
    beforeCreate(): string;
}
