import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Modules
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

// Entities
import { User } from './user/user.entity';
import { CheckoutModule } from './checkout/checkout.module';

console.log(process.env.CA_CERT);

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.TYPEORM_HOST,
            port: +process.env.TYPEORM_PORT,
            username: process.env.TYPEORM_USERNAME,
            password: process.env.TYPEORM_PASSWORD,
            database: process.env.TYPEORM_DATABASE,
            // synchronize: process.env.NODE_ENV === 'development',
            synchronize: true,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true, ca: process.env.CA_CERT } : false,            
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