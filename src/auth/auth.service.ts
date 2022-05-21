// NestJS & Core
import { Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';
import * as requestIp from 'request-ip';

// Services
import { UserService } from 'src/user/user.service';

// Entities
import { User } from '../user/entities/user.entity';

// Models
import { HyperKeyData } from './models/hyper-key-data.model';
import JwtPayload from './models/jwt-payload.model';

// Exceptions
import { InvalidKeyException } from './exceptions/invalid-key.exception';
import { InvalidIpException } from './exceptions/invalid-ip.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { License } from './license.entity';

@Injectable()
export class AuthService {
    private logger = new Logger('AuthService');

    constructor(
        @InjectRepository(License)
        private readonly licenseRepository: Repository<License>,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly httpService: HttpService
    ){}

    /**
     * Check if the license key is valid, if key is invalid throw InvalidKeyException
     * @param key The Hyper license key
     */
    private async getHyperKeyData(key: string): Promise<HyperKeyData>{
        try {
            const resp = await lastValueFrom(this.httpService.get(`https://api.hyper.co/v4/licenses/${key}`, {
                headers: {
                    Authorization: 'Bearer pk_XZ8fCRvSNfP6oiRAvlClcy7ljVGSJJdk'
                }
            }).pipe(map(resp => resp)));

            const { data } = resp;

            return new HyperKeyData(
                data.user.discord.username, 
                data.user.discord.id, 
                data.user.photo_url,
                data.email,
                data.plan.id,
                data.key,
                data.id
            );

        } catch (error) {
            if (error.response?.status === 404){
                this.logger.verbose(`Rejected ${key} (invalid key)`);
                throw new InvalidKeyException();
            }
            this.logger.error('Unable to check Hyper license', error);
            throw new InternalServerErrorException('Unable to check Hyper license'); 
        }
    }

    /**
     * Checks the key and returns the corresponding User.
     * If its the first time the User is logging in, a new User will be created.
     * @param key The Hyper key
     */
    async validateHyperLicense(req: Request, key: string): Promise<License> {
        this.logger.verbose(`Validating ${key}...`);
        
        const ip = requestIp.getClientIp(<any>req);
        const keyData = await this.getHyperKeyData(key);
 
        /**
         * Find existing license
         */
        const license = await this.licenseRepository.findOne({
            where: { licenseId: keyData.licenseId },
            relations: ['user']
        });

        /**
         * Create new license
         */
        if (!license) {
            try {
                let user = await this.userService.findOne({ where: { discordId: keyData.discordId } });
                if (!user) user = await this.userService.save(new User(keyData.discordId, keyData.discordTag, keyData.discordImage));
    
                const license = await this.licenseRepository.save(new License(keyData.licenseId, keyData.plan, keyData.key, new Date(), ip, user));

                this.logger.verbose(`${license.user.discordTag} logged in with a new license (${license.licenseId})`);
                return license;
            } catch (error) {
                this.logger.error('Unable to create new license', error);
                throw new InternalServerErrorException();
            }
        }

        /**
         * Update License
         */
        license.lastValidation = new Date();
        license.key = key;
        license.ip = ip;
        await this.licenseRepository.save(license);

        /**
         * Update User
         */
        const { user } = license;
        user.discordId = keyData.discordId;
        user.discordTag = keyData.discordTag;
        user.discordImage = keyData.discordImage;
        await this.userService.save(user);

        this.logger.verbose(`${user.discordTag} logged in`);
        return license;
    }

    /**
     * Creates a JWT token with payload
     */
    async createToken(license: License): Promise<{access_token: string}> {
        const payload: JwtPayload = { licenseId: license.licenseId };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    /**
     * Checks if the incoming Jwt, which holds the userId & licenseId still has a valid Hyper license
     * @param req The request
     * @param payload The Jwt Payload
     */
    async validateToken(req: Request, payload: JwtPayload): Promise<User>{
        const ip = requestIp.getClientIp(<any>req);

        /**
         * Find existing license
         */
        const license = await this.licenseRepository.findOne({
            where: { licenseId: payload.licenseId },
            relations: ['user']
        });

        if (!license) throw new UnauthorizedException();

        const msSinceLastAuth = new Date().getTime() - license.lastValidation.getTime() ;
        if (msSinceLastAuth > 1) { // 300000ms = 5min
            const keyData = await this.getHyperKeyData(license.key);
            
            /**
             * Update the last validation date
             */
            license.lastValidation = new Date();
            license.ip = ip;
            await this.licenseRepository.save(license);

            /**
             * Update usersettings
             */
            const { user } = license;
            user.discordId = keyData.discordId;
            user.discordTag = keyData.discordTag;
            user.discordImage = keyData.discordImage;
            return await this.userService.save(user);
             
        }

        return license.user;
    }
}