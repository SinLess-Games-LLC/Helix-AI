import { BaseEntity } from '../base.entity';
export declare class DiscordGuild extends BaseEntity {
    discord_id: string;
    name: string;
    owner_id: number;
    Channel_count: number;
    thread_count: number;
    member_count: number;
    prefix: string | null;
    deleted: boolean;
    lastInteract: Date;
}
