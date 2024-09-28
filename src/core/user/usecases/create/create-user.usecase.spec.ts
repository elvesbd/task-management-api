import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { User } from '@core/user/model';
import { CreateUserUseCase } from '@core/user/usecases';
import { UserRepository } from '@core/user/ports/repository';
import { UserDataBuilder } from '@test/__mocks__/data-builder/user';
import { PasswordEncryption } from '@core/authentication/ports/encryption';
import { TenantRepository } from '@core/tenant/ports/repository';
import { TenantDataBuilder } from '@test/__mocks__/data-builder/tenant';

describe('CreateUserUseCase', () => {
  let sut: CreateUserUseCase;
  let userRepository: UserRepository;
  let tenantRepository: TenantRepository;
  let passwordEncryption: PasswordEncryption;

  const input = UserDataBuilder.aUser().build();
  const user = User.create(input);
  const tenant = TenantDataBuilder.anTenant().withId().build();
  const hashedPassword = 'hashedPassword';

  beforeEach(async () => {
    jest.clearAllMocks();

    const UserRepositoryProvider = {
      provide: UserRepository,
      useValue: {
        save: jest.fn(),
        findByEmail: jest.fn().mockResolvedValue(null),
      },
    };

    const PasswordEncryptionProvider = {
      provide: PasswordEncryption,
      useValue: {
        hash: jest.fn().mockResolvedValue(hashedPassword),
      },
    };

    const TenantRepositoryProvider = {
      provide: TenantRepository,
      useValue: {
        findById: jest.fn().mockResolvedValue(tenant),
      },
    };

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        UserRepositoryProvider,
        TenantRepositoryProvider,
        PasswordEncryptionProvider,
      ],
    }).compile();

    sut = app.get<CreateUserUseCase>(CreateUserUseCase);
    userRepository = app.get<UserRepository>(UserRepository);
    tenantRepository = app.get<TenantRepository>(TenantRepository);
    passwordEncryption = app.get<PasswordEncryption>(PasswordEncryption);
  });

  it('should defined', () => {
    expect(sut).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(tenantRepository).toBeDefined();
    expect(passwordEncryption).toBeDefined();
  });

  describe('execute', () => {
    it('should call tenantRepository findById once', async () => {
      await sut.execute(input);

      expect(tenantRepository.findById).toHaveBeenCalledTimes(1);
      expect(tenantRepository.findById).toHaveBeenCalledWith(input.tenantId);
    });

    it('should throw a NotFoundException if tenant is not found', async () => {
      jest.spyOn(tenantRepository, 'findById').mockResolvedValueOnce(null);

      await expect(sut.execute(input)).rejects.toThrow(
        new NotFoundException(`Tenant not found for ID: ${input.tenantId}`),
      );
    });

    it('call userRepository findByEmail with correct values', async () => {
      await sut.execute(input);

      expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
    });

    it('should throw a ConflictException if user already register', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(user);

      await expect(sut.execute(input)).rejects.toThrow(
        new NotFoundException('User already register'),
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
