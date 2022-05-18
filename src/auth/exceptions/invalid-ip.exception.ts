import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidIpException extends HttpException {
    constructor() {
        super('Invalid IP address', HttpStatus.FORBIDDEN);
    }
}