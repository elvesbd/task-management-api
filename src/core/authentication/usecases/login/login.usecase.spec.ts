import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { UserRepository } from '@core/user/ports/repository';
import { PasswordEncryption } from '@core/authentication/ports/encryption';
import { SignToken } from '@core/authentication/ports/token';
import { UserDataBuilder } from '@test/__mocks__/data-builder/user';
import { LoginUseCase } from './login.usecase';

describe('LoginUseCase', () => {
  let sut: LoginUseCase;
  let tokenSigner: SignToken;
  let userRepository: UserRepository;
  let passwordEncryption: PasswordEncryption;

  const user = UserDataBuilder.aUser().withId().build();

  beforeEach(async () => {
    jest.clearAllMocks();

    const UserRepositoryProvider = {
      provide: UserRepository,
      useValue: {
        findByEmail: jest.fn().mockResolvedValue(user),
      },
    };

    const PasswordEncryptionProvider = {
      provide: PasswordEncryption,
      useValue: {
        compare: jest.fn().mockResolvedValue(true),
      },
    };

    const TokenSignerProvider = {
      provide: SignToken,
      useValue: {
        signAsync: jest.fn().mockResolvedValue('accessToken'),
      },
    };

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        TokenSignerProvider,
        UserRepositoryProvider,
        PasswordEncryptionProvider,
      ],
    }).compile();

    sut = app.get<LoginUseCase>(LoginUseCase);
    tokenSigner = app.get<SignToken>(SignToken);
    userRepository = app.get<UserRepository>(UserRepository);
    passwordEncryption = app.get<PasswordEncryption>(PasswordEncryption);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
    expect(tokenSigner).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(passwordEncryption).toBeDefined();
  });

  describe('execute', () => {
    it('should throw UnauthorizedException if user is not found', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(null);

      await expect(
        sut.execute({ email: 'notfound@example.com', password: 'password' }),
      ).rejects.toThrow(new UnauthorizedException('Invalid credentials'));
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      jest.spyOn(passwordEncryption, 'compare').mockResolvedValueOnce(false);

      await expect(
        sut.execute({ email: user.email, password: 'wrongPassword' }),
      ).rejects.toThrow(new UnauthorizedException('Invalid credentials'));
    });

    it('should call tokenSigner signSync', async () => {
      await sut.execute({
        email: user.email,
        password: user.password,
      });

      expect(tokenSigner.signAsync).toHaveBeenCalledTimes(1);
      expect(tokenSigner.signAsync).toHaveBeenCalledWith({
        sub: user.id,
        role: user.role,
        tenantId: user.tenantId,
      });
    });
  });
});
