import { Injectable, NotFoundException } from '@nestjs/common';

import { User } from '@core/user/model';
import { UserRole } from '@core/user/enum';
import { UseCase } from '@core/shared/contracts/usecases';
import { UserRepository } from '@core/user/ports/repository';
import { TenantRepository } from '@core/tenant/ports/repository';

type Input = {
  id: string;
  role: UserRole;
  email: string;
  tenantId: string;
};

@Injectable()
export class UpdateUserUseCase implements UseCase<Input, User> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(input: Input): Promise<User> {
    const tenant = await this.tenantRepository.findById(input.tenantId);
    if (!tenant)
      throw new NotFoundException(`Tenant not found for ID: ${input.tenantId}`);

    const user = await this.userRepository.findByIdAndTenantId(
      input.id,
      tenant.id,
    );

    if (!user) throw new NotFoundException('User not found!');

    user.update(input);
    await this.userRepository.save(user);

    return user;
  }
}
