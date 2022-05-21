// NestJS (& Auth)
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';

// Services
import { AuthService } from '../auth.service';

// Entities
import { License } from '../license.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    private logger = new Logger('LocalStrategy');

    constructor(private readonly authService: AuthService) {
        super({ 
            usernameField: 'key', 
            passwordField: 'key', 
            passReqToCallback: true
        });
    }

    async validate(req: Request, key: string): Promise<License> {
        return await this.authService.validateHyperLicense(req, key);
    }
}
