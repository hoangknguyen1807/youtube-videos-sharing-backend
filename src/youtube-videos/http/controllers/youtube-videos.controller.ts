import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BaseController } from '~core/http/controllers/base.controller';
import { UserEntity } from '~users/entities/user.entity';
import { CurrentUser } from '~users/decorators/current-user.decorator';
import { JwtAuthGuard } from '~users/http/guards/jwt-auth.guard';
import { YouTubeVideosService } from '~youtube-videos/services/youtube-videos.service';
import { ShareYouTubeVideoDto } from '../dto/share-youtube-video.dto';
import { Pagination, PaginationParams } from '~core/decorators/pagination.decorator';
import { YouTubeVideoStatusEnum } from '~youtube-videos/enums/youtube-video-status.enum';

@Controller('videos')
@ApiTags('YouTubeVideo')
export class YouTubeVideosController extends BaseController {
    constructor(private youtubeVideoService: YouTubeVideosService) {
        super();
    }

    @Get()
    @ApiOperation({
        description: 'Get list all youtube videos shared'
    })
    getAllVideos(
        @Pagination() paginationParams: PaginationParams
    ) {
        return this.youtubeVideoService.getAll(paginationParams);
    }


    @Get('my-videos')
    @ApiOperation({
        description: `Get list paginated user's shared items by filter`
    })
    @ApiQuery({
        name: 'status',
        description: 'Filter by status',
        required: true,
        enum: YouTubeVideoStatusEnum
    })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    getByFilters(
        @CurrentUser() user: UserEntity,
        @Query('status') status: YouTubeVideoStatusEnum,
        @Pagination() paginationParams: PaginationParams
    ) {
        return this.youtubeVideoService.getByFilters({ userId: user.id, status }, paginationParams);
    }

    @Post()
    @ApiOperation({
        description: 'Share a YouTube video'
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async create(@CurrentUser() user: UserEntity, @Body() dto: ShareYouTubeVideoDto) {
        return this.youtubeVideoService.createOne(user, dto);
    }
}
