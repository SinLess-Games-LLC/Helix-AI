import { DiscordDailyStatistics } from './dailyStats.entity';
import { DiscordMonthlyStatistics } from './monthlyStats.entity';
import { BaseEntity } from '../../base.entity';
export declare class DiscordWeeklyStatistics extends BaseEntity {
    week: number;
    dailyStats: DiscordDailyStatistics[];
    month: DiscordMonthlyStatistics;
}
