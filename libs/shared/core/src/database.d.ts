import { BaseEntity } from './entities';
export { MikroORMConfig } from './mikro-orm.config';
export type { DatabaseOptions } from './mikro-orm.config';
export declare const entities: (typeof BaseEntity)[];
/**
 *  Entities
 */
export { Microservice, News, Technology, User, UserProfile, UserSetting, Account, Session, DiscordGuild, DiscordUser, DiscordDailyStatistics, DiscordWeeklyStatistics, DiscordMonthlyStatistics, DiscordYearlyStatistics, Pastebin, Image, Health, } from './entities';
/**
 * Interfaces
 *
 * @description Interface exports for each entity
 */
export type { MicroserviceInterface, NewsInterface, TechnologyInterface, } from './entities';
/**
 * Enums
 */
export { Country, Gender, Pronoun, Role, Sex, Sexuality, TechCategory, } from './enums';
