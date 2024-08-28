import { BaseEntity } from '../base.entity';
export declare class UserSetting extends BaseEntity {
    newsletter: boolean;
    premium: boolean;
    twoFactorAuthentication: boolean;
}
