import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

// Modules
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CheckoutModule } from './checkout/checkout.module';
import { DiscordModule } from './discord/discord.module';
import { ProfileModule } from './profile/profile.module';
import { LogModule } from './log/log.module';
import { CoreModule } from './core/core.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(),
        AuthModule,
        UserModule,
        CheckoutModule,
        DiscordModule,
        ThrottlerModule.forRoot({
            ttl: 60,
            limit: 60,
        }),
        ProfileModule,
        LogModule,
        CoreModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        }
    ],
})

export class AppModule {}