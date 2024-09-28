import { Injectable, NotFoundException } from '@nestjs/common';

import { UseCase } from '@core/shared/contracts/usecases';
import { TenantRepository } from '@core/tenant/ports/repository';
import { Tenant } from '@core/tenant/model';

type Input = {
  id: string;
  name: string;
  document: string;
};

@Injectable()
export class UpdateTenantUseCase implements UseCase<Input, Tenant> {
  constructor(private readonly tenantRepository: TenantRepository) {}

  async execute(input: Input): Promise<Tenant> {
    const tenant = await this.tenantRepository.findById(input.id);

    if (!tenant) throw new NotFoundException('Tenant not found!');

    tenant.update(input);
    await this.tenantRepository.save(tenant);

    return tenant;
  }
}
