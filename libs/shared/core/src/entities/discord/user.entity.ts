import { Entity, Property } from '@mikro-orm/core'
import { BaseEntity } from '../base.entity'

@Entity()
export class DiscordUser extends BaseEntity {
  @Property({ unique: true, columnType: 'text' })
  discord_id: string

  @Property({ columnType: 'text' })
  username: string

  @Property({ columnType: 'text' })
  discriminator: string

  @Property({ columnType: 'int' })
  discord_account_age: number

  @Property({ columnType: 'int' })
  helix_account_age: number

  @Property({ columnType: 'boolean' })
  discord_verified: boolean

  @Property({ columnType: 'boolean' })
  helix_verified: boolean

  @Property({ columnType: 'text' })
  email: string

  @Property({ columnType: 'text' })
  system_warnings: number

  @Property({ columnType: 'text' })
  display_name: string

  @Property({ columnType: 'timestamp', defaultRaw: 'CURRENT_TIMESTAMP' })
  lastInteract: Date
}
