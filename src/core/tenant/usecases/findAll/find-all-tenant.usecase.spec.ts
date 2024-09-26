import { Test, TestingModule } from '@nestjs/testing';

import { FindAllTenantUseCase } from '@core/tenant/usecases';
import { TenantRepository } from '@core/tenant/ports/repository';
import { TenantDataBuilder } from '@test/__mocks__/data-builder/tenant';

describe('FindAllTenantUseCase', () => {
  let sut: FindAllTenantUseCase;
  let tenantRepository: TenantRepository;

  const tenant = TenantDataBuilder.anTenant().withId().build();

  beforeEach(async () => {
    jest.clearAllMocks();

    const TenantRepositoryProvider = {
      provide: TenantRepository,
      useValue: {
        findAll: jest.fn().mockResolvedValue([tenant]),
      },
    };

    const app: TestingModule = await Test.createTestingModule({
      providers: [FindAllTenantUseCase, TenantRepositoryProvider],
    }).compile();

    sut = app.get<FindAllTenantUseCase>(FindAllTenantUseCase);
    tenantRepository = app.get<TenantRepository>(TenantRepository);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
    expect(tenantRepository).toBeDefined();
  });

  describe('execute', () => {
    it('should call tenantRepository findAll once', async () => {
      await sut.execute();

      expect(tenantRepository.findAll).toHaveBeenCalledTimes(1);
      expect(tenantRepository.findAll).toHaveBeenCalledWith();
    });

    it('should return an empty array if no tenants are found', async () => {
      jest.spyOn(tenantRepository, 'findAll').mockResolvedValueOnce([]);

      const output = await sut.execute();

      expect(output).toHaveLength(0);
    });
  });
});
