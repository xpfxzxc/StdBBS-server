require('dotenv').config({ path: 'env/.env.dev' });

export = [
  {
    name: 'seed',
    type: process.env.TYPEORM_DB_TYPE,
    host: process.env.TYPEORM_HOST,
    port: parseInt(process.env.TYPEORM_PORT),
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    logging: process.env.TYPEORM_LOGGING === 'true',
    entities: ['src/**/*.entity{.ts,.js}'],
    migrationsTableName: 'seeds',
    migrations: ['src/seeds/*.seeder.ts'],
    cli: {
      migrationsDir: 'src/seeds',
    },
  },
];
