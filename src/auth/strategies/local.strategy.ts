import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from 'src/user/user.entity';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    private logger = new Logger('LocalStrategy');

    constructor(private readonly authService: AuthService) {
        super({ usernameField: 'key', passwordField: 'key', passReqToCallback: true });
    }

    async validate(req: Request, key: string): Promise<User> {
        return await this.authService.validateHyperKey(req, key);
    }
}
