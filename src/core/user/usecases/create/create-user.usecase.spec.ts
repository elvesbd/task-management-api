import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { User } from '@core/user/model';
import { CreateUserUseCase } from '@core/user/usecases';
import { UserRepository } from '@core/user/ports/repository';
import { UserDataBuilder } from '@test/__mocks__/data-builder/user';
import { PasswordEncryption } from '@core/authentication/ports/encryption';

describe('CreateUserUseCase', () => {
  let sut: CreateUserUseCase;
  let userRepository: UserRepository;
  let passwordEncryption: PasswordEncryption;

  const input = UserDataBuilder.aUser().build();
  const user = User.create(input);
  const hashedPassword = 'hashedPassword';

  beforeEach(async () => {
    jest.clearAllMocks();

    const UserRepositoryProvider = {
      provide: UserRepository,
      useValue: {
        findByEmail: jest.fn().mockResolvedValue(null),
        save: jest.fn().mockResolvedValue(0),
      },
    };

    const PasswordEncryptionProvider = {
      provide: PasswordEncryption,
      useValue: {
        hash: jest.fn().mockResolvedValue(hashedPassword),
      },
    };

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        UserRepositoryProvider,
        PasswordEncryptionProvider,
      ],
    }).compile();

    sut = app.get<CreateUserUseCase>(CreateUserUseCase);
    userRepository = app.get<UserRepository>(UserRepository);
    passwordEncryption = app.get<PasswordEncryption>(PasswordEncryption);
  });

  it('should defined', () => {
    expect(sut).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(passwordEncryption).toBeDefined();
  });

  describe('execute', () => {
    it('should throw BadRequestException if user already exists', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(user);

      await expect(sut.execute(input)).rejects.toThrow(
        new BadRequestException('User already exists with this email!'),
      );
    });

    it('should hash the password before saving the user', async () => {
      await sut.execute(input);

      expect(passwordEncryption.hash).toHaveBeenCalledTimes(1);
      expect(passwordEncryption.hash).toHaveBeenCalledWith(input.password);
    });

    it('should call tenantRepository save on success', async () => {
      await sut.execute(input);

      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(expect.any(User));
    });

    it('should create a new user when no existing user is found', async () => {
      const output = await sut.execute(input);

      expect(output.id).toBeDefined();
      expect(output.role).toBe(input.role);
      expect(output.email).toBe(input.email);
      expect(output.tenantId).toBe(input.tenantId);
      expect(output.password).toBe(hashedPassword);
    });
  });
});
