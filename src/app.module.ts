import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Modules
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

// Entities
import { User } from './user/user.entity';
import { CheckoutModule } from './checkout/checkout.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.TYPEORM_HOST,
            port: +process.env.TYPEORM_PORT,
            username: process.env.TYPEORM_USERNAME,
            password: process.env.TYPEORM_PASSWORD,
            database: process.env.TYPEORM_NAME,
            synchronize: process.env.NODE_ENV === 'development',
            logging: false,
            entities: [User]
        }),
        AuthModule,
        UserModule,
        CheckoutModule
    ],
    controllers: [],
    providers: [],
})

export class AppModule {}