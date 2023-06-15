import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YouTubeVideosService } from './services/youtube-videos.service';
import { YouTubeVideosRepository } from './repositories/youtube-videos.repository';
import { YouTubeVideoEntity } from './entities/youtube-video.entity';
import { YouTubeVideosController } from './http/controllers/youtube-videos.controller';
import { AppSocket } from '~app.socket';

@Module({
    providers: [YouTubeVideosService, AppSocket],
    controllers: [YouTubeVideosController],
    exports: [YouTubeVideosService],
    imports: [TypeOrmModule.forFeature([YouTubeVideosRepository, YouTubeVideoEntity])]
})
export class YouTubeVideosModule {}
