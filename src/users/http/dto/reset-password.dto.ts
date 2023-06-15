import { IsNotEmpty } from 'class-validator';
import { CheckResetTokenDto } from './check-reset-token.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Password } from '../validators/password.validator';

export class ResetPasswordDto extends CheckResetTokenDto {
    @ApiProperty()
    @IsNotEmpty()
    @Password()
    password: string;
}
