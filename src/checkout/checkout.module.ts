import { Module } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { Checkout } from './checkout.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Checkout]),
        UserModule
    ],
    providers: [CheckoutService],
    controllers: [CheckoutController]
})
export class CheckoutModule {}
