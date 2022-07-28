import { Module } from '@nestjs/common';
import { UpdateService } from './update.service';
import { CoreController } from './core.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Update } from './entities/update.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Update])],
    providers: [UpdateService],
    controllers: [CoreController]
})
export class CoreModule {}
