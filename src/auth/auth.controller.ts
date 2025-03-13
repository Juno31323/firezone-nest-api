import { Controller, Post, Body, HttpCode, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.username, loginDto.password);
  }

  @Post('register')
  @HttpCode(201)
  async register(@Body() registerDto: RegisterDto) {
    const { username, password, fireStation, autoLogin } = registerDto;

    if (!username || !password || !fireStation) {
      throw new UnauthorizedException('모든 필드를 입력해주세요.');
    }

    return this.authService.register(username, password, fireStation, autoLogin);
  }


}