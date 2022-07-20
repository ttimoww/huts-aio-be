import { Body, Controller, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';

// Interfaces
import { IRequestWithUser } from 'src/lib/interfaces/request-with-user.interface';

// Dto
import { SuccessDto } from 'src/lib/dto/success.dto';
import ModuleErrogLogDto from './dto/module-error-log.dto';

// Services
import { LogService } from './log.service';

@Controller('log')
@ApiTags('log')
@ApiBearerAuth()
export class LogController {
    constructor( private readonly logService: LogService){}

    @Post('module-error')
    @ApiBody({ type: ModuleErrogLogDto })
    @ApiOkResponse({ type: SuccessDto })
    async createCheckout(@Request() req: IRequestWithUser, @Body() body: ModuleErrogLogDto): Promise<SuccessDto> {
        return await this.logService.saveModuleErrorLog(req.user, body);
    }
}
