import { BadRequestException, Injectable } from '@nestjs/common';

import { User } from '@core/user/model';
import { UserRole } from '@core/user/enum';
import { UseCase } from '@core/shared/contracts/usecases';
import { UserRepository } from '@core/user/ports/repository';

type Input = {
  role: UserRole;
  email: string;
  password: string;
  tenantId: string;
};

type Output = {
  user: User;
};

@Injectable()
export class CreateUserUseCase implements UseCase<Input, Output> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: Input): Promise<Output> {
    const userExists = await this.userRepository.findByEmail(input.email);

    if (userExists)
      throw new BadRequestException('User already exists with this email!');

    const user = User.create(input);
    await this.userRepository.save(user);

    return { user };
  }
}
