import { Entity, Property, BeforeCreate, ManyToOne } from '@mikro-orm/core'
import { UserProfile } from '../user'
import slugify from 'slugify'
import { BaseEntity } from '../base.entity'

export interface NewsInterface {
  sid: number
  name: string
  description: string
  content: string
  image: string
  alt: string
  slug: string
}

@Entity()
export class News extends BaseEntity {
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

  @Property()
  slug: string

  @ManyToOne(() => UserProfile)
  added_by!: UserProfile

  @BeforeCreate()
  async slugify() {
    this.slug = slugify(this.name, '_')
  }
}
