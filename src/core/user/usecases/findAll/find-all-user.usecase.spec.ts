import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { FindAllUserUseCase } from '@core/user/usecases';
import { UserRepository } from '@core/user/ports/repository';
import { UserDataBuilder } from '@test/__mocks__/data-builder/user';

describe('FindAllUserUseCase', () => {
  let sut: FindAllUserUseCase;
  let userRepository: UserRepository;

  const tenant = UserDataBuilder.aUser().withId().build();

  beforeEach(async () => {
    jest.clearAllMocks();

    const TenantRepositoryProvider = {
      provide: UserRepository,
      useValue: {
        findAll: jest.fn().mockResolvedValue([tenant]),
      },
    };

    const app: TestingModule = await Test.createTestingModule({
      providers: [FindAllUserUseCase, TenantRepositoryProvider],
    }).compile();

    sut = app.get<FindAllUserUseCase>(FindAllUserUseCase);
    userRepository = app.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('execute', () => {
    const tenantId = '019229dc-e8c6-72cc-b599-c938df401967';

    it('should call userRepository findAll once', async () => {
      await sut.execute(tenantId);

      expect(userRepository.findAll).toHaveBeenCalledTimes(1);
      expect(userRepository.findAll).toHaveBeenCalledWith(tenantId);
    });

    it('should throw a NotFoundException if returns empty array', async () => {
      jest.spyOn(userRepository, 'findAll').mockResolvedValueOnce([]);

      await expect(sut.execute(tenantId)).rejects.toThrow(
        new NotFoundException(`No users found for tenant ID: ${tenantId}`),
      );
    });
  });
});
