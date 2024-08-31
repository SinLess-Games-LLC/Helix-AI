import { Entity, Property, OneToOne, OneToMany, Cascade } from '@mikro-orm/core'
import { uuid as uuidv4 } from 'uuidv4'
import { UserProfile } from './user-profile.entity'
import { UserSetting } from './user-setting.entity'
import { Role } from '../../enums'
import { Account } from './account.entity'
import { Session } from './session.entity'
import { BaseEntity } from '../base.entity'

@Entity()
export class User extends BaseEntity {
  @Property()
  uuid: string = uuidv4()

  @Property({ nullable: true })
  name?: string

  @Property({ nullable: true })
  user_name?: string

  @Property()
  email: string

  @Property({ nullable: true })
  emailVerified?: string

  @Property({ nullable: true })
  image?: string

  @Property()
  password: string

  @Property({ type: 'enum', default: Role.User })
  role: Role = Role.User

  @Property({ nullable: true })
  profile_id?: number

  @OneToOne(() => UserProfile, { cascade: [Cascade.ALL], eager: true })
  profile!: UserProfile

  @Property({ nullable: true })
  settings_id?: number

  @OneToOne(() => UserSetting, { cascade: [Cascade.ALL], eager: true })
  settings!: UserSetting

  @OneToMany(() => Session, (session) => session.user)
  sessions!: Session[]

  @OneToMany(() => Account, (account) => account.user)
  accounts!: Account[]

  // Use BeforeUpsert instead of BeforeInsert
  async beforeUpsert() {
    this.uuid = uuidv4()
  }
}
