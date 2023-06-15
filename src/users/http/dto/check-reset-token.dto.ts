import { IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckResetTokenDto {
    @ApiProperty({
        description: 'A token, length = 32'
    })
    @IsNotEmpty()
    @Length(32)
    token: string;
}
