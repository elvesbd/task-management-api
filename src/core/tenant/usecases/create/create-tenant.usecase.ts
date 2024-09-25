import { UseCase } from '@core/shared/contracts/usecases';
import { Tenant } from '@core/tenant/model';
import { TenantRepository } from '@core/tenant/ports/repository';
import { BadRequestException, Injectable } from '@nestjs/common';

type Input = {
  name: string;
  document: string;
};

type Output = {
  tenantId: string;
};

@Injectable()
export class CreateTenantUseCase implements UseCase<Input, Output> {
  constructor(private readonly tenantRepository: TenantRepository) {}

  async execute(input: Input): Promise<Output> {
    const tenantExists = await this.tenantRepository.findByDocument(
      input.document,
    );

    if (tenantExists)
      throw new BadRequestException('Tenant already exists with this document');

    const tenant = Tenant.create(input);
    await this.tenantRepository.save(tenant);

    return { tenantId: tenant.id };
  }
}
