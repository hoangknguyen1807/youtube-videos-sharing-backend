import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from './base-exception.filter';
import { I18nService } from 'nestjs-i18n';
import { EntityNotFoundError } from 'typeorm';
import { UuidException } from '../exceptions/uuid.exception';
import { ValidateException } from '../exceptions/validate.exception';
import { ValidatorExceptionFilter } from './validator-exception.filter';

@Catch()
export class HttpExceptionFilter extends BaseExceptionFilter implements ExceptionFilter {
    constructor(private i18n: I18nService) {
        super();
    }

    async catch(exception, host: ArgumentsHost) {
        let language = host.switchToHttp().getRequest().i18nLang;
        if (exception instanceof EntityNotFoundError) {
            await this.catchEntityNotFound(exception, host);
        } else if (exception instanceof UuidException) {
            const args = {
                field: exception.field
            };
            await this.catchBadRequestWithArgs(host, 'error.field_malformed', language, args);
        } else if (exception instanceof ValidateException) {
            await new ValidatorExceptionFilter(this.i18n).catch(exception, host);
        } else if (exception instanceof HttpException) {
            await this.catchHttpException(exception, host, language);
        } else if (exception.name === 'JsonWebTokenError') {
            this.responseError(host, HttpStatus.UNAUTHORIZED, exception.message);
        } else {
            console.log(exception);
            let message = await this.i18n.t('error.an_error_occurred', { lang: language });
            this.responseError(host, HttpStatus.INTERNAL_SERVER_ERROR, message);
        }
    }

    async catchHttpException(exception, host: ArgumentsHost, language: string) {
        let response = exception.getResponse() as any;
        if (response && response.translate) {
            let message = await this.i18n.t(response.translate, {
                lang: language,
                args: response.args
            });
            delete response.translate;
            delete response.args;
            this.responseError(host, exception.getStatus(), message, response);
        } else {
            this.responseError(host, exception.getStatus(), exception.message, exception.getResponse());
        }
    }

    async catchEntityNotFound(exception, host: ArgumentsHost) {
        const messageRegex = /"[a-zA-Z]+"/.exec(exception.message);
        let message = exception.message;
        if (messageRegex) {
            message = messageRegex[0].replace('"', '').replace('"', '');
        }
        this.responseError(
            host,
            HttpStatus.NOT_FOUND,
            await this.i18n.translate(`error.not_found.${message}`, {
                lang: host.switchToHttp().getRequest().i18nLang
            })
        );
    }

    async catchBadRequestWithArgs(host: ArgumentsHost, messageKey: string, language: string, args: any) {
        let message = await this.i18n.t(messageKey, {
            lang: language,
            args
        });
        this.responseError(host, HttpStatus.BAD_REQUEST, message);
    }
}
