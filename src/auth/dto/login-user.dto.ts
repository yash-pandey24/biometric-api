import { IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsString()
  user_name!: string;

  @IsString()
  @MinLength(4)
  password!: string;
}