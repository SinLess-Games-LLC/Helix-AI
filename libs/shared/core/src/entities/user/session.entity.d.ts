import { User } from './user.entity';
import { BaseEntity } from '../base.entity';
export declare class Session extends BaseEntity {
    id: string;
    sessionToken: string;
    userId: string;
    private _expires;
    get expires(): string;
    set expires(value: string);
    user: User;
}
