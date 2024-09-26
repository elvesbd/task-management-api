import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { FindByIdUserUseCase } from '@core/user/usecases';
import { UserRepository } from '@core/user/ports/repository';
import { UserDataBuilder } from '@test/__mocks__/data-builder/user';

describe('FindByIdUserUseCase', () => {
  let sut: FindByIdUserUseCase;
  let userRepository: UserRepository;

  const user = UserDataBuilder.aUser().withId().build();

  beforeEach(async () => {
    jest.clearAllMocks();

    const UserRepositoryProvider = {
      provide: UserRepository,
      useValue: {
        findByIdAndTenantId: jest.fn().mockResolvedValue(user),
      },
    };

    const app: TestingModule = await Test.createTestingModule({
      providers: [FindByIdUserUseCase, UserRepositoryProvider],
    }).compile();

    sut = app.get<FindByIdUserUseCase>(FindByIdUserUseCase);
    userRepository = app.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('execute', () => {
    const input = {
      id: '086229dc-e8c6-72cc-b599-c938df401741',
      tenantId: '019229dc-e8c6-72cc-b599-c938df401967',
    };

    it('should call userRepository findById once', async () => {
      await sut.execute(input);

      expect(userRepository.findByIdAndTenantId).toHaveBeenCalledTimes(1);
      expect(userRepository.findByIdAndTenantId).toHaveBeenCalledWith(
        input.id,
        input.tenantId,
      );
    });
  });
});
