import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core'
import { User } from './user.entity'
import { BaseEntity } from '../base.entity'

@Entity({ tableName: 'accounts' })
export class Account extends BaseEntity {
  @PrimaryKey({ type: 'uuid' })
  userId!: string

  @Property({ type: 'text' })
  type!: string

  @Property({ type: 'text' })
  provider!: string

  @Property({ type: 'text' })
  providerAccountId!: string

  @Property({ type: 'varchar', nullable: true })
  refresh_token!: string | null

  @Property({ type: 'varchar', nullable: true })
  access_token!: string | null

  private _expires_at!: number | null

  @Property({ type: 'bigint', nullable: true })
  get expires_at(): number | null {
    return this._expires_at
  }

  set expires_at(value: number | null) {
    this._expires_at = value
  }

  @Property({ type: 'varchar', nullable: true })
  token_type!: string | null

  @Property({ type: 'varchar', nullable: true })
  scope!: string | null

  @Property({ type: 'varchar', nullable: true })
  id_token!: string | null

  @Property({ type: 'varchar', nullable: true })
  session_state!: string | null

  @Property({ type: 'varchar', nullable: true })
  oauth_token_secret!: string | null

  @Property({ type: 'varchar', nullable: true })
  oauth_token!: string | null

  @ManyToOne(() => User)
  user!: User
}
