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
            url: process.env.TYPEORM_URL,
            synchronize: process.env.NODE_ENV === 'development',
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
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