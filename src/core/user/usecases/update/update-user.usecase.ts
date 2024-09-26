import { Injectable, NotFoundException } from '@nestjs/common';

import { UserRole } from '@core/user/enum';
import { UseCase } from '@core/shared/contracts/usecases';
import { UserRepository } from '@core/user/ports/repository';

type Input = {
  id: string;
  role: UserRole;
  email: string;
  tenantId: string;
};

@Injectable()
export class UpdateUserUseCase implements UseCase<Input, void> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: Input): Promise<void> {
    const user = await this.userRepository.findByIdAndTenantId(
      input.id,
      input.tenantId,
    );

    if (!user) throw new NotFoundException('User not found!');

    user.update(input);
    await this.userRepository.save(user);
  }
}
