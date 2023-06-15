import { ValidateException } from '../exceptions/validate.exception';
import { ApiQuery } from '@nestjs/swagger';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export function Sorts(sortParams: any): any {
    return (target: any, key: string, descriptor: any) => {
        ApiQuery({
            description: `Available values: ${sortParams.allowedFields}`,
            example: 'field1,field2:[ ASC(default) | DESC ],...',
            name: 'sortFields',
            schema: { default: 'createdAt:DESC', type: 'string' },
            required: false
        })(target, key, Object.getOwnPropertyDescriptor(target, key));
        return sortDecorator(sortParams)(target, key, descriptor);
    };
}

const sortDecorator = createParamDecorator((sortParams: any, ctx: ExecutionContext): SortMultipleParams[] => {
    if (!sortParams) {
        sortParams = { sortFields: 'sortFields' };
    }
    if (!sortParams.sortFields) {
        sortParams.sortFields = 'sortFields';
    }
    const request = ctx.switchToHttp().getRequest();

    const fields: string = request.query[sortParams.sortFields] ? request.query[sortParams.sortFields].trim() : '';
    const sortFields: string = fields || 'createdAt:DESC';
    let sortOrders: SortMultipleParams[] = sortFields
        .split(',')
        .filter((sort) => sort)
        .map((sort: string) => {
            const sortArr: string[] = sort.split(':', 2);
            let sortOrder: SortMultipleParams = {
                field: sortArr[0].trim(),
                direction: ((sortArr[1] ? sortArr[1].toUpperCase() : undefined) as any) || 'ASC'
            };
            validateField(sortParams.allowedFields, sortOrder.field);
            validateDirection(sortOrder.direction);

            return sortOrder;
        });

    return sortOrders;
});

function validateField(allowedFields, field) {
    if (!allowedFields.includes(field)) {
        throw new ValidateException([
            {
                property: 'sortFields',
                constraints: {
                    invalidField: {
                        message: `The sort field [${field}] is invalid.`,
                        detail: {}
                    } as any
                }
            }
        ]);
    }
}

function validateDirection(direction) {
    if (!['ASC', 'DESC'].includes(direction)) {
        throw new ValidateException([
            {
                property: 'sortFields',
                constraints: {
                    invalidDirection: {
                        message: `The sort direction : ${direction} is invalid.`,
                        detail: {}
                    } as any
                }
            }
        ]);
    }
}

export type SortMultipleParams = {
    field: string;
    direction: 'ASC' | 'DESC';
};
