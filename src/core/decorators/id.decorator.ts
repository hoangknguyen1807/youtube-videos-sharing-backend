import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { isUUID } from '@nestjs/common/utils/is-uuid';
import { UuidException } from '../exceptions/uuid.exception';
import { isString, isUndefined } from '@nestjs/common/utils/shared.utils';

type ParamOptions = {
    key: string;
    nullable: boolean;
};

function getParamOptions(options: ParamOptions | string, defaultKey) {
    let newOptions: ParamOptions = {
        key: defaultKey,
        nullable: false
    };
    if (isUndefined(options)) {
        newOptions.key = defaultKey;
    } else if (isString(options)) {
        newOptions.key = options;
    } else {
        newOptions.nullable = options.nullable;
        newOptions.key = options.key ? options.key : defaultKey;
    }

    return newOptions;
}

export const Id = createParamDecorator((options: ParamOptions | string, ctx: ExecutionContext) => {
    let paramOptions = getParamOptions(options, 'id');
    const request = ctx.switchToHttp().getRequest();
    let id = request.params[paramOptions.key] || request.query[paramOptions.key];
    if (!id && paramOptions.nullable) {
        return id;
    }
    if (!isUUID(id)) {
        throw new UuidException(paramOptions.key);
    }
    return id;
});

export const Ids = createParamDecorator((options: ParamOptions | string, ctx: ExecutionContext) => {
    let paramOptions = getParamOptions(options, 'ids');
    const request = ctx.switchToHttp().getRequest();
    let ids = request.query[paramOptions.key];
    if (!ids) {
        return [];
    }
    return ids
        .split(',')
        .map((id) => {
            if (!id && paramOptions.nullable) {
                return id;
            }
            if (!isUUID(id)) {
                throw new UuidException(paramOptions.key);
            }
            return id;
        })
        .filter((id) => id);
});
