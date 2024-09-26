import { Injectable, NotFoundException } from '@nestjs/common';

import { User } from '@core/user/model';
import { UseCase } from '@core/shared/contracts/usecases';
import { UserRepository } from '@core/user/ports/repository';

@Injectable()
export class FindAllUserUseCase implements UseCase<null, User[]> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(tenantId: string): Promise<User[]> {
    const users = await this.userRepository.findAll(tenantId);

    if (!users || users.length === 0) {
      throw new NotFoundException(`No users found for tenant ID: ${tenantId}`);
    }

    return users;
  }
}
