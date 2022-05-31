// NestJS
import { Body, Controller, Post, Get, Request, Delete, Param, NotFoundException } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
// import { Request } from 'express'

// Dto's
import { ResultDto } from 'src/lib/dto/result.dto';
import { WebhookDto } from './dto/webhook.dto';

// Interfaces
import { IRequestWithUser } from 'src/lib/interfaces/request-with-user.interface';
import { WebhookService } from './webhook.service';

// Services

@Controller('webhook')
@ApiTags('webhook')
@ApiBearerAuth()
export class WebhookController {

    constructor(
        private readonly webhookService: WebhookService
    ){}

    @Get()
    @ApiOkResponse({ type: WebhookDto })
    async getWebhook(@Request() req: IRequestWithUser): Promise<WebhookDto> {
        const webhook = await this.webhookService.findOne({ where: { user: req.user } });
        if (!webhook) throw new NotFoundException();
        return { url: webhook.url };
    }

    @Post()
    @ApiBody({ type: WebhookDto })
    @ApiOkResponse({ type: WebhookDto })
    async setWebhook(@Request() req: IRequestWithUser, @Body() body: WebhookDto): Promise<WebhookDto> {
        const webhook = await this.webhookService.save(req.user, body);
        return { url: webhook.url };
    }

    @Delete()
    @ApiOkResponse({ type: ResultDto })
    async deleteWebhook(@Request() req: IRequestWithUser): Promise<ResultDto>{
        const result = await this.webhookService.delete(req.user);
        return { result: result };
    }
}
