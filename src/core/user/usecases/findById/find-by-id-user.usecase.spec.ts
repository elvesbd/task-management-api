import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { FindByIdUserUseCase } from '@core/user/usecases';
import { UserRepository } from '@core/user/ports/repository';
import { TenantRepository } from '@core/tenant/ports/repository';
import { UserDataBuilder } from '@test/__mocks__/data-builder/user';
import { TenantDataBuilder } from '@test/__mocks__/data-builder/tenant';

describe('FindByIdUserUseCase', () => {
  let sut: FindByIdUserUseCase;
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
        FindByIdUserUseCase,
        UserRepositoryProvider,
        TenantRepositoryProvider,
      ],
    }).compile();

    sut = app.get<FindByIdUserUseCase>(FindByIdUserUseCase);
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

    it('should call userRepository findById once', async () => {
      await sut.execute(input);

      expect(userRepository.findByIdAndTenantId).toHaveBeenCalledTimes(1);
      expect(userRepository.findByIdAndTenantId).toHaveBeenCalledWith(
        input.id,
        tenant.id,
      );
    });

    it('should throw a NotFoundException if no user is found', async () => {
      jest
        .spyOn(userRepository, 'findByIdAndTenantId')
        .mockResolvedValueOnce(null);

      await expect(sut.execute(input)).rejects.toThrow(
        new NotFoundException(`User not found for ID: ${tenant.id}`),
      );
    });

    it('should return a user when found', async () => {
      const output = await sut.execute(input);

      expect(output).toStrictEqual(user);
    });
  });
});
