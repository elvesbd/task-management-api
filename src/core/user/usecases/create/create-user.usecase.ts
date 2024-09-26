import { Injectable, NotFoundException } from '@nestjs/common';

import { User } from '@core/user/model';
import { UserRole } from '@core/user/enum';
import { UseCase } from '@core/shared/contracts/usecases';
import { UserRepository } from '@core/user/ports/repository';
import { TenantRepository } from '@core/tenant/ports/repository';
import { PasswordEncryption } from '@core/authentication/ports/encryption';

type Input = {
  role: UserRole;
  email: string;
  password: string;
  tenantId: string;
};
@Injectable()
export class CreateUserUseCase implements UseCase<Input, User> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tenantRepository: TenantRepository,
    private readonly passwordEncryption: PasswordEncryption,
  ) {}

  async execute(input: Input): Promise<User> {
    const tenant = await this.tenantRepository.findById(input.tenantId);
    if (!tenant)
      throw new NotFoundException(`Tenant not found for ID: ${input.tenantId}`);

    const hashedPassword = await this.passwordEncryption.hash(input.password);

    const user = User.create({
      ...input,
      password: hashedPassword,
    });
    await this.userRepository.save(user);

    return user;
  }
}
