import { Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
export class FindAllEventsDto {
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    available?: boolean;
}
