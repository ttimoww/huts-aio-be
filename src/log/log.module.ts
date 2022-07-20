import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleErrorLog } from './entities/module-error-log.entity';
import { DiscordModule } from './../discord/discord.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ModuleErrorLog]), 
        DiscordModule
    ],
    providers: [LogService],
    controllers: [LogController]
})
export class LogModule {}
