import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator';
import { IsLongerThanValidator } from '~core/http/validators/is-longer-than.validator';
import { CustomCheckColumn } from '~core/interfaces/custom-check-column';

@ValidatorConstraint({ async: true })
export class IsLessThanValidator implements ValidatorConstraintInterface {
    async validate(propertyValue: number, args: ValidationArguments) {
        const inputValue = await IsLongerThanValidator.getValue(args.constraints[0], args.object);
        return propertyValue < inputValue;
    }
}

export function IsLessThan(property: string, custom: CustomCheckColumn, validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        let message = 'The bid price exceeds account amount.';
        validationOptions = validationOptions || ({ message } as any);

        registerDecorator({
            name: 'IsEqualOrLessThan',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [
                {
                    ...custom,
                    property
                }
            ],
            options: validationOptions,
            validator: IsLessThanValidator
        });
    };
}
