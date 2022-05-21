// NestJS
import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';

// Services
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

// Decorators
import { Public } from './decorators/public.decorator';

// Guards
import { LocalAuthGuard } from './guards/local.guard';

// Entities
import { User } from 'src/user/entities/user.entity';
import { License } from './license.entity';

@Controller('/auth')
export class AuthController {

    constructor(
      private readonly authService: AuthService
    ){}

  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  @Post('/login')
    async getHello(@Request() req): Promise<any> {
        /**
         * Note that req.user isn't actually a User here but an License
         * We do this so we can store the licenseId in the JWT payload
         * See the return type in local.strategy
         */
        const license = req.user as License;
        
        const token = await this.authService.createToken(license);
        return { ...license.user, ...token };
    }

  @ApiBearerAuth()
  @Get('/check-token')
  checkToken(@Request() req): Promise<User> {
      return req.user;
  }
}
