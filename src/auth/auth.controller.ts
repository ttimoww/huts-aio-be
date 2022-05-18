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
import { User } from 'src/user/user.entity';

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
        const token = await this.authService.createToken(req.user);
        return { ...req.user, ...token };
    }

  @ApiBearerAuth()
  @Get('/check-token')
  checkToken(@Request() req): Promise<User> {
      return req.user;
  }
}
