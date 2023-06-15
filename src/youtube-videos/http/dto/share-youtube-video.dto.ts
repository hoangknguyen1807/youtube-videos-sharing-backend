import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ShareYouTubeVideoDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    url: string;
}
