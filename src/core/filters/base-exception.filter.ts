import { Response } from 'express';
import { ArgumentsHost } from '@nestjs/common';

export abstract class BaseExceptionFilter {
    protected responseError(host: ArgumentsHost, code, message, errors = null) {
        const ctx = host.switchToHttp();
        ctx.getResponse<Response>().status(code).json({
            message: message,
            errors: errors
        });
    }
}
