import { BaseEntity } from '~core/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { UserEntity } from '~users/entities/user.entity';
import { YouTubeVideoStatusEnum } from '~youtube-videos/enums/youtube-video-status.enum';

@Entity('YouTubeVideo')
export class YouTubeVideoEntity extends BaseEntity {
    @Column({ type: 'uuid' })
    userId: string;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'varchar', length: 255 })
    description: string;

    @Column({ type: 'varchar', length: 1000 })
    url: string;

    @Column({ type: 'varchar', length: 1000 })
    thumbnailUrl: string;

    @Column({ type: 'enum', enum: YouTubeVideoStatusEnum, default: YouTubeVideoStatusEnum.ACTIVE })
    status: YouTubeVideoStatusEnum;

    @ManyToOne(() => UserEntity, (user) => user.sharedVideos, { onDelete: 'CASCADE' })
    user: UserEntity;
}
