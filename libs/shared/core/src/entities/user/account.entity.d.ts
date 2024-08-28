import { User } from './user.entity';
import { BaseEntity } from '../base.entity';
export declare class Account extends BaseEntity {
    userId: string;
    type: string;
    provider: string;
    providerAccountId: string;
    refresh_token: string | null;
    access_token: string | null;
    private _expires_at;
    get expires_at(): number | null;
    set expires_at(value: number | null);
    token_type: string | null;
    scope: string | null;
    id_token: string | null;
    session_state: string | null;
    oauth_token_secret: string | null;
    oauth_token: string | null;
    user: User;
}
