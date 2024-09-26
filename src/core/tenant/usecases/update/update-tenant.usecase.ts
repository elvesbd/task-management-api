import { Injectable, NotFoundException } from '@nestjs/common';

import { UseCase } from '@core/shared/contracts/usecases';
import { TenantRepository } from '@core/tenant/ports/repository';

type Input = {
  id: string;
  name: string;
  document: string;
};

@Injectable()
export class UpdateTenantUseCase implements UseCase<Input, void> {
  constructor(private readonly tenantRepository: TenantRepository) {}

  async execute(input: Input): Promise<void> {
    const tenant = await this.tenantRepository.findByDocument(input.document);

    if (!tenant) throw new NotFoundException('Tenant not found!');

    tenant.update(input);
    await this.tenantRepository.save(tenant);
  }
}
