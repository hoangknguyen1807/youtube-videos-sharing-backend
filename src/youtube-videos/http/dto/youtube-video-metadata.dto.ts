import { YouTubeVideoEntity } from '~youtube-videos/entities/youtube-video.entity';
import { IsEnum, IsNotEmpty, IsUUID, IsUrl, isURL } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class YouTubeVideoMetadataDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsUrl()
    url: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsUrl()
    thumbnail_url: string;

    @ApiProperty()
    @IsNotEmpty()
    title: string;
}
