import { ColumnTypes } from '~core/types/column-type.type';
import { BaseEntity } from '~core/entities/base.entity';

export interface CustomCheckColumn {
    table: { new (): BaseEntity };
    column: string;
    value: ((...args: any[]) => ColumnTypes) | ColumnTypes;
}
