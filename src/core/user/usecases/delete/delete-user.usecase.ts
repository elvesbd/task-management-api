import { Injectable, NotFoundException } from '@nestjs/common';

import { UseCase } from '@core/shared/contracts/usecases';
import { UserRepository } from '@core/user/ports/repository';
import { TenantRepository } from '@core/tenant/ports/repository';

type Input = {
  id: string;
  tenantId: string;
};

@Injectable()
export class DeleteUserUseCase implements UseCase<Input, void> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(input: Input): Promise<void> {
    const tenant = await this.tenantRepository.findById(input.tenantId);
    if (!tenant)
      throw new NotFoundException(`Tenant not found for ID: ${input.tenantId}`);

    const user = await this.userRepository.findByIdAndTenantId(
      input.id,
      tenant.id,
    );

    if (!user) {
      throw new NotFoundException(`User not found for tenant ID: ${tenant.id}`);
    }

    await this.userRepository.delete(user.id);
  }
}
