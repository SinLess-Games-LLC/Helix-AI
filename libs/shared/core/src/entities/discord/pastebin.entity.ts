import { Entity, Property } from '@mikro-orm/core'
import { BaseEntity } from '../base.entity'

@Entity()
export class Pastebin extends BaseEntity {
  @Property({ columnType: 'text' })
  editCode: string

  @Property({ columnType: 'int', default: -1 })
  lifetime: number
}
