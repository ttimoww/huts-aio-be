import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Checkout } from './checkout.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { CheckoutDto } from './checkout.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CheckoutService {

    constructor(
        @InjectRepository(Checkout)
        private readonly checkoutRepository: Repository<Checkout>,
        private readonly userService: UserService
    ){}

    /**
     * Find all checkouts
     * @param user The user
     * @returns The user's checkouts
     */
    async getCheckouts(user: User): Promise<Checkout[]>{
        const checkouts = await this.checkoutRepository.find({ where: { user: user } });
        return checkouts;
    }

    /**
     * Save a new checkout
     * @param user The user
     * @param body The checkout information
     * @returns The saved checkout
     */
    async createCheckout(user: User, body: CheckoutDto): Promise<Checkout>{
        const checkout = new Checkout(body.store, body.name, body.size, body.image, user);
        return await this.checkoutRepository.save(checkout);
    }
    
    /**
     * Delete a checkout
     * @param user The user
     * @param id The checkout to delete
     * @returns Wheter the deletion succeeded or not
     */
    async deleteCheckout(user: User, id: number): Promise<boolean>{
        const checkout = await this.checkoutRepository.findOne({ 
            where: { checkoutId: id },
            relations: ['user']
        });

        if (!checkout) throw new NotFoundException(`No checkout with id ${id}`);

        if (checkout.user.userId !== user.userId) throw new ForbiddenException();

        const result = this.checkoutRepository.delete(checkout);
        return !!result;
    }
}
