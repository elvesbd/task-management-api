import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { User } from '@core/user/model';
import { CreateUserUseCase } from '@core/user/usecases';
import { UserRepository } from '@core/user/ports/repository';
import { UserDataBuilder } from '@test/__mocks__/data-builder/user';

describe('CreateUserUseCase', () => {
  let sut: CreateUserUseCase;
  let userRepository: UserRepository;

  const input = UserDataBuilder.aUser().build();
  const user = User.create(input);

  beforeEach(async () => {
    jest.clearAllMocks();

    const UserRepositoryProvider = {
      provide: UserRepository,
      useValue: {
        findByEmail: jest.fn().mockResolvedValue(null),
        save: jest.fn().mockResolvedValue(0),
      },
    };

    const app: TestingModule = await Test.createTestingModule({
      providers: [CreateUserUseCase, UserRepositoryProvider],
    }).compile();

    sut = app.get<CreateUserUseCase>(CreateUserUseCase);
    userRepository = app.get<UserRepository>(UserRepository);
  });

  it('should defined', () => {
    expect(sut).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('execute', () => {
    it('should throw BadRequestException if user already exists', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(user);

      await expect(sut.execute(input)).rejects.toThrow(
        new BadRequestException('User already exists with this email!'),
      );
    });
  });
});
