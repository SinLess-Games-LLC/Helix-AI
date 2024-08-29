import { Entity, Property } from '@mikro-orm/core'
import { BaseEntity } from '../base.entity'

@Entity()
export class Image extends BaseEntity {
  @Property({ columnType: 'text' })
  fileName: string

  @Property({ columnType: 'text', nullable: true })
  basePath?: string

  @Property({ columnType: 'text' })
  url: string

  @Property({ columnType: 'int' })
  size: number

  @Property({ columnType: 'simple-array' })
  tags: string[]

  @Property({ columnType: 'text' })
  hash: string

  @Property({ columnType: 'text' })
  deleteHash: string
}
