import { HttpException, HttpStatus, ValidationError } from '@nestjs/common';
import { isString } from '@nestjs/common/utils/shared.utils';

export class ValidateException extends HttpException {
    constructor(errors: ValidationError[]) {
        super({}, HttpStatus.UNPROCESSABLE_ENTITY);
        this['response' as any] = this.convertValidationErrors(errors);
    }

    private convertValidationErrors(errors: ValidationError[], parent: ValidationError = null) {
        let newErrors = {};
        errors.forEach((error) => {
            if (!parent || error.property !== parent.property) {
                newErrors[error.property] = this.convertValidationError(error);
            }
        });
        return newErrors;
    }

    private convertValidationError(error: ValidationError) {
        let newError = {
            children: undefined,
            messages: []
        };
        if (error.constraints) {
            newError.messages = Object.values(error.constraints).map((message) => {
                if (isString(message)) {
                    return {
                        message: message,
                        detail: {
                            property: error.property
                        }
                    };
                }
                return message;
            });
        }
        if (error.children && Object.keys(error.children).length) {
            error.children.forEach((child) => {
                if (child.property === error.property && child.constraints) {
                    newError.messages = newError.messages.concat(Object.values(child.constraints));
                }
            });
            newError.children = this.convertValidationErrors(error.children, error);
        }

        return newError;
    }
}
