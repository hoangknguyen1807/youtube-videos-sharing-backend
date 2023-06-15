import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { Global, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../repositories/user.repository';
import bcrypt from 'bcrypt';
import { ValidateFieldException } from '~core/exceptions/validate-field.exception';
import { env } from '~config/env.config';
import { UserEntity } from '~users/entities/user.entity';
import { FindManyOptions } from 'typeorm';

@Global()
@Injectable()
export class UserService {
    public constructor(@InjectRepository(UserRepository) private userRepo: UserRepository) {}

    find(options: FindManyOptions): Promise<UserEntity[]> {
        return this.userRepo.find(options);
    }

    findOne(options: FindOneOptions): Promise<UserEntity> {
        return this.userRepo.findOne(options);
    }

    public findUserById(id: string): Promise<UserEntity> {
        return this.userRepo.findById(id);
    }

    public findByIdNotFail(id: string): Promise<UserEntity> {
        return this.userRepo.findOne(id);
    }

    async changePassword(userId: string, newPassword: string, oldPassword: string): Promise<void> {
        const user = await this.userRepo.findOne({ id: userId }, { select: ['id', 'password'] });

        if (!bcrypt.compareSync(oldPassword, user.password)) {
            throw new ValidateFieldException('oldPassword', 'Your old password is incorrect.', 'wrongPass');
        }

        user.password = bcrypt.hashSync(newPassword, env.SALT_ROUND);
        await this.userRepo.update(user.id, user);
    }

    getInfo(id: string): Promise<UserEntity> {
        return this.findOne({
            where: { id },
        });
    }
}
