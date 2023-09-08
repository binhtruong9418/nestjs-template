import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PaginationDto {
  @ApiProperty()
  @Type(() => Number)
  page: number;

  @ApiProperty()
  @Type(() => Number)
  size: number;
}
