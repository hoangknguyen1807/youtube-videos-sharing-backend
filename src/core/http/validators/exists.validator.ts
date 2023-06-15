import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator';
import { getConnection } from 'typeorm';
import { isFunction, isNil, isUndefined } from '@nestjs/common/utils/shared.utils';

@ValidatorConstraint({ async: true })
export class ExistsValidator implements ValidatorConstraintInterface {
    async validate(value: any, args: ValidationArguments) {
        let body = args.object as any;
        let data = args.constraints[0];
        let customs = data.customs || [];
        let query = getConnection().createQueryBuilder().from(data.table, data.table).select('id');

        if (data.caseInsensitive) {
            query.where(` "${data.column}" ILIKE :value`, { value });
        } else {
            query.where(` "${data.column}" = :value`, { value });
        }
        for (let custom of customs) {
            let customValue;
            if (isFunction(custom.value)) {
                customValue = custom.value(body);
            } else {
                customValue = custom.value;
            }
            if (custom.exclude) {
                if (isUndefined(customValue) || isNil(customValue)) {
                    query.andWhere(` "${custom.column}" is not null`);
                } else {
                    query.andWhere(` "${custom.column}" != :customValue`, { customValue });
                }
            } else {
                if (isUndefined(customValue) || isNil(customValue)) {
                    query.andWhere(` "${custom.column}" is null`);
                } else {
                    query.andWhere(` "${custom.column}" = :customValue`, { customValue });
                }
            }
        }
        return !!(await query.limit(1).getRawOne());
    }
}

export function Exists(
    table,
    column: string,
    caseInsensitive: boolean = false,
    customs?: any[],
    validationOptions?: ValidationOptions
) {
    let message = { message: 'The $property does not exist.' };
    if (validationOptions && validationOptions.each) {
        message.message = 'each value in $property does not exist.';
    }
    validationOptions = { ...message, ...validationOptions } as any;
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [
                {
                    table,
                    column,
                    caseInsensitive,
                    customs
                }
            ],
            validator: ExistsValidator
        });
    };
}
