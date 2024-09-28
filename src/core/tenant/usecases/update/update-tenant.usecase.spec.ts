import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { Tenant } from '@core/tenant/model';
import { UpdateTenantUseCase } from '@core/tenant/usecases';
import { TenantRepository } from '@core/tenant/ports/repository';
import { TenantDataBuilder } from '@test/__mocks__/data-builder/tenant';

describe('UpdateTenantUseCase', () => {
  let sut: UpdateTenantUseCase;
  let tenantRepository: TenantRepository;

  const input = TenantDataBuilder.anTenant().build();
  const tenant = Tenant.create(input);

  beforeEach(async () => {
    jest.clearAllMocks();

    const TenantRepositoryProvider = {
      provide: TenantRepository,
      useValue: {
        save: jest.fn().mockResolvedValue(0),
        findById: jest.fn().mockResolvedValue(tenant),
      },
    };

    const app: TestingModule = await Test.createTestingModule({
      providers: [UpdateTenantUseCase, TenantRepositoryProvider],
    }).compile();

    sut = app.get<UpdateTenantUseCase>(UpdateTenantUseCase);
    tenantRepository = app.get<TenantRepository>(TenantRepository);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
    expect(tenantRepository).toBeDefined();
  });

  describe('execute', () => {
    const tenantId = '019229dc-e8c6-72cc-b599-c938df401967';

    it('should throw NotFoundException if tenant not found', async () => {
      jest.spyOn(tenantRepository, 'findById').mockResolvedValueOnce(null);

      await expect(sut.execute({ ...input, id: tenantId })).rejects.toThrow(
        new NotFoundException('Tenant not found!'),
      );
    });

    it('should call tenantRepository save on success', async () => {
      await sut.execute({ ...input, id: tenantId });

      expect(tenantRepository.save).toHaveBeenCalledTimes(1);
      expect(tenantRepository.save).toHaveBeenCalledWith(expect.any(Tenant));
    });

    it('should update a tenant on success', async () => {
      const updateInput = TenantDataBuilder.anTenant()
        .withName('Horizon Technologies')
        .withDocument('16550433000120')
        .build();

      await sut.execute({ ...updateInput, id: tenantId });

      expect(tenant.name).toBe(updateInput.name);
      expect(tenant.document).toBe(updateInput.document);
    });
  });
});
