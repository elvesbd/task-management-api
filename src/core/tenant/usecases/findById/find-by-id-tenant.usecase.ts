import { Injectable, NotFoundException } from '@nestjs/common';

import { Tenant } from '@core/tenant/model';
import { UseCase } from '@core/shared/contracts/usecases';
import { TenantRepository } from '@core/tenant/ports/repository';

@Injectable()
export class FindByIdTenantUseCase implements UseCase<string, Tenant> {
  constructor(private readonly tenantRepository: TenantRepository) {}

  async execute(id: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findById(id);

    if (!tenant) throw new NotFoundException('Tenant not found!');

    return tenant;
  }
}
