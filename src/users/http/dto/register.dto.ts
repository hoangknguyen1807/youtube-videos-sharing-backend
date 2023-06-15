import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { Unique } from '~core/http/validators/unique.validator';
import { UserEntity } from '~users/entities/user.entity';
import { Password } from '../validators/password.validator';

export class RegisterDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    @Unique(UserEntity, 'email')
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(40)
    @Password()
    password: string;
}
