import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'The email of the user',
    type: String,
    example: 'abcd@gmail.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    type: String,
    example: 'abcd1234',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
