import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator';

@ValidatorConstraint({ async: true })
class PasswordValidator implements ValidatorConstraintInterface {
    async validate(value: string) {
        let regex = new RegExp('(?=^.{8,}$)((?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$');
        return regex.test(value);
    }
}

export function Password(customs?: any[], validationOptions?: ValidationOptions) {
    validationOptions = validationOptions || ({ message: 'The $property is invalid.' } as any);
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: PasswordValidator
        });
    };
}
