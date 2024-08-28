import { DiscordMonthlyStatistics } from './monthlyStats.entity';
import { BaseEntity } from '../../base.entity';
export declare class DiscordYearlyStatistics extends BaseEntity {
    year: number;
    month: DiscordMonthlyStatistics;
}
