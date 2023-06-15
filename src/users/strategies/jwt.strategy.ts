import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserEntity } from '../entities/user.entity';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../services/user.service';
import { env } from '~config/env.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: env.JWT.SECRET
        });
    }

    async validate(payload: { id: string }): Promise<UserEntity> {
        const user = await this.userService.findByIdNotFail(payload.id);
        if (!user) {
            throw new UnauthorizedException({ translate: 'error.unauthorized' });
        }
        return user;
    }
}
