import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { Tenant } from '@core/tenant/model';
import { CreateTenantUseCase } from '@core/tenant/usecases';
import { TenantRepository } from '@core/tenant/ports/repository';
import { TenantDataBuilder } from '@test/__mocks__/data-builder/tenant';

describe('CreateTenantUseCase', () => {
  let sut: CreateTenantUseCase;
  let tenantRepository: TenantRepository;

  const input = TenantDataBuilder.anTenant().build();
  const tenant = Tenant.create(input);

  beforeEach(async () => {
    jest.clearAllMocks();

    const TenantRepositoryProvider = {
      provide: TenantRepository,
      useValue: {
        save: jest.fn(),
        findByDocument: jest.fn().mockResolvedValue(null),
      },
    };

    const app: TestingModule = await Test.createTestingModule({
      providers: [CreateTenantUseCase, TenantRepositoryProvider],
    }).compile();

    sut = app.get<CreateTenantUseCase>(CreateTenantUseCase);
    tenantRepository = app.get<TenantRepository>(TenantRepository);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
    expect(tenantRepository).toBeDefined();
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
