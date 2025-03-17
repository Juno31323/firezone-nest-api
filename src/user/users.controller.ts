// src/users/users.controller.ts
import { Controller, Put, Body, UseGuards, Request, Delete, UnauthorizedException, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Put('firecenter')
  async updateFireCenter(@Request() req, @Body() body: { fireStation: string }) {
    const userId = req.user?.userId; // JWT 토큰에서 사용자 ID 추출
    const updatedUser = await this.usersService.updateFireCenter(userId, body.fireStation);
    return {
      message: '소방서가 성공적으로 변경되었습니다.',
      fireStation: updatedUser.fireStation,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    const userId = req.user?.userId;
    const user = await this.usersService.findById(userId);
    return { username: user?.username, fireStation: user?.fireStation }; // fireStation 반환
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteAccount(@Request() req) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedException('유효하지 않은 인증 정보입니다.');
    }
    await this.usersService.deleteUser(userId);
    return { message: '회원탈퇴가 완료되었습니다.' };
  }
}