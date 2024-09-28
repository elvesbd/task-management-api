import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { Tenant } from '@core/tenant/model';
import { CreateTenantUseCase } from '@core/tenant/usecases';
import { TenantRepository } from '@core/tenant/ports/repository';
import { TenantDataBuilder } from '@test/__mocks__/data-builder/tenant';
import { PasswordEncryption } from '@core/authentication/ports/encryption';
import { UserRepository } from '@core/user/ports/repository';

describe('CreateTenantUseCase', () => {
  let sut: CreateTenantUseCase;
  let userRepository: UserRepository;
  let tenantRepository: TenantRepository;
  let passwordEncryption: PasswordEncryption;

  const input = TenantDataBuilder.anTenant().build();
  const tenant = Tenant.create(input);
  const hashedPassword = 'hashedPassword';

  beforeEach(async () => {
    jest.clearAllMocks();

    const UserRepositoryProvider = {
      provide: UserRepository,
      useValue: {
        save: jest.fn(),
      },
    };

    const TenantRepositoryProvider = {
      provide: TenantRepository,
      useValue: {
        save: jest.fn(),
        findByDocument: jest.fn().mockResolvedValue(null),
      },
    };

    const PasswordEncryptionProvider = {
      provide: PasswordEncryption,
      useValue: {
        hash: jest.fn().mockResolvedValue(hashedPassword),
      },
    };

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTenantUseCase,
        UserRepositoryProvider,
        TenantRepositoryProvider,
        PasswordEncryptionProvider,
      ],
    }).compile();

    sut = app.get<CreateTenantUseCase>(CreateTenantUseCase);
    tenantRepository = app.get<TenantRepository>(TenantRepository);
    passwordEncryption = app.get<PasswordEncryption>(PasswordEncryption);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
    expect(tenantRepository).toBeDefined();
    expect(passwordEncryption).toBeDefined();
  });

  describe('execute', () => {
    it('should throw BadRequestException if tenant already exists', async () => {
      jest
        .spyOn(tenantRepository, 'findByDocument')
        .mockResolvedValueOnce(tenant);

      await expect(sut.execute(input)).rejects.toThrow(
        new BadRequestException('Tenant already exists with this document'),
      );
    });

    it('should hash the password before saving the user', async () => {
      await sut.execute(input);

      expect(passwordEncryption.hash).toHaveBeenCalledTimes(1);
      expect(passwordEncryption.hash).toHaveBeenCalledWith(input.adminPassword);
    });

    it('should call tenantRepository save on success', async () => {
      await sut.execute(input);

      expect(tenantRepository.save).toHaveBeenCalledTimes(1);
      expect(tenantRepository.save).toHaveBeenCalledWith(expect.any(Tenant));
    });

    it('should return a tenant on success', async () => {
      const output = await sut.execute(input);

      expect(output.id).toBeDefined();
      expect(output.name).toBe(input.name);
      expect(output.document).toBe(input.document);
    });
  });
});
