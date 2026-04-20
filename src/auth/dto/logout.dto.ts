import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class LogoutDto {
  @ApiPropertyOptional({
    description:
      'Optional refresh token to revoke a specific session. If omitted, all sessions for the user are cleared.',
  })
  @IsOptional()
  @IsString()
  refresh_token?: string;
}
