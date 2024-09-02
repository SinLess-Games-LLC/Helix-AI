import { Module } from '@nestjs/common'

import { AppController } from './app.controller'
import { AppService } from './app.service'
/**
 * Mikro ORM imports
 */
import { MySqlDriver } from '@mikro-orm/mysql'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import { Migrator } from '@mikro-orm/migrations'
import { EntityGenerator } from '@mikro-orm/entity-generator'
import { SeedManager } from '@mikro-orm/seeder'

// Helix Library Imports
import { entities } from '@helix/database'

@Module({
  imports: [
    MikroOrmModule.forRoot({
      entities: entities,
      dbName: 'helix',
      driver: MySqlDriver,
      host: 'localhost',
      password: 'helix',
      port: 3310,
      user: 'helix',
      metadataProvider: TsMorphMetadataProvider,
      autoLoadEntities: true,
      extensions: [Migrator, EntityGenerator, SeedManager],
      metadataCache: { pretty: true },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
