import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ example: 'admin_yash_1' })
  @IsString()
  user_name!: string;

  @ApiProperty({ example: 'Admin@123' })
  @IsString()
  password!: string;
}