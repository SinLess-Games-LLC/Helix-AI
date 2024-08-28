import { BaseEntity } from '../base.entity';
export declare class DiscordUser extends BaseEntity {
    discord_id: string;
    username: string;
    discriminator: string;
    discord_account_age: number;
    helix_account_age: number;
    discord_verified: boolean;
    helix_verified: boolean;
    email: string;
    system_warnings: number;
    display_name: string;
    lastInteract: Date;
}
