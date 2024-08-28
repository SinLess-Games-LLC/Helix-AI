import { Entity, Property, OneToMany, ManyToOne } from '@mikro-orm/core'
import { DiscordWeeklyStatistics } from './weeklyStats.entity'
import { DiscordYearlyStatistics } from './yearlyStats.entity'
import { BaseEntity } from '../../base.entity'

@Entity()
export class DiscordMonthlyStatistics extends BaseEntity {
  @Property({ columnType: 'int' })
  month: number

  @OneToMany(() => DiscordWeeklyStatistics, (weeklyStats) => weeklyStats.month)
  weeklyStats: DiscordWeeklyStatistics[] = []

  @ManyToOne(() => DiscordYearlyStatistics, { fieldName: 'year' })
  year!: DiscordYearlyStatistics
}
