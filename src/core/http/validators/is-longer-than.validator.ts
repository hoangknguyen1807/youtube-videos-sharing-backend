import { isFunction } from '@nestjs/common/utils/shared.utils';
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator';
import { getConnection } from 'typeorm';
import { CustomCheckColumn } from '~core/interfaces/custom-check-column';
import { ColumnTypes } from '~core/types/column-type.type';

@ValidatorConstraint({ async: true })
export class IsLongerThanValidator implements ValidatorConstraintInterface {
    static async getValue(constraint: any, body: any) {
        const { property, table, column } = constraint;
        const dataValue = body[property];

        if (!dataValue) {
            const value: ColumnTypes = isFunction(constraint.value) ? constraint.value(body) : constraint.value;
            const query = getConnection()
                .createQueryBuilder()
                .from(table, table)
                .select(`"${property}"`)
                .where({ [column]: value });

            const data = await query.limit(1).getRawOne();
            if (!data) {
                return false;
            }
            return data[property];
        }

        return dataValue;
    }

    async validate(propertyValue: number, args: ValidationArguments) {
        const inputValue = await IsLongerThanValidator.getValue(args.constraints[0], args.object);

        return propertyValue > inputValue;
    }
}

export function IsLongerThan(property: string, custom: CustomCheckColumn, validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        let message = 'Bid price must be greater than current price.';
        validationOptions = validationOptions || ({ message } as any);

        registerDecorator({
            name: 'IsLongerThan',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [
                {
                    ...custom,
                    property
                }
            ],
            options: validationOptions,
            validator: IsLongerThanValidator
        });
    };
}
