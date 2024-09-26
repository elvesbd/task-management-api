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

  const input = UserDataBuilder.aUser().withId().build();
  const user = User.create(input);

  beforeEach(async () => {
    jest.clearAllMocks();

    const UserRepositoryProvider = {
      provide: UserRepository,
      useValue: {
        save: jest.fn().mockResolvedValue(0),
        findByIdAndTenantId: jest.fn().mockResolvedValue(user),
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
    const id = '019229dc-e8c6-72cc-b599-c938df401967';

    it('should call userRepository findByIdAndTenantId on success', async () => {
      await sut.execute({ ...input, id });

      expect(userRepository.findByIdAndTenantId).toHaveBeenCalledTimes(1);
      expect(userRepository.findByIdAndTenantId).toHaveBeenCalledWith(
        id,
        input.tenantId,
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      jest
        .spyOn(userRepository, 'findByIdAndTenantId')
        .mockResolvedValueOnce(null);

      await expect(sut.execute({ ...input, id })).rejects.toThrow(
        new NotFoundException('User not found!'),
      );
    });

    it('should update the role only', async () => {
      const updateInput = UserDataBuilder.aUser()
        .withRole(UserRole.ADMIN)
        .build();

      await sut.execute({ ...updateInput, id });

      expect(user.email).toBe(input.email);
      expect(user.tenantId).toBe(input.tenantId);
      expect(user.role).toBe(updateInput.role);
    });

    it('should update the email only', async () => {
      const updateInput = UserDataBuilder.aUser()
        .withEmail('ebd@test.com')
        .build();

      await sut.execute({ ...updateInput, id });

      expect(user.role).toBe(input.role);
      expect(user.tenantId).toBe(input.tenantId);
      expect(user.email).toBe(updateInput.email);
    });

    it('should update the role and email', async () => {
      const updateInput = UserDataBuilder.aUser()
        .withRole(UserRole.ADMIN)
        .withEmail('ebd@test.com')
        .withTenantId(input.tenantId)
        .build();

      await sut.execute({ ...updateInput, id });

      expect(user.tenantId).toBe(input.tenantId);
      expect(user.role).toBe(updateInput.role);
      expect(user.email).toBe(updateInput.email);
    });
  });
});
