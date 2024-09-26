import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { User } from '@core/user/model';
import { UserRole } from '@core/user/enum';
import { UpdateUserUseCase } from '@core/user/usecases';
import { UserRepository } from '@core/user/ports/repository';
import { UserDataBuilder } from '@test/__mocks__/data-builder/user';

describe('UpdateUserUseCase', () => {
  let sut: UpdateUserUseCase;
  let userRepository: UserRepository;

  const input = UserDataBuilder.aUser().build();
  const user = User.create(input);

  beforeEach(async () => {
    jest.clearAllMocks();

    const UserRepositoryProvider = {
      provide: UserRepository,
      useValue: {
        save: jest.fn().mockResolvedValue(0),
        findByEmail: jest.fn().mockResolvedValue(user),
      },
    };

    const app: TestingModule = await Test.createTestingModule({
      providers: [UpdateUserUseCase, UserRepositoryProvider],
    }).compile();

    sut = app.get<UpdateUserUseCase>(UpdateUserUseCase);
    userRepository = app.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('execute', () => {
    const tenantId = '019229dc-e8c6-72cc-b599-c938df401967';

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(null);

      await expect(sut.execute({ ...input, id: tenantId })).rejects.toThrow(
        new NotFoundException('Tenant not found!'),
      );
    });

    it('should call userRepository save on success', async () => {
      await sut.execute({ ...input, id: tenantId });

      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(expect.any(User));
    });
  });
});
