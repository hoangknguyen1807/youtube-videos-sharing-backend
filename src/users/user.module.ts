import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './http/controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { AuthController } from './http/controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { env } from '~config/env.config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserEntity } from './entities/user.entity';
import { AuthenticationEntity } from './entities/authentication.entity';
import { AuthenticationRepository } from './repositories/authentication.repository';
import { ResetPasswordController } from './http/controllers/reset-password.controller';
import { ResetPasswordService } from './services/reset-password.service';

@Module({
    providers: [UserService, AuthService, JwtStrategy, ResetPasswordService],
    controllers: [UserController, AuthController, ResetPasswordController],
    exports: [UserService],
    imports: [
        TypeOrmModule.forFeature([UserRepository, UserEntity, AuthenticationEntity, AuthenticationRepository]),
        JwtModule.register({
            secret: env.JWT.SECRET,
            signOptions: {
                expiresIn: env.JWT.EXPIRE,
                algorithm: 'HS512'
            }
        }),
    ]
})
export class UserModule {}
