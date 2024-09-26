import { Injectable, NotFoundException } from '@nestjs/common';

import { User } from '@core/user/model';
import { UseCase } from '@core/shared/contracts/usecases';
import { UserRepository } from '@core/user/ports/repository';
import { TenantRepository } from '@core/tenant/ports/repository';

@Injectable()
export class FindAllUserUseCase implements UseCase<null, User[]> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(tenantId: string): Promise<User[]> {
    const tenant = await this.tenantRepository.findById(tenantId);
    if (!tenant)
      throw new NotFoundException(`Tenant not found for ID: ${tenantId}`);

    const users = await this.userRepository.findAll(tenant.id);

    if (!users || users.length === 0) {
      throw new NotFoundException(`No users found for tenant ID: ${tenant.id}`);
    }

    return users;
  }
}
