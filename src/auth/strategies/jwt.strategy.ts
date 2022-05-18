import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable,  } from '@nestjs/common';
import { jwtConstants } from './../constants';
import { User } from 'src/user/user.entity';
import JwtPayload from '../models/jwt-payload.model';
import { AuthService } from '../auth.service';

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