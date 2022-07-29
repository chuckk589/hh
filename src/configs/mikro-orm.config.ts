import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import 'dotenv/config';

const MikroORMOptions: MikroOrmModuleOptions = {
  type: 'postgresql',
  allowGlobalContext: true,
  ...(process.env.NODE_ENV === 'development'
    ? { debug: true, logger: console.log.bind(console) }
    : {}),
  entities: ['./dist/modules/mikroorm/entities/'],
  entitiesTs: ['./src/modules/mikroorm/entities/'],
  clientUrl:
    process.env.NODE_ENV === 'development'
      ? process.env.db_url_dev
      : process.env.db_url,
  seeder: {
    path: './dist/modules/mikroorm/seeders', // path to the folder with seeders
    pathTs: './src/modules/mikroorm/seeders', // path to the folder with TS seeders (if used, we should put path to compiled files in `path`)
    defaultSeeder: 'DatabaseSeeder', // default seeder class name
    glob: '!(*.d).{js,ts}', // how to match seeder files (all .js and .ts files, but not .d.ts)
    emit: 'ts', // seeder generation mode
    fileName: (className: string) => className, // seeder file naming convention
  },
  migrations: {
    tableName: 'mikro_orm_migrations', // name of database table with log of executed transactions
    path: './dist/modules/mikroorm/migrations', // path to the folder with seeders
    pathTs: './src/modules/mikroorm/migrations', // path to the folder with TS seeders (if used, we should put path to compiled files in `path`)
    glob: '!(*.d).{js,ts}', // how to match migration files (all .js and .ts files, but not .d.ts)
    transactional: true, // wrap each migration in a transaction
    disableForeignKeys: true, // wrap statements with `set foreign_key_checks = 0` or equivalent
    allOrNothing: true, // wrap all migrations in master transaction
    dropTables: true, // allow to disable table dropping
    safe: false, // allow to disable table and column dropping
    snapshot: true, // save snapshot when creating new migrations
    emit: 'ts', // migration generation mode
  },
};

export default MikroORMOptions;
