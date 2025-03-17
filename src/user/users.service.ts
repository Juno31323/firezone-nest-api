import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User | null> { // undefined 대신 null
    return this.usersRepository.findOneBy({ username });
  }

  async create(username: string, password: string, fireStation: string): Promise<User> {
    const existingUser = await this.usersRepository.findOne({ where: { username } });
    if (existingUser) {
      throw new Error('DUPLICATE_USERNAME');
    }
    const user = this.usersRepository.create({ username, password, fireStation });
    return this.usersRepository.save(user);
  }

  async updateFireCenter(userId: number, fireStation: string): Promise<User> {
    const user = await this.usersRepository.findOneOrFail({ where: { id: userId } });
    user.fireStation = fireStation;
    return this.usersRepository.save(user);
  }

  async deleteUser(userId: number): Promise<void> {
    if (!userId || isNaN(userId)) {
      throw new BadRequestException('유효한 사용자 ID가 필요합니다.');
    }
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    await this.usersRepository.delete(userId);
  }

}