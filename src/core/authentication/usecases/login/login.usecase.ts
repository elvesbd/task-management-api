import { Injectable, UnauthorizedException } from '@nestjs/common';

import { SignToken } from '@core/authentication/ports/token';
import { UserRepository } from '@core/user/ports/repository';
import { PasswordEncryption } from '@core/authentication/ports/encryption';
import { UseCase } from '@core/shared/contracts/usecases';

type Payload = {
  sub: string;
  role: string;
  tenantId: string;
};

type Input = {
  email: string;
  password: string;
};

type Output = {
  accessToken: string;
};

@Injectable()
export class LoginUseCase implements UseCase<Input, Output> {
  constructor(
    private readonly tokenSigner: SignToken,
    private readonly userRepository: UserRepository,
    private readonly passwordEncryption: PasswordEncryption,
  ) {}

  async execute(input: Input): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findByEmail(input.email);
    if (
      !user ||
      !(await this.passwordEncryption.compare(input.password, user.password))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: Payload = {
      sub: user.id,
      role: user.role,
      tenantId: user.tenantId,
    };
    const accessToken = await this.tokenSigner.signAsync(payload);

    return { accessToken };
  }
}
