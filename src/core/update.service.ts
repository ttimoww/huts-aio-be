import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Update } from './entities/update.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UpdateService {
    private logger = new Logger('UpdateService');

    constructor(
        @InjectRepository(Update)
        private readonly updateRepository: Repository<Update>
    ){}

    public async getLastUpdate(): Promise<Update>{
        return await this.updateRepository.findOne({ order: { updateId: 'DESC' } });
    }
}
