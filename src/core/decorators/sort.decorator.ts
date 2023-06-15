import { ValidateException } from './../exceptions/validate.exception';
import { ApiQuery } from '@nestjs/swagger';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export function Sort(sortParams: any): any {
    return (target: any, key: string, descriptor: any) => {
        ApiQuery({
            name: 'sortField',
            enum: sortParams.allowedFields,
            schema: { default: 'createdAt', type: 'string' },
            required: false
        })(target, key, Object.getOwnPropertyDescriptor(target, key));
        ApiQuery({
            name: 'sortDirection',
            schema: { default: 'DESC', type: 'string' },
            enum: ['ASC', 'DESC'],
            required: false
        })(target, key, Object.getOwnPropertyDescriptor(target, key));
        return sortDecorator(sortParams)(target, key, descriptor);
    };
}

const sortDecorator = createParamDecorator((sortParams: any, ctx: ExecutionContext) => {
    if (!sortParams) {
        sortParams = { sortField: 'sortField', sortDirection: 'sortDirection' };
    }
    if (!sortParams.sortField) {
        sortParams.sortField = 'sortField';
    }
    if (!sortParams.sortDirection) {
        sortParams.sortDirection = 'sortDirection';
    }
    const request = ctx.switchToHttp().getRequest();

    const sortField = request.query[sortParams.sortField] || 'createdAt';
    const sortDirection = (request.query[sortParams.sortDirection] || 'DESC').toUpperCase();

    if (!sortParams.allowedFields || (sortField !== 'createdAt' && !sortParams.allowedFields.includes(sortField))) {
        throw new ValidateException([
            {
                property: 'sortField',
                constraints: {
                    invalidField: { message: 'The sort field is invalid.', detail: {} } as any
                }
            }
        ]);
    }

    if (!['ASC', 'DESC'].includes(sortDirection)) {
        throw new ValidateException([
            {
                property: 'sortDirection',
                constraints: {
                    invalidDirection: { message: 'The sort direction is invalid.', detail: {} } as any
                }
            }
        ]);
    }

    return {
        sortField,
        sortDirection
    };
});

export type SortParams = {
    sortField: string;
    sortDirection: 'ASC' | 'DESC';
};
