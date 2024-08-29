import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

@Entity()
export abstract class BaseEntity {
  @PrimaryKey()
  _id!: number

  @Property({ onUpdate: () => new Date() })
  updated_at: Date = new Date()

  @Property({ type: 'date' })
  created_at: Date = new Date()
}
