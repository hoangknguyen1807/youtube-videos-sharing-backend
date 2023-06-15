import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
    findByEmail(email: string, options?: FindOneOptions<UserEntity>) {
        return this.findOneOrFail({ email }, options);
    }

    findById(id: string, options?: FindOneOptions<UserEntity>) {
        return this.findOneOrFail({ id }, options);
    }
}
