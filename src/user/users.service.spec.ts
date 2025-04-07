import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUser: User = {
    id: 1,
    username: 'testuser',
    password: 'hashedpassword',
    fireStation: '강남소방서',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue(mockUser),
            findOne: jest.fn().mockResolvedValue(mockUser),
            findOneOrFail: jest.fn().mockResolvedValue(mockUser),
            create: jest.fn().mockReturnValue(mockUser),
            save: jest.fn().mockResolvedValue(mockUser),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('findOne', () => {
    it('should return a user by username', async () => {
      const result = await service.findOne('testuser');
      expect(result).toEqual(mockUser);
      expect(repository.findOneBy).toHaveBeenCalledWith({ username: 'testuser' });
    });

    it('should return null if user is not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(null);
      const result = await service.findOne('unknownuser');
      expect(result).toBeNull();
      expect(repository.findOneBy).toHaveBeenCalledWith({ username: 'unknownuser' });
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      const result = await service.findById('1');
      expect(result).toEqual(mockUser);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw an Error if id is not a valid number', async () => {
      await expect(service.findById('invalid')).rejects.toThrow('잘못된 사용자 ID입니다.');
    });

    it('should return null if user is not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(null);
      const result = await service.findById('2');
      expect(result).toBeNull();
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 2 });
    });
  });

  describe('create', () => {
    it('should create and return a new user', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null); // 기존 사용자 없음
      const result = await service.create('newuser', 'password123', '서초소방서');
      expect(result).toEqual(mockUser);
      expect(repository.create).toHaveBeenCalledWith({
        username: 'newuser',
        password: 'password123',
        fireStation: '서초소방서',
      });
      expect(repository.save).toHaveBeenCalledWith(mockUser);
    });

    it('should throw an Error if username already exists', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(mockUser);
      await expect(service.create('testuser', 'password123', '서초소방서')).rejects.toThrow(
        'DUPLICATE_USERNAME',
      );
    });
  });

  describe('updateFireCenter', () => {
    it('should update and return the user with new fire station', async () => {
      const result = await service.updateFireCenter(1, '서초소방서');
      expect(result.fireStation).toBe('서초소방서');
      expect(repository.findOneOrFail).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.save).toHaveBeenCalledWith({ ...mockUser, fireStation: '서초소방서' });
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(repository, 'findOneOrFail').mockRejectedValueOnce(new NotFoundException());
      await expect(service.updateFireCenter(2, '서초소방서')).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('should delete the user', async () => {
      await service.deleteUser(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw BadRequestException if userId is invalid', async () => {
      await expect(service.deleteUser(NaN)).rejects.toThrow(BadRequestException);
      await expect(service.deleteUser(undefined as any)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.deleteUser(2)).rejects.toThrow(NotFoundException);
    });
  });
});