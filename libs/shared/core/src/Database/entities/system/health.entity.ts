import { Entity, Property } from '@mikro-orm/core'
import { BaseEntity } from '../base.entity'

@Entity()
export class Health extends BaseEntity {
  @Property()
  systemStatus: string

  @Property()
  systemVersion: string

  @Property()
  systemUptime: string

  @Property()
  systemCPU: string

  @Property()
  systemMemory: string

  @Property()
  latency: string

  @Property()
  day: Date
}
