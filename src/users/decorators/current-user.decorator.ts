import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';

export const CurrentUser = createParamDecorator((data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: UserEntity }>();
    const user = request.user;

    return data ? user && user[data as keyof UserEntity] : user;
});
