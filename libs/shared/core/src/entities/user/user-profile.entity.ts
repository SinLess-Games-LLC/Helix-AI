import { Entity, PrimaryKey, Property, OneToMany } from '@mikro-orm/core'
import { Microservice } from '../site/microservice.entity'
import { Technology } from '../site/technology.entity'
import { News } from '../site/news.entity'
import { Sex, Gender, Sexuality, Pronoun, Country } from '../../enums'
import { BaseEntity } from '../base.entity'

@Entity()
export class UserProfile extends BaseEntity {
  @PrimaryKey()
  sid!: number

  @Property({ nullable: true })
  firstName?: string

  @Property({ nullable: true })
  middleName?: string

  @Property({ nullable: true })
  lastName?: string

  @Property({ nullable: true })
  avatar?: string

  @Property({ nullable: true })
  birthday?: Date

  @Property({ type: 'string', default: Sex.PreferNotToSay })
  sex: Sex = Sex.PreferNotToSay

  @Property({ type: 'string', default: Gender.PreferNotToSay })
  gender: Gender = Gender.PreferNotToSay

  @Property({
    type: 'string',
    default: Sexuality.PreferNotToSay,
    nullable: true,
  })
  sexualOrientation?: Sexuality

  @Property({ type: 'string', default: Pronoun.Other })
  pronoun: Pronoun = Pronoun.Other

  @Property({ type: 'string', default: Country.PreferNotToSay })
  country: Country = Country.PreferNotToSay

  @OneToMany(() => Microservice, (microservice) => microservice.added_by, {
    eager: true,
  })
  microservices_added: Microservice[] = []

  @OneToMany(() => Technology, (technology) => technology.added_by, {
    eager: true,
  })
  technologies_added: Technology[] = []

  @OneToMany(() => News, (news) => news.added_by, { eager: true })
  news_added: News[] = []

  @Property({ type: 'boolean', default: false })
  email_verified = false

  @Property({ type: 'boolean', default: false })
  age_verified = false
}
