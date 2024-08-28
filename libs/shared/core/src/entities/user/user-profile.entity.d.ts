import { Microservice } from '../site/microservice.entity';
import { Technology } from '../site/technology.entity';
import { News } from '../site/news.entity';
import { Sex, Gender, Sexuality, Pronoun, Country } from '../../enums';
import { BaseEntity } from '../base.entity';
export declare class UserProfile extends BaseEntity {
    sid: number;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    avatar?: string;
    birthday?: Date;
    sex: Sex;
    gender: Gender;
    sexualOrientation?: Sexuality;
    pronoun: Pronoun;
    country: Country;
    microservices_added: Microservice[];
    technologies_added: Technology[];
    news_added: News[];
    email_verified: boolean;
    age_verified: boolean;
}
