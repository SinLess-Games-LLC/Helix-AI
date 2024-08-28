import { DiscordWeeklyStatistics } from './weeklyStats.entity';
import { BaseEntity } from '../../base.entity';
export declare class DiscordDailyStatistics extends BaseEntity {
    guildId: number;
    kicks: number;
    warnings: number;
    bans: number;
    channels: number;
    emojis: number;
    stickers: number;
    members: number;
    roles: number;
    bots: number;
    week: DiscordWeeklyStatistics;
}
