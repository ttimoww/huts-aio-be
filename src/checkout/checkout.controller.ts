import { Body, Controller, Post, Get, Request, Delete, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { CheckoutDto } from './checkout.dto';
import { Checkout } from './checkout.entity';
import { CheckoutService } from './checkout.service';

@Controller('checkout')
@ApiTags('checkout')
@ApiBearerAuth()
export class CheckoutController {

    constructor(
        private readonly checkoutService: CheckoutService
    ){}

    @Get()
    async getCheckouts(@Request() req): Promise<Checkout[]> {
        return await this.checkoutService.getCheckouts(req.user);
    }

    @Post()
    @ApiBody({ type: CheckoutDto })
    async createCheckout(@Request() req, @Body() body: CheckoutDto): Promise<Checkout> {
        return await this.checkoutService.createCheckout(req.user, body);
    }

    @Delete(':id')
    async deleteCheckout(@Request() req, @Param('id') id: number): Promise<boolean>{
        return await this.checkoutService.deleteCheckout(req.user, id);
    }
}
