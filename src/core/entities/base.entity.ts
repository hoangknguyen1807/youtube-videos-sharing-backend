import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { TimestampTransformer } from '../transformers/timestamp.transformer';

export abstract class BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({ type: 'timestamp', transformer: new TimestampTransformer() })
    createdAt: number;

    @UpdateDateColumn({
        type: 'timestamp',
        transformer: new TimestampTransformer()
    })
    updatedAt: number;

    @DeleteDateColumn({
        type: 'timestamp',
        transformer: new TimestampTransformer()
    })
    deletedAt: number;
}
