import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { FindAllUserUseCase } from '@core/user/usecases';
import { UserRepository } from '@core/user/ports/repository';
import { TenantRepository } from '@core/tenant/ports/repository';
import { UserDataBuilder } from '@test/__mocks__/data-builder/user';

describe('FindAllUserUseCase', () => {
  let sut: FindAllUserUseCase;
  let userRepository: UserRepository;
  let tenantRepository: TenantRepository;

  const user = UserDataBuilder.aUser().withId().build();
  const tenant = UserDataBuilder.aUser().withId().build();

  beforeEach(async () => {
    jest.clearAllMocks();

    const UserRepositoryProvider = {
      provide: UserRepository,
      useValue: {
        findAll: jest.fn().mockResolvedValue([user]),
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
        FindAllUserUseCase,
        UserRepositoryProvider,
        TenantRepositoryProvider,
      ],
    }).compile();

    sut = app.get<FindAllUserUseCase>(FindAllUserUseCase);
    userRepository = app.get<UserRepository>(UserRepository);
    tenantRepository = app.get<TenantRepository>(TenantRepository);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(tenantRepository).toBeDefined();
  });

  describe('execute', () => {
    const tenantId = '019229dc-e8c6-72cc-b599-c938df401967';

    it('should call tenantRepository findById once', async () => {
      await sut.execute(tenantId);

      expect(tenantRepository.findById).toHaveBeenCalledTimes(1);
      expect(tenantRepository.findById).toHaveBeenCalledWith(tenantId);
    });

    it('should throw a NotFoundException if tenant is not found', async () => {
      jest.spyOn(tenantRepository, 'findById').mockResolvedValueOnce(null);

      await expect(sut.execute(tenantId)).rejects.toThrow(
        new NotFoundException(`Tenant not found for ID: ${tenantId}`),
      );
    });

    it('should call userRepository findAll once', async () => {
      await sut.execute(tenantId);

      expect(userRepository.findAll).toHaveBeenCalledTimes(1);
      expect(userRepository.findAll).toHaveBeenCalledWith(tenant.id);
    });

    it('should throw a NotFoundException if returns empty array', async () => {
      jest.spyOn(userRepository, 'findAll').mockResolvedValueOnce([]);

      await expect(sut.execute(tenantId)).rejects.toThrow(
        new NotFoundException(`No users found for tenant ID: ${tenant.id}`),
      );
    });

    it('should throw a NotFoundException if returns undefined', async () => {
      jest.spyOn(userRepository, 'findAll').mockResolvedValueOnce(undefined);

      await expect(sut.execute(tenantId)).rejects.toThrow(
        new NotFoundException(`No users found for tenant ID: ${tenant.id}`),
      );
    });

    it('should return a list of users when users are found', async () => {
      const output = await sut.execute(tenantId);

      expect(output).toHaveLength(1);
      expect(output).toStrictEqual([user]);
    });
  });
});
