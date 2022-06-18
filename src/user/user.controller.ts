import { Controller, Get, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SuccessPointsDto } from 'src/discord/dto/success-points.dto';
import { IRequestWithUser } from 'src/lib/interfaces/request-with-user.interface';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('user')
@ApiBearerAuth()
export class UserController {

    constructor(
        private readonly userService: UserService
    ){}

    @Get('/success-points')
    @ApiOkResponse({ type: SuccessPointsDto })
    async getSuccessPoints(@Request() req: IRequestWithUser){
        return new SuccessPointsDto(req.user.successPoints);
    }
}
