import { BadRequestException, CACHE_MANAGER, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../repositories/user.repository';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../entities/user.entity';
import { Cache } from 'cache-manager';
import moment from 'moment';
import { RegisterDto } from '~users/http/dto/register.dto';
import { env } from '~config/env.config';
import { LoginResponse } from '~users/interfaces/login-response.interface';

@Injectable()
export class AuthService {
    public constructor(
        @InjectRepository(UserRepository) private userRepo: UserRepository,
        private jwtService: JwtService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    async login(email: string, password: string) {
        let user = await this.userRepo.findOne({ email }, { select: ['id', 'password'] });
        if (!user || !user.password || !bcrypt.compareSync(password, user.password)) {
            throw new UnauthorizedException({ translate: 'error.email_or_password_wrong' });
        }
        await this.updateLastLoginAt(user.id);
        return await this.createLoginResult(user.id, email);
    }

    async createLoginResult(userId: string, email: string): Promise<LoginResponse> {
        let token = await this.jwtService.signAsync({ id: userId, email: email });
        let user = await this.userRepo.findById(userId);

        const accessToken = this.jwtService.sign(
            { id: userId, email: email },
            { secret: env.JWT.SECRET, expiresIn: env.JWT.EXPIRE }
        );
        const refreshToken = this.jwtService.sign(
            { id: userId, email: email },
            { secret: env.JWT.REFRESH_SECRET, expiresIn: env.JWT.REFRESH_EXPIRE }
        );

        return {
            user: user,
            token: accessToken,
            refreshToken: refreshToken,
            expireAt: ((await this.jwtService.decode(token)) as any).exp
        };
    }

    async getInviteInformation(inviteToken: string, columns: (keyof UserEntity)[] = undefined) {
        let user = await this.userRepo.findOneOrFail({
            where: { inviteToken },
            select: columns
        });

        return user;
    }

    async logout(token: string) {
        const tokenExpireAt = ((await this.jwtService.decode(token)) as any).exp;
        const blacklistTtl = tokenExpireAt - moment().unix();
        this.cacheManager.set(token, 1, { ttl: blacklistTtl });
    }

    private async verifyRefreshToken(refreshToken: string) {
        const payload = (await this.jwtService.decode(refreshToken)) as any;
        try {
            this.jwtService.verify(refreshToken, { secret: env.JWT.REFRESH_SECRET });
            const blacklistTtl = payload.exp - moment().unix();
            return { payload, blacklistTtl };
        } catch (e) {
            throw new BadRequestException({ translate: 'error.token_is_invalid_or_expired' });
        }
    }

    async refreshToken(refreshToken: string) {
        const { payload, blacklistTtl } = await this.verifyRefreshToken(refreshToken);
        await this.cacheManager.set(refreshToken, 1, { ttl: blacklistTtl });
        return this.createLoginResult(payload.id, payload.email);
    }

    async updateLastLoginAt(id: string) {
        await this.userRepo.update(id, { lastLoginAt: moment.utc() });
    }

    async register(signUpInfo: RegisterDto) {
        const hashedPassword = await bcrypt.hash(signUpInfo.password, env.SALT_ROUND);
        const user = await this.userRepo.save({
            email: signUpInfo.email,
            password: hashedPassword
        });

        return this.createLoginResult(user.id, user.email);
    }
}
