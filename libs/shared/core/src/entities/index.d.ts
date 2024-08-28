export * from './discord';
export * from './user';
export * from './site';
export * from './system';
import * as discord from './discord';
import * as user from './user';
import * as site from './site';
import * as system from './system';
export declare const entities: (typeof discord.DiscordUser | typeof discord.DiscordGuild | typeof discord.Image | typeof discord.Pastebin | typeof discord.DiscordYearlyStatistics | typeof discord.DiscordMonthlyStatistics | typeof discord.DiscordWeeklyStatistics | typeof discord.DiscordDailyStatistics | typeof site.Microservice | typeof user.UserProfile | typeof site.Technology | typeof site.News | typeof user.UserSetting | typeof user.Account | typeof user.User | typeof user.Session | typeof system.Health)[];
