import { RequestDtoType } from '~core/types/request-dto.type';
import { IsOptional } from 'class-validator';
import { ParentDto } from './parent.dto';

export abstract class RequestDto extends ParentDto {
    @IsOptional()
    protected requestDto: RequestDtoType;
}
