// NestJS
import { HttpService,  } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

// Testing
import { fakeHyperKeyData, fakeLicenseWithUser } from './../lib/tests/fakes';
import { expect } from 'chai';
import { fake, assert, stub } from 'sinon';

// Services
import { UserService } from './../user/user.service';
import { AuthService } from './auth.service';

// Entities
import { License } from './license.entity';

describe('AuthService', () => {
    let service: AuthService;
    let module: TestingModule;
    
    const licenseRepository: any = {};
    const userService: any = {};
    const jwtService: any = {};
    const httpService: any = {};

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                PassportModule.register({ defaultStrategy: 'jwt' })
            ],
            providers: [
                AuthService,
                {
                    provide: UserService,
                    useValue: userService
                },
                {
                    provide: HttpService,
                    useValue: httpService
                },
                {
                    provide: JwtService,
                    useValue: jwtService
                },
                {
                    provide: getRepositoryToken(License),
                    useValue: licenseRepository
                }
            ]
        })
            .compile();
    });

    beforeEach(async () => {
        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).to.be.ok;
    });
});
