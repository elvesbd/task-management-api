import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { UserRepository } from '@core/user/ports/repository';
import { UserDataBuilder } from '@test/__mocks__/data-builder/user';
import { DeleteUserUseCase } from './delete-user.usecase';

describe('DeleteUserUseCase', () => {
  let sut: DeleteUserUseCase;
  let userRepository: UserRepository;

  const user = UserDataBuilder.aUser().withId().build();

  beforeEach(async () => {
    jest.clearAllMocks();

    const UserRepositoryProvider = {
      provide: UserRepository,
      useValue: {
        findByIdAndTenantId: jest.fn().mockResolvedValue(user),
        delete: jest.fn(),
      },
    };

    const app: TestingModule = await Test.createTestingModule({
      providers: [DeleteUserUseCase, UserRepositoryProvider],
    }).compile();

    sut = app.get<DeleteUserUseCase>(DeleteUserUseCase);
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

    it('should call userRepository findByIdAndTenantId once', async () => {
      await sut.execute(input);

      expect(userRepository.findByIdAndTenantId).toHaveBeenCalledTimes(1);
      expect(userRepository.findByIdAndTenantId).toHaveBeenCalledWith(
        input.id,
        input.tenantId,
      );
    });

    it('should throw a NotFoundException if no user is found', async () => {
      jest
        .spyOn(userRepository, 'findByIdAndTenantId')
        .mockResolvedValueOnce(null);

      await expect(sut.execute(input)).rejects.toThrow(
        new NotFoundException(
          `User not found for tenant ID: ${input.tenantId}`,
        ),
      );
    });
  });
});
