import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.usersService.findOne(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('잘못된 사용자 이름 또는 비밀번호');
    }
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(username: string, password: string, fireStation: string, autoLogin: boolean = false) {
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const newUser = await this.usersService.create(username, hashedPassword, fireStation);

      if (autoLogin) {
        return this.login(username, password);
      } else {
        return { message: '회원가입 완료. 로그인 페이지로 이동하세요.' };
      }
    } catch (error) {
      if (error.message === 'DUPLICATE_USERNAME') {
        throw new UnauthorizedException('이미 사용 중인 사용자 이름');
      }
      throw new Error('회원가입 중 오류 발생');
    }
  }
  
}