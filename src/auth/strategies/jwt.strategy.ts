// NestJS
import { PassportStrategy } from '@nestjs/passport';
import { Injectable,  } from '@nestjs/common';

// Auth
import { ExtractJwt, Strategy } from 'passport-jwt';

// Constants
import { jwtConstants } from './../constants';

// Models
import JwtPayload from '../models/jwt-payload.model';

// Services
import { AuthService } from '../auth.service';

// Entities
import { User } from './../../user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
            passReqToCallback: true
        });
    }

    async validate(req: Request, payload: JwtPayload): Promise<User> {
        return await this.authService.validateToken(req, payload);
    }
} 