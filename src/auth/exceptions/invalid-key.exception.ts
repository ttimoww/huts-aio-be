import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidKeyException extends HttpException {
    constructor() {
        super('Invalid license key', HttpStatus.UNAUTHORIZED);
    }
}