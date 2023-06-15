import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsInWithoutTypeValidator implements ValidatorConstraintInterface {
    async validate(value: any, args: ValidationArguments) {
        let data = args.constraints[0];

        return data.values.findIndex((item) => item == value) > -1;
    }
}

export function IsInWithoutType(values: any[], validationOptions?: ValidationOptions) {
    validationOptions = validationOptions || ({ message: 'The $property is invalid.' } as any);
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [{ values }],
            validator: IsInWithoutTypeValidator
        });
    };
}
