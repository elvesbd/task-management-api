import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { DeleteTenantUseCase } from '@core/tenant/usecases';
import { TenantRepository } from '@core/tenant/ports/repository';
import { TenantDataBuilder } from '@test/__mocks__/data-builder/tenant';

describe('DeleteTenantUseCase', () => {
  let sut: DeleteTenantUseCase;
  let tenantRepository: TenantRepository;

  const tenant = TenantDataBuilder.anTenant().withId().build();

  beforeEach(async () => {
    jest.clearAllMocks();

    const TenantRepositoryProvider = {
      provide: TenantRepository,
      useValue: {
        findById: jest.fn().mockResolvedValue(tenant),
        delete: jest.fn().mockResolvedValue(0),
      },
    };

    const app: TestingModule = await Test.createTestingModule({
      providers: [DeleteTenantUseCase, TenantRepositoryProvider],
    }).compile();

    sut = app.get<DeleteTenantUseCase>(DeleteTenantUseCase);
    tenantRepository = app.get<TenantRepository>(TenantRepository);
  });

  it('should defined', () => {
    expect(sut).toBeDefined();
    expect(tenantRepository).toBeDefined();
  });

  describe('execute', () => {
    const tenantId = '019229dc-e8c6-72cc-b599-c938df401967';

    it('should call tenantRepository findById with the correct tenantId', async () => {
      await sut.execute(tenantId);

      expect(tenantRepository.findById).toHaveBeenCalledTimes(1);
      expect(tenantRepository.findById).toHaveBeenCalledWith(tenantId);
    });

    it('should throw NotFoundException if no tenant is found', async () => {
      jest.spyOn(tenantRepository, 'findById').mockResolvedValueOnce(null);

      await expect(sut.execute(tenantId)).rejects.toThrow(
        new NotFoundException('Tenant not found!'),
      );
    });
  });
});
