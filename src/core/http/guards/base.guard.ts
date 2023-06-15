import { UuidException } from '~core/exceptions/uuid.exception';
import { UserEntity } from '~users/entities/user.entity';
import { ExecutionContext } from '@nestjs/common';
import { isUUID } from 'class-validator';

export class BaseGuard {
    getUserFromContext(context: ExecutionContext): UserEntity {
        const request = context.switchToHttp().getRequest();
        return request.user;
    }

    getId(context: ExecutionContext, key = 'id') {
        let request = context.switchToHttp().getRequest();
        let id = request.params[key];
        if (!isUUID(id)) {
            throw new UuidException(key);
        }

        return id;
    }
}
