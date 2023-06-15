import { YouTubeVideoStatusEnum } from '~youtube-videos/enums/youtube-video-status.enum';

export interface ItemOptions {
    userId?: string;
    status: YouTubeVideoStatusEnum
}
