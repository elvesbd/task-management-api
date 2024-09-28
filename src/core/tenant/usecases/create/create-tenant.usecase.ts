import { BadRequestException, Injectable } from '@nestjs/common';

import { Tenant } from '@core/tenant/model';
import { UseCase } from '@core/shared/contracts/usecases';
import { TenantRepository } from '@core/tenant/ports/repository';
import { UserRepository } from '@core/user/ports/repository';
import { PasswordEncryption } from '@core/authentication/ports/encryption';
import { User } from '@core/user/model';
import { UserRole } from '@core/user/enum';

type Input = {
  name: string;
  document: string;
  adminEmail: string;
  adminPassword: string;
};
@Injectable()
export class CreateTenantUseCase implements UseCase<Input, Tenant> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tenantRepository: TenantRepository,
    private readonly passwordEncryption: PasswordEncryption,
  ) {}

  async execute(input: Input): Promise<Tenant> {
    const tenantExists = await this.tenantRepository.findByDocument(
      input.document,
    );

    if (tenantExists)
      throw new BadRequestException('Tenant already exists with this document');

    const tenant = Tenant.create({
      name: input.name,
      document: input.document,
    });
    await this.tenantRepository.save(tenant);

    const hashedPassword = await this.passwordEncryption.hash(
      input.adminPassword,
    );

    const adminUser = User.create({
      email: input.adminEmail,
      password: hashedPassword,
      tenantId: tenant.id,
      role: UserRole.ADMIN,
    });
    await this.userRepository.save(adminUser);

    return tenant;
  }
}
