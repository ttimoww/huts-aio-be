// NestJS
import { ForbiddenException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Entities
import { User } from 'src/user/entities/user.entity';
import { Checkout } from './checkout.entity';

// Dto's
import { CheckoutDto } from './checkout.dto';
import { SuccessDto } from 'src/lib/dto/success.dto';

// Service
import { WebhookService } from 'src/discord/services/webhook.service';
import { Store } from 'src/lib/enums/store.enum';

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
        return checkouts.map(checkout => checkout);
    }

    /**
     * Save a new checkout
     * @param user The user
     * @param body The checkout information
     * @returns The saved checkout
     */
    async createCheckout(user: User, body: CheckoutDto): Promise<CheckoutDto>{
        this.logger.verbose(`${user.discordTag} checked out a product`);

        /**
         * Check the Product Image
         * When the URL is invalid, add the websites logo
         */
        // eslint-disable-next-line no-useless-escape
        const urlRegex = new RegExp(/^https?:\/\/.*\/.*\.(png|gif|webp|jpeg|jpg|PNG|GIF|WEBP|JPEG|JPG)\??.*$/, '');
        if (!body.productImage.match(urlRegex)){
            if (body.store === Store.Solebox) body.productImage = 'https://i.imgur.com/0bdaOjE.png';
            else if (body.store === Store.Snipes) body.productImage = 'https://i.imgur.com/PPBtTL0.jpeg';
            else if (body.store === Store.Zalando) body.productImage = 'https://i.imgur.com/JJd4MoM.jpeg';
            else if (body.store === Store.Supreme) body.productImage = 'https://i.imgur.com/FDdtFlt.jpeg';
            else body.productImage = 'https://i.imgur.com/cXu8bLX.png';
        }

        this.webhookService.sendCheckout(user, body);
        try {
            const checkout = await this.checkoutRepository.save(new Checkout(body, user));   
            return checkout;
        } catch (err) {
            this.logger.error('Failed to save new checkout', err);
            throw new InternalServerErrorException();
        }         
    }
    
    /**
     * Delete a checkout
     * @param user The user
     * @param id The checkout to delete
     * @returns Wheter the deletion succeeded or not
     */
    async deleteCheckout(user: User, id: number): Promise<SuccessDto>{
        const checkout = await this.checkoutRepository.findOne({ 
            where: { checkoutId: id },
            relations: ['user']
        });

        if (!checkout) throw new NotFoundException(`No checkout with id ${id}`);

        if (checkout.user.userId !== user.userId) throw new ForbiddenException();

        const result = this.checkoutRepository.delete(checkout);
        return { success: !!result };
    }
}
