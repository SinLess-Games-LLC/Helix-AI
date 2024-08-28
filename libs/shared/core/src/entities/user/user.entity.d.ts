import { UserProfile } from './user-profile.entity';
import { UserSetting } from './user-setting.entity';
import { Role } from '../../enums';
import { Account } from './account.entity';
import { Session } from './session.entity';
import { BaseEntity } from '../base.entity';
export declare class User extends BaseEntity {
    uuid: string;
    name?: string;
    user_name?: string;
    email: string;
    emailVerified?: string;
    image?: string;
    password: string;
    role: Role;
    profile_id?: number;
    profile: UserProfile;
    settings_id?: number;
    settings: UserSetting;
    sessions: Session[];
    accounts: Account[];
    beforeUpsert(): Promise<void>;
}
