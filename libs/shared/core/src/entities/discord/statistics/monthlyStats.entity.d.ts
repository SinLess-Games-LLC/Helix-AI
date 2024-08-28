import { DiscordWeeklyStatistics } from './weeklyStats.entity';
import { DiscordYearlyStatistics } from './yearlyStats.entity';
import { BaseEntity } from '../../base.entity';
export declare class DiscordMonthlyStatistics extends BaseEntity {
    month: number;
    weeklyStats: DiscordWeeklyStatistics[];
    year: DiscordYearlyStatistics;
}
