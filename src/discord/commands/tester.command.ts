
import { Command } from '@discord-nestjs/core';
import { TesterRemoveSubCommand } from './subcommands/tester-remove.subcommand';
import { TesterAssignSubCommand } from './subcommands/tester-assign.subcommand';

@Command({
    name: 'tester',
    description: 'Module tester',
    include: [
        TesterAssignSubCommand,
        TesterRemoveSubCommand
    ],
})
export class TesterCommand {}