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

// Entities
import { User } from './../user/entities/user.entity';

// Dto
import { UserDto } from './dto/user.dto';
import { UserTokenDto } from './dto/user-token.dto';

// Interfaces
import { IRequestWithLicense } from './../lib/interfaces/request-with-license.interface';
import { IRequestWithUser } from './../lib/interfaces/request-with-user.interface';

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
        /**
         * Note that req.user isn't actually a User here but an License
         * We do this so we can store the licenseId in the JWT payload (see local.strategy.ts)
         */
        const license = req.user;
        const token = await this.authService.createToken(license);
        return { 
            access_token: token.access_token,
            discordId: license.user.discordId, 
            discordImage: license.user.discordImage, 
            discordTag: license.user.discordTag
        };
    }

  @ApiBearerAuth()
  @ApiOkResponse({ type: UserDto })
  @Get('/check-token')
  checkToken(@Request() req: IRequestWithUser): UserDto {
      const { user } = req;

      return { 
          discordId: user.discordId, 
          discordImage: user.discordImage, 
          discordTag: user.discordTag
      };
  }
}
