module.exports = {
    type: 'postgres',
    host: process.env.TYPEORM_HOST,
    port: +process.env.TYPEORM_PORT,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    synchronize: process.env.DB_SYNC === 'ON',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true, ca: process.env.CA_CERT } : false,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/*{.ts,.js}'],
    cli: { migrationsDir: 'migrations' }
};