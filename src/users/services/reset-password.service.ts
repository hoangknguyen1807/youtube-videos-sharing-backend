import { GoneException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../repositories/user.repository';
import { AuthenticationRepository } from '../repositories/authentication.repository';
import bcrypt from 'bcrypt';
import { isExpire } from '~core/helpers/time.helper';
import { env } from '~config/env.config';
import { makeAToken } from '~core/helpers/string.helper';

@Injectable()
export class ResetPasswordService {
    public constructor(
        @InjectRepository(AuthenticationRepository) private authRepo: AuthenticationRepository,
        @InjectRepository(UserRepository) private userRepo: UserRepository
    ) {}

    async checkToken(token: string) {
        let otp = await this.authRepo.findOneOrFail({ token: token }, { relations: ['user'] });
        if (!otp.isValid || isExpire(otp.expireAt)) {
            throw new GoneException({ translate: 'error.token_is_invalid_or_expired' });
        }

        return otp;
    }

    async createNewToken() {
        const token = makeAToken();
        const otp = this.authRepo.findOneOrFail({ token });

        if (!otp) {
            return await this.createNewToken();
        }

        return token;
    }

    async resetPassword(password: string, token: string) {
        let otp = await this.checkToken(token);
        otp.isValid = false;
        await this.authRepo.save(otp);
        await this.userRepo.update(otp.user.id, { password: bcrypt.hashSync(password, env.SALT_ROUND) });
    }
}
