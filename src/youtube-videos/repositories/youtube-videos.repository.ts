import _ from 'lodash';
import { EntityRepository, Repository } from 'typeorm';
import { YouTubeVideoEntity } from '~youtube-videos/entities/youtube-video.entity';
import { ItemOptions } from '~youtube-videos/interfaces/item-options.interface';
import { PaginationParams } from '~core/decorators/pagination.decorator';

@EntityRepository(YouTubeVideoEntity)
export class YouTubeVideosRepository extends Repository<YouTubeVideoEntity> {
    async paginate(options: ItemOptions, paginationParams: PaginationParams) {
        const { userId, status } = options;
        const { page, perPage } = paginationParams;
        let condition = { status };
        if (userId) {
            _.assignIn(condition, { userId });
        }
        
        const [items, count] = await this.createQueryBuilder('YouTubeVideo')
            .leftJoinAndSelect('YouTubeVideo.user', 'User')
            .where(condition)
            .orderBy('YouTubeVideo.createdAt', 'DESC')
            .skip((page - 1)*perPage)
            .take(perPage)
            .getManyAndCount();

        return { items, count };
    }
}
