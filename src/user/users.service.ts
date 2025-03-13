import { Injectable } from '@nestjs/common';
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
}