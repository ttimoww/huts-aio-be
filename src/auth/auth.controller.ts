// NestJS
import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';

// Services
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

// Decorators
import { Public } from './decorators/public.decorator';

// Guards
import { LocalAuthGuard } from './guards/local.guard';

// Dto
import { UserTokenDto } from './dto/user-token.dto';

// Interfaces
import { IRequestWithLicense } from './../lib/interfaces/request-with-license.interface';
import { SuccessDto } from 'src/lib/dto/success.dto';

@Controller('/auth')
@ApiTags('auth')
export class AuthController {

    constructor(
      private readonly authService: AuthService
    ){}

  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiOkResponse({ type: UserTokenDto })
  @ApiBody({ type: LoginDto })
  @Post('/login')
    async login(@Request() req: IRequestWithLicense): Promise<UserTokenDto> {
        const license = req.user;
        const token = await this.authService.createToken(license);
        return { 
            access_token: token.access_token,
            discordId: license.user.discordId, 
            discordImage: license.user.discordImage, 
            discordTag: license.user.discordTag,
            email: license.user.email,
            plan: license.plan,
            key: license.key,
            isTester: license.user.isTester
        };
    }

  @ApiBearerAuth()
  @ApiOkResponse({ type: SuccessDto })
  @Get('/check-token')
  checkToken(): SuccessDto {
      return { success: true };
  }
}