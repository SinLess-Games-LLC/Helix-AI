import { Entity, Property, ManyToOne, BeforeUpsert } from '@mikro-orm/core'
import { UserProfile } from '../user'
import slugify from 'slugify'
import { BaseEntity } from '../base.entity'

export interface MicroserviceInterface {
  sid: number
  name: string
  description: string
  content: string
  image: string
  alt: string
  added_by: number
  slug: string
}

@Entity()
export class Microservice extends BaseEntity {
  @Property()
  name: string

  @Property()
  description: string

  @Property()
  content: string

  @Property()
  image: string

  @Property()
  alt: string

  @ManyToOne(() => UserProfile)
  added_by!: UserProfile

  @Property()
  slug: string

  @BeforeUpsert()
  beforeCreate() {
    this.slug = slugify(this.name, '_')
    return this.slug
  }
}
