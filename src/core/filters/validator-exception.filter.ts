import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { BaseExceptionFilter } from './base-exception.filter';
import { I18nService } from 'nestjs-i18n';
import { ValidateException } from '../exceptions/validate.exception';
import { startCase } from 'lodash';

@Catch()
export class ValidatorExceptionFilter extends BaseExceptionFilter implements ExceptionFilter {
    constructor(private i18n: I18nService) {
        super();
    }

    async catch(exception: ValidateException, host: ArgumentsHost) {
        let language = host.switchToHttp().getRequest().i18nLang;
        let response = exception.getResponse() as any;
        await this.convertValidationErrors(response, language);
        this.responseError(host, exception.getStatus(), exception.message, exception.getResponse());
    }

    async convertValidationErrors(validatorError, language: string) {
        for (let key of Object.keys(validatorError)) {
            let messages = [];
            for (let message of validatorError[key].messages) {
                messages.push(await this.getValidationMessage(message, language));
            }
            validatorError[key].messages = messages;
            if (validatorError[key].children && Object.keys(validatorError[key].children).length) {
                await this.convertValidationErrors(validatorError[key].children, language);
            }
        }
    }

    async getValidationMessage(validatorMessage, language: string) {
        let translateMessage = '';
        if (validatorMessage.message.startsWith('each value in')) {
            translateMessage += await this.i18n.t('each value in', { lang: language });
            translateMessage += ' ';
            validatorMessage.message = validatorMessage.message.replace('each value in ', '');
        }
        translateMessage += await this.i18n.t(`${validatorMessage.message}`, {
            lang: language,
            args: {
                ...validatorMessage.detail,
                property: startCase(validatorMessage.detail.property)
            }
        });
        return translateMessage;
    }
}
