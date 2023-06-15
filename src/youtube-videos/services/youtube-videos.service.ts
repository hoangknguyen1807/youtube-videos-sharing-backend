import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { YouTubeVideoEntity } from '~youtube-videos/entities/youtube-video.entity';
import { ShareYouTubeVideoDto } from '~youtube-videos/http/dto/share-youtube-video.dto';
import { ItemOptions } from '~youtube-videos/interfaces/item-options.interface';
import { YouTubeVideosRepository } from '~youtube-videos/repositories/youtube-videos.repository';
import { PaginationParams } from '~core/decorators/pagination.decorator';
import { AppSocket } from '~app.socket';
import { YouTubeVideoStatusEnum } from '~youtube-videos/enums/youtube-video-status.enum';
import axios from 'axios';
import { YouTubeVideoMetadataDto } from '~youtube-videos/http/dto/youtube-video-metadata.dto';
import { UserEntity } from '~users/entities/user.entity';

@Injectable()
export class YouTubeVideosService {
    public constructor(
        @Inject(AppSocket) private appSocket: AppSocket,
        private youtubeVideoRepo: YouTubeVideosRepository,
        // private userRepo: UserRepository
    ) {}

    async getAll(paginationParams: PaginationParams) {
        return await this.youtubeVideoRepo.paginate({ status: YouTubeVideoStatusEnum.ACTIVE }, paginationParams);
    }

    async getByFilters(options: ItemOptions, paginationParams: PaginationParams) {
        const data = await this.youtubeVideoRepo.paginate(options, paginationParams);
        return data;
    }

    async createOne(user: UserEntity, dto: ShareYouTubeVideoDto): Promise<YouTubeVideoEntity> {
        const response = await axios.get<YouTubeVideoMetadataDto>(`https://noembed.com/embed?dataType=json&url=${dto.url}`);
        const { thumbnail_url: thumbnailUrl, title } = response.data;

        const newVideo = await this.youtubeVideoRepo.save({
            ...dto,
            thumbnailUrl,
            title,
            description: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
            userId: user.id,
            status: YouTubeVideoStatusEnum.ACTIVE
        });
        const userField = { id: user.id, email: user.email };
        this.appSocket.server.emit('new-video-shared', {...newVideo, user: userField});
        return newVideo;
    }

    async updateOne(id: string, data: YouTubeVideoEntity): Promise<YouTubeVideoEntity> {
        await this.youtubeVideoRepo.update({ id }, data);

        return this.youtubeVideoRepo.findOne(id);
    }

    // async publish(id: string): Promise<YouTubeVideoEntity> {
    //     const bidItem = await this.youtubeVideoRepo.findOneOrFail({ id, sharedAt: IsNull() });
    //     await this.youtubeVideoRepo.update(
    //         { id },
    //         {
    //             ...bidItem,
    //             status: YouTubeVideoStatusEnum.ON_GOING,
    //             sharedAt: new Date()
    //         }
    //     );
    //     const bidItems = await this.getByFilters(
    //         { status: YouTubeVideoStatusEnum.ON_GOING, userId: '' },
    //         { page: 1, perPage: 10 }
    //     );
    //     this.appSocket.server.emit('get-bid-items', bidItems);

    //     return this.youtubeVideoRepo.findOne(id);
    // }

    // async placeBidding(bidItemId: string, userId: string, dto: BiddingDto): Promise<YouTubeVideoEntity> {
    //     const bidItem = await this.bidItemRepo.findOneOrFail({ id: bidItemId });
    //     if (userId === bidItem.userId) {
    //         throw new BadRequestException({ translate: 'error.bid_items.owner_not_bid' });
    //     }
    //     const { bidPrice } = dto;
    //     await this.bidItemRepo.update(
    //         { id: bidItemId },
    //         {
    //             ...bidItem,
    //             currentPrice: bidPrice,
    //             lastBidAt: new Date()
    //         }
    //     );
    //     await this.biddingService.createOne({
    //         bidItemId,
    //         userId,
    //         bidPrice
    //     });

    //     const deposit = await this.depositService.findOne({
    //         where: { userId }
    //     });
    //     await this.depositService.upsertOne({
    //         ...deposit,
    //         amount: deposit.amount - bidPrice
    //     });
    //     const bidItems = await this.getByFilters(
    //         { status: BidItemStatusEnum.ON_GOING, userId: '' },
    //         { page: 1, perPage: 10 }
    //     );
    //     this.appSocket.server.emit('get-bid-items', bidItems);

    //     return this.bidItemRepo.findOne(bidItemId);
    // }

    // async updateMultiCompleted(dto: UpdateMultiCompletedBidItems): Promise<YouTubeVideoEntity[]> {
    //     const { items } = dto;
    //     if (!items.length) {
    //         return [];
    //     }

    //     await ensureCompleted(
    //         items.map(async (item) => {
    //             const { id, status, completedStatus } = item;
    //             const bidItem = await this.youtubeVideoRepo.findOneOrFail(id);
    //             this.youtubeVideoRepo.update(
    //                 { id },
    //                 {
    //                     ...bidItem,
    //                     status
    //                 }
    //             );
    //         })
    //     );

    //     return this.youtubeVideoRepo.find({
    //         where: { id: In(map(items, 'id')) }
    //     });
    // }
}
