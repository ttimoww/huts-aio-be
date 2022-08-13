import { Body, Controller, Delete, Get, NotFoundException, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SuccessPointsDto } from 'src/discord/dto/success-points.dto';
import { SuccessDto } from 'src/lib/dto/success.dto';
import { IRequestWithUser } from 'src/lib/interfaces/request-with-user.interface';
import { WebhookDto } from './dto/webhook.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('user')
@ApiBearerAuth()
export class UserController {

    constructor(
        private readonly userService: UserService,
    ){}

    @Get('/success-points')
    @ApiOkResponse({ type: SuccessPointsDto })
    async getSuccessPoints(@Request() req: IRequestWithUser){
        return new SuccessPointsDto(req.user.successPoints);
    }

    @Get('/webhook')
    @ApiOkResponse({ type: WebhookDto })
    async getWebhook(@Request() req: IRequestWithUser): Promise<WebhookDto> {
        const webhook = await this.userService.findWebhook(req.user);
        if (!webhook) throw new NotFoundException();
        return { url: webhook.url };
    }

    @Post('/webhook')
    @ApiBody({ type: WebhookDto })
    @ApiOkResponse({ type: WebhookDto })
    async setWebhook(@Request() req: IRequestWithUser, @Body() body: WebhookDto): Promise<WebhookDto> {
        const webhook = await this.userService.saveWebhook(req.user, body);
        return { url: webhook.url };
    }

    @Delete('/webhook')
    @ApiOkResponse({ type: SuccessDto })
    async deleteWebhook(@Request() req: IRequestWithUser): Promise<SuccessDto>{
        const result = await this.userService.deleteWebhook(req.user);
        return { success: result };
    }
}
