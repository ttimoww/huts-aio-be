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
        const urlRegex = new RegExp(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g, '');
        if (!body.productImage.match(urlRegex)){
            if (body.store === Store.Solebox) body.productImage = 'https://i.imgur.com/0bdaOjE.png';
            else if (body.store === Store.Snipes) body.productImage = 'https://i.imgur.com/PPBtTL0.jpeg';
            else if (body.store === Store.Zalando) body.productImage = 'https://i.imgur.com/JJd4MoM.jpeg';
            else if (body.store === Store.LVR) body.productImage = 'https://www.wsj.com/coupons/static/shop/37360/logo/luisa_via_roma_promo_code.png';
            else if (body.store === Store.Supreme) body.productImage = 'https://i.imgur.com/FDdtFlt.jpeg';
            else body.productImage = 'https://i.imgur.com/cXu8bLX.png';
        }

        const checkout = await this.checkoutRepository.save(new Checkout(body, user));
            
        this.webhookService.send(user, body);
            
        return checkout;
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
