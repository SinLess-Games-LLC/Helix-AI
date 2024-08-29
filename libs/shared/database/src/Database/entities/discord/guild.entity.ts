import { Entity, Property } from '@mikro-orm/core'
import { BaseEntity } from '../base.entity'

@Entity()
export class DiscordGuild extends BaseEntity {
  @Property({ columnType: 'text' })
  discord_id: string // snowflake	guild id

  @Property({ columnType: 'text' })
  name: string // string	guild name (2-100 characters, excluding trailing and leading whitespace)

  @Property({ columnType: 'bigint' })
  owner_id: number // snowflake	id of owner

  @Property({ columnType: 'int' })
  Channel_count: number // integer	total number of text channels and categories that the guild has

  @Property({ columnType: 'int' })
  thread_count: number // integer	total number of threads that the guild has across all of its channels

  @Property({ columnType: 'int' })
  member_count: number // integer	total number of users in the guild

  @Property({ columnType: 'text', nullable: true })
  prefix: string | null // string	the prefix of the guild, used when invoking slash commands

  @Property({ columnType: 'boolean', default: false })
  deleted: boolean

  @Property({ columnType: 'timestamp', defaultRaw: 'CURRENT_TIMESTAMP' })
  lastInteract: Date
}
