import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export const Pagination = createParamDecorator(
    (paginationParams, ctx: ExecutionContext) => {
        if (!paginationParams) {
            paginationParams = { page: 'page', perPage: 'perPage' };
        }
        if (!paginationParams.page) {
            paginationParams.page = 'page';
        }
        if (!paginationParams.perPage) {
            paginationParams.perPage = 'perPage';
        }
        const request = ctx.switchToHttp().getRequest();
        return {
            page: Math.max(request.query[paginationParams.page], 1 || 1),
            perPage: Math.min(request.query[paginationParams.perPage] || 10, 1000)
        };
    },
    [
        (target: any, key: string) => {
            ApiQuery({
                name: 'page',
                schema: { default: 1, type: 'number', minimum: 1 },
                required: false
            })(target, key, Object.getOwnPropertyDescriptor(target, key));
            ApiQuery({
                name: 'perPage',
                schema: { default: 10, type: 'number', minimum: 1, maximum: 1000 },
                required: false
            })(target, key, Object.getOwnPropertyDescriptor(target, key));
        }
    ]
);

export interface PaginationParams {
    page: number;
    perPage: number;
}
