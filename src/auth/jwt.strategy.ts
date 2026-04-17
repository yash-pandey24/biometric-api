import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }
    async validate(payload: {
    user_id: number;
    user_name: string;
    user_type: string;
    iat: number;
    exp: number;
  }) {
    console.log('JWT validated payload:', payload);

    return {
      user_id: payload.user_id,
      user_name: payload.user_name,
      user_type: payload.user_type,
    };
  }
}