import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Modules
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

// Entities
import { User } from './user/user.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            synchronize: process.env.NODE_ENV === 'development',
            logging: false,
            entities: [User]
        }),
        AuthModule,
        UserModule
    ],
    controllers: [],
    providers: [],
})

export class AppModule {}