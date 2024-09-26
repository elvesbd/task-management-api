import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { UseCase } from '@core/shared/contracts/usecases';
import { UserRepository } from '@core/user/ports/repository';
import { PasswordEncryption } from '@core/authentication/ports/encryption';

type Input = {
  email: string;
  newPassword: string;
  currentPassword: string;
};

@Injectable()
export class UpdateUserPasswordUseCase implements UseCase<Input, void> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordEncryption: PasswordEncryption,
  ) {}

  async execute(input: Input): Promise<void> {
    const { email, currentPassword, newPassword } = input;

    const user = await this.userRepository.findByEmail(email);
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
