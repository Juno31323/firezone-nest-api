import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser: User = {
    id: 1,
    username: 'testuser',
    password: 'hashedpassword',
    fireStation: '강남소방서',
  };

  const mockRequest = {
    user: { userId: 1 },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            updateFireCenter: jest.fn().mockResolvedValue({ ...mockUser, fireStation: '서초소방서' }),
            findById: jest.fn().mockResolvedValue(mockUser),
            deleteUser: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true }) // JwtAuthGuard 모킹
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  describe('updateFireCenter', () => {
    it('should update the user’s fire station and return success message', async () => {
      const body = { fireStation: '서초소방서' };
      const result = await controller.updateFireCenter(mockRequest, body);
      expect(result).toEqual({
        message: '소방서가 성공적으로 변경되었습니다.',
        fireStation: '서초소방서',
      });
      expect(service.updateFireCenter).toHaveBeenCalledWith(1, '서초소방서');
    });
  
    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(service, 'updateFireCenter').mockRejectedValueOnce(new NotFoundException());
      await expect(controller.updateFireCenter(mockRequest, { fireStation: '서초소방서' })).rejects.toThrow(NotFoundException);
    });
  });
  
  describe('getProfile', () => {
    it('should return the user profile', async () => {
      const result = await controller.getProfile(mockRequest);
      expect(result).toEqual({
        username: 'testuser',
        fireStation: '강남소방서',
      });
      expect(service.findById).toHaveBeenCalledWith(1);
    });
  
    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(service, 'findById').mockRejectedValueOnce(new NotFoundException());
      await expect(controller.getProfile(mockRequest)).rejects.toThrow(NotFoundException);
    });
  });
});