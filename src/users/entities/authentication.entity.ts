import { BaseEntity } from '~core/entities/base.entity';
import { TimestampTransformer } from '~core/transformers/timestamp.transformer';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('Authentication')
export class AuthenticationEntity extends BaseEntity {
    @Index()
    @Column({ length: 255 })
    token: string;

    @Column({
        type: 'timestamp',
        transformer: new TimestampTransformer(),
        nullable: true
    })
    expireAt: number | Date;

    @ManyToOne(() => UserEntity)
    user: UserEntity;

    @Column()
    userId: string;

    @Column({ default: true })
    isValid: boolean;
}
