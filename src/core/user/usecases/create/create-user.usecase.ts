import { BadRequestException, Injectable } from '@nestjs/common';

import { User } from '@core/user/model';
import { UserRole } from '@core/user/enum';
import { UseCase } from '@core/shared/contracts/usecases';
import { UserRepository } from '@core/user/ports/repository';
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
    private readonly passwordEncryption: PasswordEncryption,
  ) {}

  async execute(input: Input): Promise<User> {
    const userExists = await this.userRepository.findByEmail(input.email);

    if (userExists)
      throw new BadRequestException('User already exists with this email!');

    const hashedPassword = await this.passwordEncryption.hash(input.password);

    const user = User.create({
      ...input,
      password: hashedPassword,
    });
    await this.userRepository.save(user);

    return user;
  }
}
