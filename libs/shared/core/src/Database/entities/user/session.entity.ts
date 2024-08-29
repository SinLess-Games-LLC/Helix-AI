import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core'
import { User } from './user.entity'
import { BaseEntity } from '../base.entity'

@Entity({ tableName: 'sessions' })
export class Session extends BaseEntity {
  @PrimaryKey({ type: 'uuid' })
  id!: string

  @Property({ type: 'text' })
  sessionToken!: string

  @Property({ type: 'uuid' })
  userId!: string

  private _expires!: string

  @Property({ type: 'text' })
  get expires(): string {
    return this._expires
  }

  set expires(value: string) {
    this._expires = value
  }

  @ManyToOne(() => User, { fieldName: 'uuid' })
  user!: User
}
