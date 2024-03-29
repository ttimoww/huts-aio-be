// NestJS
import { Body, Controller, Post, Get, Request, Delete, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';

// Dto's
import { SuccessDto } from 'src/lib/dto/success.dto';
import { CheckoutDto } from './checkout.dto';

// Interfaces
import { IRequestWithUser } from 'src/lib/interfaces/request-with-user.interface';

// Services
import { CheckoutService } from './checkout.service';

@Controller('checkout')
@ApiTags('checkout')
@ApiBearerAuth()
export class CheckoutController {

    constructor(
        private readonly checkoutService: CheckoutService
    ){}

    @Get()
    @ApiOkResponse({ type: [CheckoutDto] })
    async getCheckouts(@Request() req: IRequestWithUser): Promise<CheckoutDto[]> {
        return await this.checkoutService.getCheckouts(req.user);
    }

    @Post()
    @ApiBody({ type: CheckoutDto })
    @ApiOkResponse({ type: CheckoutDto })
    async createCheckout(@Request() req: IRequestWithUser, @Body() body: CheckoutDto): Promise<CheckoutDto> {
        return await this.checkoutService.createCheckout(req.user, body);
    }

    @Delete(':id')
    @ApiOkResponse({ type: SuccessDto })
    async deleteCheckout(@Request() req: IRequestWithUser, @Param('id') id: number): Promise<SuccessDto>{
        return await this.checkoutService.deleteCheckout(req.user, id);
    }
}
