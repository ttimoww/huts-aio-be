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
        TypeOrmModule.forRoot(),
        AuthModule,
        UserModule,
        CheckoutModule
    ],
    controllers: [],
    providers: [],
})

export class AppModule {}