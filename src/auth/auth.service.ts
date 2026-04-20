import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

import { DRIZZLE_DB } from '../db/db.provider';
import { db } from '../db/db';
import { users } from '../db/schema';
import { LoginUserDto } from '../users/dto/login-user.dto';

@Injectable()
export class AuthService {
  private readonly refreshSecret: string;
  private readonly refreshExpiresIn: string;
  private readonly refreshSessionsByUser = new Map<number, Set<string>>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(DRIZZLE_DB)
    private readonly drizzleDb: typeof db,
  ) {
    this.refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') ??
      this.configService.get<string>('JWT_SECRET') ??
      '';
    this.refreshExpiresIn =
      this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d';

    if (!this.refreshSecret) {
      throw new Error(
        'JWT_REFRESH_SECRET or JWT_SECRET must be defined in environment variables',
      );
    }
  }

  generateToken(payload: {
    user_id: number;
    user_name: string;
    user_type: string;
  }) {
    return this.jwtService.sign(payload);
  }

  private createRefreshToken(payload: {
    user_id: number;
    user_name: string;
    user_type: string;
  }) {
    const sessionId = randomUUID();
    const token = this.jwtService.sign(
      { ...payload, token_type: 'refresh', session_id: sessionId },
      {
        secret: this.refreshSecret,
        expiresIn: this.refreshExpiresIn as any,
      },
    );

    const userSessions = this.refreshSessionsByUser.get(payload.user_id) ?? new Set();
    userSessions.add(sessionId);
    this.refreshSessionsByUser.set(payload.user_id, userSessions);

    return { token, sessionId };
  }

  private issueTokenPair(payload: {
    user_id: number;
    user_name: string;
    user_type: string;
  }) {
    const accessToken = this.generateToken(payload);
    const refresh = this.createRefreshToken(payload);

    return {
      access_token: accessToken,
      refresh_token: refresh.token,
    };
  }

  async refreshToken(refreshToken: string) {
    let payload: {
      user_id: number;
      user_name: string;
      user_type: string;
      token_type: string;
      session_id: string;
    };

    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.refreshSecret,
      });
    } catch {
      throw new UnauthorizedException({
        success: false,
        message: 'Invalid or expired refresh token',
      });
    }

    if (payload.token_type !== 'refresh') {
      throw new UnauthorizedException({
        success: false,
        message: 'Invalid refresh token type',
      });
    }

    const userSessions = this.refreshSessionsByUser.get(payload.user_id);
    if (!userSessions?.has(payload.session_id)) {
      throw new UnauthorizedException({
        success: false,
        message: 'Refresh token is revoked',
      });
    }

    userSessions.delete(payload.session_id);
    if (userSessions.size === 0) {
      this.refreshSessionsByUser.delete(payload.user_id);
    }

    const tokens = this.issueTokenPair({
      user_id: payload.user_id,
      user_name: payload.user_name,
      user_type: payload.user_type,
    });

    return {
      success: true,
      message: 'Token refreshed successfully',
      ...tokens,
    };
  }

  async logout(userId: number, refreshToken?: string) {
    if (refreshToken) {
      try {
        const payload: { user_id: number; session_id: string } =
          await this.jwtService.verifyAsync(refreshToken, {
            secret: this.refreshSecret,
          });

        if (payload.user_id === userId) {
          const userSessions = this.refreshSessionsByUser.get(userId);
          userSessions?.delete(payload.session_id);
          if (userSessions && userSessions.size === 0) {
            this.refreshSessionsByUser.delete(userId);
          }
        }
      } catch {
        // Keep logout idempotent even when client sends stale refresh token.
      }
    } else {
      this.refreshSessionsByUser.delete(userId);
    }

    return {
      success: true,
      message: 'Logout successful',
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const { user_name, password } = loginUserDto;

    const user = await this.drizzleDb
      .select()
      .from(users)
      .where(eq(users.userName, user_name));

    if (user.length === 0) {
      throw new UnauthorizedException({
        success: false,
        message: 'Invalid username or password',
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user[0].passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException({
        success: false,
        message: 'Invalid username or password',
      });
    }

    const payload = {
      user_id: user[0].userId,
      user_name: user[0].userName,
      user_type: user[0].userType,
    };

    const tokens = this.issueTokenPair(payload);

    return {
      success: true,
      message: 'Login successful',
      ...tokens,
    };
  }
}