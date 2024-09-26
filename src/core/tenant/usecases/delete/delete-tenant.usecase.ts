import { Injectable, NotFoundException } from '@nestjs/common';

import { UseCase } from '@core/shared/contracts/usecases';
import { TenantRepository } from '@core/tenant/ports/repository';

@Injectable()
export class DeleteTenantUseCase implements UseCase<string, void> {
  constructor(private readonly tenantRepository: TenantRepository) {}

  async execute(id: string): Promise<void> {
    const tenant = await this.tenantRepository.findById(id);

    if (!tenant) throw new NotFoundException('Tenant not found!');

    await this.tenantRepository.delete(id);
  }
}
