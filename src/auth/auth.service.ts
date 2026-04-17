import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

import { DRIZZLE_DB } from '../db/db.provider';
import { db } from '../db/db';
import { users } from '../db/schema';
import { LoginUserDto } from '../users/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(DRIZZLE_DB)
    private readonly drizzleDb: typeof db,
  ) {}

  generateToken(payload: {
    user_id: number;
    user_name: string;
    user_type: string;
  }) {
    return this.jwtService.sign(payload);
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

    const token = this.generateToken(payload);

    return {
      success: true,
      message: 'Login successful',
      access_token: token,
    };
  }
}