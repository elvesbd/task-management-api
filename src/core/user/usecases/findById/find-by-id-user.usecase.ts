import { Injectable, NotFoundException } from '@nestjs/common';

import { User } from '@core/user/model';
import { UseCase } from '@core/shared/contracts/usecases';
import { UserRepository } from '@core/user/ports/repository';

type Input = {
  id: string;
  tenantId: string;
};

@Injectable()
export class FindByIdUserUseCase implements UseCase<Input, User> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: Input): Promise<User> {
    const user = await this.userRepository.findByIdAndTenantId(
      input.id,
      input.tenantId,
    );

    if (!user)
      throw new NotFoundException(`User not found for ID: ${input.tenantId}`);

    return user;
  }
}
