import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(payload: {
    user_id: number;
    user_name: string;
    user_type: string;
  }) {
    return this.jwtService.sign(payload);
  }
}