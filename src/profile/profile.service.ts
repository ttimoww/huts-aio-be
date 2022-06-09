// NestJS
import { ForbiddenException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Entities
import { User } from 'src/user/entities/user.entity';
import { Profile } from './profile.entity';

// Dto's
import { ProfileDto } from './profile.dto';
import { ResultDto } from 'src/lib/dto/result.dto';

@Injectable()
export class ProfileService {
    private logger = new Logger('ProfileService');

    constructor(
        @InjectRepository(Profile)
        private readonly profileRepository: Repository<Profile>,
    ){}

    /**
     * Find all profiles
     * @param user The user
     * @returns The user's profiles
     */
    async getProfiles(user: User): Promise<ProfileDto[]>{
        const profiles = await this.profileRepository.find({ where: { user: user } });
        return profiles.map(profile => profile);
    }

    /**
     * Save a new profile
     * @param user The user
     * @param body The profile information
     * @returns The saved profile
     */
    async createProfile(user: User, body: ProfileDto): Promise<ProfileDto>{
        try {
            const profile = await this.profileRepository.save(new Profile(body, user));
            this.logger.verbose(`${user.discordTag} saved a new profile (${profile.profileId})`);
            
            delete profile.user;
            return profile; 
        } catch (err) {
            this.logger.error('Unable to save new profile', err);
            throw new InternalServerErrorException('Unable to save new profile'); 
        }
    }

    /**
     * Save a new profile
     * @param user The user
     * @param id The profile id
     * @param body The profile information
     * @returns The updated profile
     */
    async updateProfile(user: User, id: number, body: ProfileDto): Promise<ProfileDto>{
        const profile = await this.profileRepository.findOne({ 
            where: { profileId: id },
            relations: ['user']
        });

        if (!profile) throw new NotFoundException(`No profile with id ${id}`);
        if (profile.user?.userId !== user.userId) throw new ForbiddenException();

        try {
            /**
             * Create new profile with the incoming dto
             * To update the existing profile we only update the ID
             */
            const newProfile = new Profile(body, user);
            newProfile.profileId = profile.profileId;

            const updatedProfile = await this.profileRepository.save(newProfile);
            this.logger.verbose(`${user.discordTag} updated a profile (${profile.profileId})`);
            
            delete updatedProfile.user;
            return updatedProfile; 
        } catch (err) {
            this.logger.error('Unable to save new profile', err);
            throw new InternalServerErrorException('Unable to update profile'); 
        }
    }
    
    /**
     * Delete a profile
     * @param user The user
     * @param id The profile to delete
     * @returns Wheter the deletion succeeded or not
     */
    async deleteProfile(user: User, id: number): Promise<ResultDto>{
        const profile = await this.profileRepository.findOne({ 
            where: { profileId: id },
            relations: ['user']
        });

        if (!profile) throw new NotFoundException(`No profile with id ${id}`);

        if (profile.user?.userId !== user.userId) throw new ForbiddenException();

        const result = this.profileRepository.delete(profile);
        return { result: !!result };
    }
}
