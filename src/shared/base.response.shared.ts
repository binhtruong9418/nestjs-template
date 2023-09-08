import { ApiProperty } from '@nestjs/swagger';

export class BaseResponse<T> {
  @ApiProperty()
  public data: T;

  @ApiProperty()
  public message: string = 'OK';

  @ApiProperty()
  public status: number = 200;

  constructor(partial: Partial<BaseResponse<T>>) {
    Object.assign(this, partial);
  }
}
