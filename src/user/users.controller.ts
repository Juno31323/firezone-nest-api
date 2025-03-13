// src/users/users.controller.ts
import { Controller, Put, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Put('firecenter')
  async updateFireCenter(@Request() req, @Body() body: { fireStation: string }) {
    const userId = req.user.id; // JWT 토큰에서 사용자 ID 추출
    const updatedUser = await this.usersService.updateFireCenter(userId, body.fireStation);
    return {
      message: '소방서가 성공적으로 변경되었습니다.',
      fireStation: updatedUser.fireStation,
    };
  }
}