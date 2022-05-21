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
}