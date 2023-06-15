import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class MaxDigitsValidator implements ValidatorConstraintInterface {
    validate(propertyValue: number, args: ValidationArguments) {
        const [precision, scale] = args.constraints;
        const [precisionPart, decimalPart] = String(propertyValue).split('.');
        const isValidPrecision = precision >= precisionPart.length;

        if (scale && decimalPart) {
            return isValidPrecision && scale >= decimalPart.length;
        }

        return isValidPrecision;
    }
}

export function MaxDigits(precision: number, scale?: number, validationOptions?: ValidationOptions) {
    let message = { message: '$property is exceeding $constraint1 permitted digits.' };
    if (precision && scale) {
        message.message =
            '$property is exceeding $constraint1 permitted digits or scale exceeding $constraint2 permitted digits';
    }
    validationOptions = { ...message, ...validationOptions } as any;
    return function (object: any, propertyName) {
        registerDecorator({
            name: 'MaxDigits',
            target: object.constructor,
            propertyName,
            constraints: [precision, scale],
            options: validationOptions,
            validator: MaxDigitsValidator
        });
    };
}
