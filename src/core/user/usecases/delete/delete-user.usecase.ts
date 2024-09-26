import { Injectable, NotFoundException } from '@nestjs/common';

import { UseCase } from '@core/shared/contracts/usecases';
import { UserRepository } from '@core/user/ports/repository';

type Input = {
  id: string;
  tenantId: string;
};

@Injectable()
export class DeleteUserUseCase implements UseCase<Input, void> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: Input): Promise<void> {
    const user = await this.userRepository.findByIdAndTenantId(
      input.id,
      input.tenantId,
    );

    if (!user) {
      throw new NotFoundException(
        `User not found for tenant ID: ${input.tenantId}`,
      );
    }

    await this.userRepository.delete(input.id);
  }
}
