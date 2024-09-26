import { Injectable } from '@nestjs/common';

import { UseCase } from '@core/shared/contracts/usecases';
import { TenantRepository } from '@core/tenant/ports/repository';
import { Tenant } from '@core/tenant/model';

@Injectable()
export class FindAllTenantUseCase implements UseCase<null, Tenant[]> {
  constructor(private readonly tenantRepository: TenantRepository) {}

  async execute(): Promise<Tenant[]> {
    return await this.tenantRepository.findAll();
  }
}
