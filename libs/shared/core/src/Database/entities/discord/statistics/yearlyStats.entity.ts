import { Entity, Property, ManyToOne } from '@mikro-orm/core'
import { DiscordMonthlyStatistics } from './monthlyStats.entity'
import { BaseEntity } from '../../base.entity'

@Entity()
export class DiscordYearlyStatistics extends BaseEntity {
  @Property({ columnType: 'int' })
  year: number

  @ManyToOne(() => DiscordMonthlyStatistics, { fieldName: 'month' })
  month!: DiscordMonthlyStatistics
}
