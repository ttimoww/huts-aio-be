import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Modules
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

// Entities
import { CheckoutModule } from './checkout/checkout.module';
import { DiscordModule } from './discord/discord.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(),
        AuthModule,
        UserModule,
        CheckoutModule,
        DiscordModule
    ],
    controllers: [],
    providers: [],
})

export class AppModule {}