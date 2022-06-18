// NestJS Dependencies
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
    private logger = new Logger('UserService');

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ){}

    async findOne(filter: FindOneOptions<User>): Promise<User> {
        return this.userRepository.findOne(filter);
    }

    async save(user: User): Promise<User> {
        return this.userRepository.save(user);
    }

    /**
     * Add or Substract successpoints to a user
     * @param discordTag The user to add or substract points to
     * @param type Add or Substract
     * @param amount Amount
     * @returns The new amount of successpoints
     */
    async mutateSuccessPoints(discordTag: string, type: 'add' | 'subtract', amount: number): Promise<number>{
        const user = await this.userRepository.findOne({ where: { discordTag: discordTag } });
        
        if (type === 'add'){
            user.successPoints += amount;
        }else{
            user.successPoints -+ amount;
        }

        const savedUser = await this.userRepository.save(user);
        return savedUser.successPoints;
    }
}