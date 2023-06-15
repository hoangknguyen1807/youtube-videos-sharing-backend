import { UserEntity } from '~users/entities/user.entity';

export type RequestDtoType = {
    user: UserEntity;
    query: any;
    params: any;
};
