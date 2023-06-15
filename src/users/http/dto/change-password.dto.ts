import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Password } from '../validators/password.validator';

export class ChangePasswordDto {
    @ApiProperty()
    @IsString()
    @Password()
    oldPassword: string;

    @ApiProperty()
    @IsString()
    @Password()
    newPassword: string;
}
