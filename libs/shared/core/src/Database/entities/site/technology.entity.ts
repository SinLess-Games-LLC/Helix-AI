import { Entity, Property, BeforeCreate, ManyToOne } from '@mikro-orm/core'
import { TechCategory } from '../../enums'
import { UserProfile } from '../user'
import slugify from 'slugify'
import { BaseEntity } from '../base.entity'

export interface TechnologyInterface {
  sid: number
  name: string
  description: string
  content: string
  image: string
  alt: string
  category1: TechCategory
  category2: TechCategory
  website: string
  slug: string
  added_by: number
  updatedAt: Date
  createdAt: Date
}

@Entity()
/**
 * @class Technology
 * @description
 * A technology is a tool, framework, programming language, or other software used to develop a microservice.
 *
 * This includes but is not limited to:
 * - Programming Languages
 * - Frameworks
 * - Libraries
 * - Databases
 * - Operating Systems
 * - Cloud Providers
 * - etc.
 */
export class Technology extends BaseEntity {
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

  @Property({ type: 'enum', default: TechCategory.Other })
  category1: TechCategory

  @Property({ type: 'enum', default: TechCategory.Other })
  category2: TechCategory

  @Property()
  website: string

  @Property()
  slug: string

  @ManyToOne(() => UserProfile)
  added_by!: UserProfile

  @BeforeCreate()
  generateSlug() {
    this.slug = slugify(this.name, '_')
  }
}
