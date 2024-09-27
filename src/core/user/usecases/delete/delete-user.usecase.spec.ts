import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { DeleteUserUseCase } from '@core/user/usecases';
import { UserRepository } from '@core/user/ports/repository';
import { TenantRepository } from '@core/tenant/ports/repository';
import { UserDataBuilder } from '@test/__mocks__/data-builder/user';
import { TenantDataBuilder } from '@test/__mocks__/data-builder/tenant';

describe('DeleteUserUseCase', () => {
  let sut: DeleteUserUseCase;
  let userRepository: UserRepository;
  let tenantRepository: TenantRepository;

  const user = UserDataBuilder.aUser().withId().build();
  const tenant = TenantDataBuilder.anTenant().withId().build();

  beforeEach(async () => {
    jest.clearAllMocks();

    const UserRepositoryProvider = {
      provide: UserRepository,
      useValue: {
        findByIdAndTenantId: jest.fn().mockResolvedValue(user),
        delete: jest.fn(),
      },
    };

    const TenantRepositoryProvider = {
      provide: TenantRepository,
      useValue: {
        findById: jest.fn().mockResolvedValue(tenant),
      },
    };

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUserUseCase,
        UserRepositoryProvider,
        TenantRepositoryProvider,
      ],
    }).compile();

    sut = app.get<DeleteUserUseCase>(DeleteUserUseCase);
    userRepository = app.get<UserRepository>(UserRepository);
    tenantRepository = app.get<TenantRepository>(TenantRepository);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(tenantRepository).toBeDefined();
  });

  describe('execute', () => {
    const input = {
      id: '086229dc-e8c6-72cc-b599-c938df401741',
      tenantId: '019229dc-e8c6-72cc-b599-c938df401967',
    };

    it('should call tenantRepository findById once', async () => {
      await sut.execute(input);

      expect(tenantRepository.findById).toHaveBeenCalledTimes(1);
      expect(tenantRepository.findById).toHaveBeenCalledWith(input.tenantId);
    });

    it('should throw a NotFoundException if tenant is not found', async () => {
      jest.spyOn(tenantRepository, 'findById').mockResolvedValueOnce(null);

      await expect(sut.execute(input)).rejects.toThrow(
        new NotFoundException(`Tenant not found for ID: ${input.tenantId}`),
      );
    });

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

    it('should call userRepository delete once when user is found', async () => {
      await sut.execute(input);

      expect(userRepository.delete).toHaveBeenCalledTimes(1);
      expect(userRepository.delete).toHaveBeenCalledWith(user.id);
    });
  });
});
