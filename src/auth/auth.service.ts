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
import { User } from './../user/user.entity';

// Models
import { HyperKeyData } from './models/hyper-key-data.model';
import JwtPayload from './models/jwt-payload.model';

// Exceptions
import { InvalidKeyException } from './exceptions/invalid-key.exception';
import { InvalidIpException } from './exceptions/invalid-ip.exception';

@Injectable()
export class AuthService {
    private logger = new Logger('AuthService');

    constructor(
      private readonly userService: UserService,
      private jwtService: JwtService,
      private httpService: HttpService
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
                data.user.discord.tag, 
                data.user.discord.id, 
                data.user.photo_url,
                data.email,
                data.plan,
                data.key,
                data.id
            );

        } catch (error) {
            if (error.response?.status === 404){
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
    async validateHyperKey(req: Request, key: string): Promise<User> {
        const ip = requestIp.getClientIp(<any>req);
        const keyData = await this.getHyperKeyData(key);
        const user = await this.userService.findOne({ where: { licenseId: keyData.licenseId } });

        /**
         * Create new User
         */
        if (!user){
            try {
                const newUser = await this.userService.save(new User(
                    key, 
                    keyData.discordId, 
                    keyData.discordTag, 
                    keyData.discordImage, 
                    new Date(), 
                    ip,
                    keyData.licenseId
                ));

                this.logger.verbose(`${newUser.discordTag} just logged in with a fresh license`);
                return newUser;
            } catch (error) {
                this.logger.error(`Unable to create new User entity for ${keyData.discordTag}`, error);
                throw new InternalServerErrorException('Unable to create new user');
            }
        }

        /**
         * Check the ip address
         */
        if (ip !== user.ip) throw new InvalidIpException();

        user.ip = ip;
        user.lastAuth = new Date();
        user.discordId = keyData.discordId;
        user.discordTag = keyData.discordTag;
        user.discordImage = keyData.discordImage;
        user.key = keyData.key;
            
        try {
            await this.userService.save(user);
        } catch (error) {
            this.logger.error(`Unable to update existing user ${user.discordTag} (user will still get access)`);
        }

        this.logger.verbose(`${user.discordTag} just logged in`);
        return user;
    }

    /**
     * Creates a JWT token with payload
     * @param user The User who logged in
     * @returns JWT
     */
    async createToken(user: User): Promise<{access_token: string}> {
        const payload: JwtPayload = { licenseId: user.licenseId };
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
        let userUpdated = false;
        
        const ip = requestIp.getClientIp(<any>req);
        const user = await this.userService.findOne({ where: { licenseId: payload.licenseId } });

        if (!user) throw new UnauthorizedException();

        if (!user.ip){
            user.ip = ip;
            userUpdated = true;
        }
        else if (ip !== user.ip) {
            this.logger.verbose(`Access denied for ${user.discordTag}. Inc: [${ip}] Exp: [${user.ip}]`);
            throw new InvalidIpException();
        }

        const msSinceLastAuth = new Date().getTime() - user.lastAuth.getTime() ;
        if (msSinceLastAuth > 1) { // 300000ms = 5min
            const keyData = await this.getHyperKeyData(user.key);
            
            user.lastAuth = new Date();
            user.discordId = keyData.discordId;
            user.discordTag = keyData.discordTag;
            user.discordImage = keyData.discordImage;

            userUpdated = true;
        }

        return userUpdated ? await this.userService.save(user) : user;
    }
}