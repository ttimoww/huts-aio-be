// NestJS
import { Controller, Post, Get, Delete, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';

// Dto's
import { SuccessDto } from 'src/lib/dto/success.dto';
import { WebhookDto } from '../dto/webhook.dto';

@Controller('webhook')
@ApiTags('webhook')
@ApiBearerAuth()
export class WebhookController {
    @Get()
    @ApiOkResponse({ type: WebhookDto })
    async getWebhook(@Res() res): Promise<WebhookDto> {
        return res.redirect('/user/webhook');
    }

    @Post()
    @ApiBody({ type: WebhookDto })
    @ApiOkResponse({ type: WebhookDto })
    async setWebhook(@Res() res): Promise<WebhookDto> {
        /**
         * We need 307 so the redirect will stay a POST (otherwise it will become a GET)
         * See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/307
         */
        return res.redirect('/user/webhook', 307);

    }

    @Delete()
    @ApiOkResponse({ type: SuccessDto })
    async deleteWebhook(@Res() res): Promise<SuccessDto>{
        return res.redirect('/user/webhook');
    }
}
