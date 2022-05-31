// NestJS
import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Entities
import { User } from 'src/user/entities/user.entity';
import { Checkout } from './checkout.entity';

// Dto's
import { CheckoutDto } from './checkout.dto';
import { ResultDto } from 'src/lib/dto/result.dto';

// Service
import { WebhookService } from 'src/discord/webhook.service';

@Injectable()
export class CheckoutService {
    private logger = new Logger('CheckoutService');

    constructor(
        @InjectRepository(Checkout)
        private readonly checkoutRepository: Repository<Checkout>,
        private readonly webhookService: WebhookService
    ){}

    /**
     * Find all checkouts
     * @param user The user
     * @returns The user's checkouts
     */
    async getCheckouts(user: User): Promise<CheckoutDto[]>{
        const checkouts = await this.checkoutRepository.find({ where: { user: user } });
        return checkouts.map(checkout => ({
            store: checkout.store,
            productName: checkout.productName,
            productSize: checkout.productSize,
            productImage: checkout.productImage,
            productPrice: checkout.productPrice
        }));
    }

    /**
     * Save a new checkout
     * @param user The user
     * @param body The checkout information
     * @returns The saved checkout
     */
    async createCheckout(user: User, body: CheckoutDto): Promise<CheckoutDto>{
        this.logger.verbose(`${user.discordTag} checked out a product`);
        const checkout = await this.checkoutRepository.save(new Checkout(
            body.store, 
            body.productName, 
            body.productSize, 
            body.productImage,
            body.productPrice,
            user
        ));
            
        this.webhookService.send(user, body);
            
        return {
            store: checkout.store,
            productName: checkout.productName,
            productSize: checkout.productSize,
            productPrice: checkout.productPrice,
            productImage: checkout.productImage,
        };
    }
    
    /**
     * Delete a checkout
     * @param user The user
     * @param id The checkout to delete
     * @returns Wheter the deletion succeeded or not
     */
    async deleteCheckout(user: User, id: number): Promise<ResultDto>{
        const checkout = await this.checkoutRepository.findOne({ 
            where: { checkoutId: id },
            relations: ['user']
        });

        if (!checkout) throw new NotFoundException(`No checkout with id ${id}`);

        if (checkout.user.userId !== user.userId) throw new ForbiddenException();

        const result = this.checkoutRepository.delete(checkout);
        return { result: !!result };
    }
}
