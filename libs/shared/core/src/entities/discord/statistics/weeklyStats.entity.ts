import { Entity, Property, OneToMany, ManyToOne } from '@mikro-orm/core'
import { DiscordDailyStatistics } from './dailyStats.entity'
import { DiscordMonthlyStatistics } from './monthlyStats.entity'
import { BaseEntity } from '../../base.entity'

@Entity()
export class DiscordWeeklyStatistics extends BaseEntity {
  @Property({ columnType: 'int' })
  week: number

  @OneToMany(() => DiscordDailyStatistics, (dailyStats) => dailyStats.week)
  dailyStats: DiscordDailyStatistics[] = []

  @ManyToOne(() => DiscordMonthlyStatistics, { fieldName: 'month' })
  month!: DiscordMonthlyStatistics
}
