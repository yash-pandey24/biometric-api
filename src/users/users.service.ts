import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { and, eq, ilike, sql, SQL } from 'drizzle-orm';
import { FilterUsersDto } from './dto/filter-users.dto';

import { DRIZZLE_DB } from '../db/db.provider';
import { db } from '../db/db';
import { users } from '../db/schema';
import { CreateNewUserDto } from './dto/create-new-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
  @Inject(DRIZZLE_DB)
  private readonly drizzleDb: typeof db,
) {}

  async createNewUser(createNewUserDto: CreateNewUserDto) {
    const existingUser = await this.drizzleDb
      .select()
      .from(users)
      .where(eq(users.userName, createNewUserDto.user_name));

    if (existingUser.length > 0) {
      throw new BadRequestException({
        success: false,
        message: 'Username already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(createNewUserDto.password, 10);
    const now = new Date();

    try {
      await this.drizzleDb.insert(users).values({
        userName: createNewUserDto.user_name,
        passwordHash: hashedPassword,
        fullName: createNewUserDto.full_name,
        email: createNewUserDto.email ?? null,
        mobileNumber: createNewUserDto.mobile_number ?? null,
        userType: createNewUserDto.user_type,
        isDeleted: false,
        createdAt: now,
        createdBy: createNewUserDto.created_by,
        updatedAt: now,
        updatedBy: createNewUserDto.updated_by,
        lastLoginAt: null,
        mvcc: 1,
      });

      return {
        success: true,
        message: 'User created successfully',
      };
    } catch {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to create user',
      });
    }
  }

  async getAllUsers(filterUsersDto: FilterUsersDto) {
    const {
      page = 1,
      limit = 10,
      user_type,
      user_name,
      is_deleted,
    } = filterUsersDto;

    const offset = (page - 1) * limit;

    const conditions: SQL<unknown>[] = [];

    if (user_type) {
      conditions.push(eq(users.userType, user_type));
    }

    if (user_name) {
      conditions.push(ilike(users.userName, `%${user_name}%`));
    }

    if (is_deleted !== undefined) {
      conditions.push(eq(users.isDeleted, is_deleted));
    }

    const whereCondition =
      conditions.length > 0 ? and(...conditions) : undefined;

    const data = await this.drizzleDb
      .select({
        user_id: users.userId,
        user_name: users.userName,
        full_name: users.fullName,
        email: users.email,
        mobile_number: users.mobileNumber,
        user_type: users.userType,
        is_deleted: users.isDeleted,
        created_at: users.createdAt,
        created_by: users.createdBy,
        updated_at: users.updatedAt,
        updated_by: users.updatedBy,
        last_login_at: users.lastLoginAt,
        mvcc: users.mvcc,
      })
      .from(users)
      .where(whereCondition)
      .limit(limit)
      .offset(offset);

    const totalResult = await this.drizzleDb
      .select({
        count: sql<number>`count(*)`,
      })
      .from(users)
      .where(whereCondition);

    const total = Number(totalResult[0]?.count ?? 0);
    const total_pages = Math.ceil(total / limit);

    // 🛑 HANDLE INVALID PAGE
    if (total > 0 && page > total_pages) {
      return {
        success: false,
        message: `Requested page (${page}) exceeds total available pages (${total_pages})`,
        data: [],
        pagination: {
          page,
          limit,
          total,
          total_pages,
        },
      };
    }
      // ✅ SUCCESS RESPONSE (THIS WAS MISSING BEFORE)
      return {
        success: true,
        message: 'Users fetched successfully',
        data,
        pagination: {
          page,
          limit,
          total,
          total_pages,
        },
      };
  }

  async getUserById(id: number) {
    const result = await this.drizzleDb
      .select({
        user_id: users.userId,
        user_name: users.userName,
        full_name: users.fullName,
        email: users.email,
        mobile_number: users.mobileNumber,
        user_type: users.userType,
        is_deleted: users.isDeleted,
        created_at: users.createdAt,
        updated_at: users.updatedAt,
      })
      .from(users)
      .where(and(eq(users.userId, id), eq(users.isDeleted, false)));

    if (result.length === 0) {
      throw new NotFoundException({
        success: false,
        message: 'User not found',
      });
    }

    return {
      success: true,
      message: 'User fetched successfully',
      data: result[0],
    };
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const existingUser = await this.drizzleDb
      .select()
      .from(users)
      .where(and(eq(users.userId, id), eq(users.isDeleted, false)));

    if (existingUser.length === 0) {
      throw new NotFoundException({
        success: false,
        message: 'User not found',
      });
    }

    if (updateUserDto.user_name) {
      const duplicateUser = await this.drizzleDb
        .select()
        .from(users)
        .where(eq(users.userName, updateUserDto.user_name));

      if (duplicateUser.length > 0 && duplicateUser[0].userId !== id) {
        throw new BadRequestException({
          success: false,
          message: 'Username already exists',
        });
      }
    }

    const updatePayload: Record<string, any> = {
      updatedAt: new Date(),
      updatedBy: updateUserDto.updated_by ?? existingUser[0].updatedBy,
      mvcc: (existingUser[0].mvcc ?? 0) + 1,
    };

    if (updateUserDto.user_name !== undefined) {
      updatePayload.userName = updateUserDto.user_name;
    }

    if (updateUserDto.full_name !== undefined) {
      updatePayload.fullName = updateUserDto.full_name;
    }

    if (updateUserDto.email !== undefined) {
      updatePayload.email = updateUserDto.email;
    }

    if (updateUserDto.mobile_number !== undefined) {
      updatePayload.mobileNumber = updateUserDto.mobile_number;
    }

    if (updateUserDto.user_type !== undefined) {
      updatePayload.userType = updateUserDto.user_type;
    }

    if (updateUserDto.password !== undefined) {
      updatePayload.passwordHash = await bcrypt.hash(updateUserDto.password, 10);
    }

    try {
      await this.drizzleDb
        .update(users)
        .set(updatePayload)
        .where(eq(users.userId, id));

      return {
        success: true,
        message: 'User updated successfully',
      };
    } catch {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to update user',
      });
    }
  }

  async deleteUser(id: number) {
    const existingUser = await this.drizzleDb
      .select()
      .from(users)
      .where(and(eq(users.userId, id), eq(users.isDeleted, false)));

    if (existingUser.length === 0) {
      throw new NotFoundException({
        success: false,
        message: 'User not found',
      });
    }

    try {
      await this.drizzleDb
        .update(users)
        .set({
          isDeleted: true,
          updatedAt: new Date(),
          mvcc: (existingUser[0].mvcc ?? 0) + 1,
        })
        .where(eq(users.userId, id));

      return {
        success: true,
        message: 'User deleted successfully',
      };
    } catch {
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to delete user',
      });
    }
  }
}