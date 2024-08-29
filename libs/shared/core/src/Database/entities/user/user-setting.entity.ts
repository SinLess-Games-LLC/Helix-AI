import { Entity, Property } from '@mikro-orm/core'
import { BaseEntity } from '../base.entity'

@Entity()
export class UserSetting extends BaseEntity {
  @Property({ type: 'boolean', default: false })
  newsletter = false

  @Property({ type: 'boolean', default: false })
  premium = false

  @Property({ type: 'boolean', default: false })
  twoFactorAuthentication = false
}
