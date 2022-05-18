// NestJS
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { HttpModule } from '@nestjs/axios';

// Constants
import { jwtConstants } from './constants';

// Auth
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt.guard';
import { LocalStrategy } from './strategies/local.strategy';

// Modules
import { UserModule } from './../user/user.module';

// Controllers
import { AuthController } from './auth.controller';

// Services
import { AuthService } from './auth.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [
        UserModule, 
        PassportModule,
        HttpModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '14d' },
        })
    ],
    providers:[
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard
        },
        JwtStrategy,
        LocalStrategy, 
        AuthService
    ],
    controllers: [AuthController]
})
export class AuthModule {}
