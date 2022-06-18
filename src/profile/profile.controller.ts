// NestJS
import { Body, Controller, Post, Get, Request, Delete, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';

// Dto's
import { ResultDto } from 'src/lib/dto/result.dto';
import { ProfileDto } from './profile.dto';

// Interfaces
import { IRequestWithUser } from 'src/lib/interfaces/request-with-user.interface';

// Services
import { ProfileService } from './profile.service';

@Controller('profile')
@ApiTags('profile')
@ApiBearerAuth()
export class ProfileController {

    constructor(
        private readonly profileService: ProfileService
    ){}

    @Get()
    @ApiOkResponse({ type: [ProfileDto] })
    async getProfiles(@Request() req: IRequestWithUser): Promise<ProfileDto[]> {
        return await this.profileService.getProfiles(req.user);
    }

    @Post()
    @ApiBody({ type: ProfileDto })
    @ApiOkResponse({ type: ProfileDto })
    async createProfile(@Request() req: IRequestWithUser, @Body() body: ProfileDto): Promise<ProfileDto> {
        return await this.profileService.createProfile(req.user, body);

    }

    @Patch(':id')
    @ApiBody({ type: ProfileDto })
    @ApiOkResponse({ type: ProfileDto })
    async updateProfile(@Request() req: IRequestWithUser, @Param('id') id: number, @Body() body: ProfileDto): Promise<ProfileDto> {
        return await this.profileService.updateProfile(req.user, id, body);
    }

    @Get('/duplicate/:id')
    @ApiOkResponse({ type: ProfileDto })
    async duplicateProfile(@Request() req: IRequestWithUser, @Param('id') id: number): Promise<ProfileDto> {
        return await this.profileService.duplicateProfile(req.user, id);
    }

    @Delete(':id')
    @ApiOkResponse({ type: ResultDto })
    async deleteCheckout(@Request() req: IRequestWithUser, @Param('id') id: number): Promise<ResultDto>{
        return await this.profileService.deleteProfile(req.user, id);
    }
}
