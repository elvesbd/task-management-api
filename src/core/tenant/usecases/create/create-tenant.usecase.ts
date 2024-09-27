import { BadRequestException, Injectable } from '@nestjs/common';

import { Tenant } from '@core/tenant/model';
import { UseCase } from '@core/shared/contracts/usecases';
import { TenantRepository } from '@core/tenant/ports/repository';

type Input = {
  name: string;
  document: string;
};
@Injectable()
export class CreateTenantUseCase implements UseCase<Input, Tenant> {
  constructor(private readonly tenantRepository: TenantRepository) {}

  async execute(input: Input): Promise<Tenant> {
    const tenantExists = await this.tenantRepository.findByDocument(
      input.document,
    );

    if (tenantExists)
      throw new BadRequestException('Tenant already exists with this document');

    const tenant = Tenant.create(input);
    await this.tenantRepository.save(tenant);

    return tenant;
  }
}
