import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleErrorLog } from './entities/module-error-log.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ModuleErrorLog])],
    providers: [LogService],
    controllers: [LogController]
})
export class LogModule {}
