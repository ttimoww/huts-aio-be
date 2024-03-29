import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

// eslint-disable-next-line no-useless-escape
const webhookRegex = new RegExp(/(https?:\/\/(.+?\.)?discord(app)?\.com(\/[A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;\=]*)?)/gm, '');

export class WebhookDto  {
    @ApiProperty()
    @Matches(webhookRegex)
        url: string;
}
