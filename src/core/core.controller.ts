import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UpdateDto } from './dto/update-dto';
import { UpdateService } from './update.service';

@ApiTags('core')
@Controller('core')
@ApiBearerAuth()
export class CoreController {

    constructor(
        private readonly updateService: UpdateService
    ){}

    @Get('update')
    @ApiOkResponse({ type: UpdateDto })
    async getUpdate(): Promise<UpdateDto>{
        const update = await this.updateService.getLastUpdate();
        return new UpdateDto(update);
    }
}
