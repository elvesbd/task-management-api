import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { UseCase } from '@core/shared/contracts/usecases';
import { UserRepository } from '@core/user/ports/repository';
import { PasswordEncryption } from '@core/authentication/ports/encryption';
import { TenantRepository } from '@core/tenant/ports/repository';

type Input = {
  id: string;
  tenantId: string;
  newPassword: string;
  currentPassword: string;
};

@Injectable()
export class UpdateUserPasswordUseCase implements UseCase<Input, void> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tenantRepository: TenantRepository,
    private readonly passwordEncryption: PasswordEncryption,
  ) {}

  async execute(input: Input): Promise<void> {
    const { currentPassword, newPassword } = input;

    const tenant = await this.tenantRepository.findById(input.tenantId);
    if (!tenant)
      throw new NotFoundException(`Tenant not found for ID: ${input.tenantId}`);

    const user = await this.userRepository.findByIdAndTenantId(
      input.id,
      tenant.id,
    );
    if (!user) throw new NotFoundException('User not found!');

    const isPasswordValid = await this.passwordEncryption.compare(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid)
      throw new BadRequestException('Current password is incorrect');

    const hashedPassword = await this.passwordEncryption.hash(newPassword);
    user.updatePassword(hashedPassword);

    await this.userRepository.save(user);
  }
}
