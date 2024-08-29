import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import { Options, MikroORM } from '@mikro-orm/core'
import { entities } from './entities'

export type { Options as DatabaseOptions } from '@mikro-orm/core'

export class MikroORMConfig {
  private options: Options
  public orm: any
  public entityManager: any

  constructor(options: Options) {
    this.options = options
    this.options.entities = entities
    this.options.metadataProvider = TsMorphMetadataProvider
    this.options.metadataCache = { enabled: true, pretty: true }
    this.options.discovery = {
      warnWhenNoEntities: false,
      requireEntitiesArray: true,
      alwaysAnalyseProperties: false,
    }
    this.options.driverOptions = {
      connection: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        username: process.env.DB_USER || 'helix',
        password: process.env.DB_PASSWORD || 'helix',
        dbName: process.env.DB_NAME || 'helix',
      },
    }

    this.orm = MikroORM.init(this.options)
    this.entityManager = this.orm.em
  }
}
