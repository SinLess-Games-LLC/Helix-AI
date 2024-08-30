import { Entity, Property, ManyToOne } from '@mikro-orm/core'
import { DiscordWeeklyStatistics } from './weeklyStats.entity'
import { BaseEntity } from '../../base.entity'

@Entity()
export class DiscordDailyStatistics extends BaseEntity {
  @Property({ columnType: 'int' })
  guildId: number

  @Property({ columnType: 'int' })
  kicks: number

  @Property({ columnType: 'int' })
  warnings: number

  @Property({ columnType: 'int' })
  bans: number

  @Property({ columnType: 'int' })
  channels: number

  @Property({ columnType: 'int' })
  emojis: number

  @Property({ columnType: 'int' })
  stickers: number

  @Property({ columnType: 'int' })
  members: number

  @Property({ columnType: 'int' })
  roles: number

  @Property({ columnType: 'int' })
  bots: number

  @ManyToOne(() => DiscordWeeklyStatistics, { fieldName: 'week' })
  week!: DiscordWeeklyStatistics
}
