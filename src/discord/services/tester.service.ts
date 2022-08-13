import { Injectable, Logger } from '@nestjs/common';
import { Guild, GuildMember, Role } from 'discord.js';

// Config
import * as config from 'config';
import { UserService } from 'src/user/user.service';
const testerRole = config.get('testerRole');

@Injectable()
export class TesterService {
    private logger = new Logger(TesterService.name);

    constructor(
        private readonly userService: UserService
    ){}
    
    /**
     * Finds the tester role in the provided Guild, if not found, it creates a new tester role
     * @param guild The current server
     * @returns The tester Role
     */
    private async getTesterRole(guild: Guild): Promise<Role>{
        try {
            let role = await guild.roles.cache.find(r => r.name.toLowerCase() === testerRole.name);
            if (role) return role;

            role = await guild.roles.create({ name: testerRole.name, color: testerRole.color });
            this.logger.verbose('Successfully created a new tester role');
            return role;
        } catch (error) {
            this.logger.error('Unable to find/create the tester role');
        }
    }

    /**
     * Assign the tester role to a member
     * @param member The member to assign the tester role to
     * @param guild The current guild
     * @returns Whether the opartion succeeded or not
     */
    public async assignTester(member: GuildMember, guild: Guild): Promise<boolean>{
        try {
            const testerRole = await this.getTesterRole(guild);
            await this.userService.toggleTesterFlag(member.id, true);
            await member.roles.add(testerRole);
            return true;
        } catch (error) {
            this.logger.error('Unable to assign tester role', error);
            return false;
        }
    }

    /**
     * Remove the tester role from a member
     * @param member The member to remove the tester role from
     * @param guild The current guild
     * @returns Whether the opartion succeeded or not
     */
    public async removeTester(member: GuildMember, guild: Guild): Promise<boolean>{
        try {
            const testerRole = await this.getTesterRole(guild);
            await this.userService.toggleTesterFlag(member.id, false);
            await member.roles.remove(testerRole);
            return true;
        } catch (error) {
            this.logger.error('Unable to remove tester role', error);
            return false;
        }
    }
}