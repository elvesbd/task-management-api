import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { User } from '@core/user/model';
import { UserRepository } from '@core/user/ports/repository';
import { UpdateUserPasswordUseCase } from '@core/user/usecases';
import { TenantRepository } from '@core/tenant/ports/repository';
import { UserDataBuilder } from '@test/__mocks__/data-builder/user';
import { TenantDataBuilder } from '@test/__mocks__/data-builder/tenant';
import { PasswordEncryption } from '@core/authentication/ports/encryption';

describe('UpdateUserPasswordUseCase', () => {
  let sut: UpdateUserPasswordUseCase;
  let userRepository: UserRepository;
  let tenantRepository: TenantRepository;
  let passwordEncryption: PasswordEncryption;

  const input = {
    email: 'user@mail.com',
    newPassword: 'newPassword123',
    currentPassword: 'securePassword',
    tenantId: '019229dc-e8c6-72cc-b599-c938df401967',
  };

  const userMock = UserDataBuilder.aUser()
    .withPassword('hashedOldPassword')
    .build();
  const user = User.create(userMock);
  const tenant = TenantDataBuilder.anTenant().withId().build();

  beforeEach(async () => {
    jest.clearAllMocks();

    const UserRepositoryProvider = {
      provide: UserRepository,
      useValue: {
        save: jest.fn(),
        findByIdAndTenantId: jest.fn().mockResolvedValue(user),
      },
    };

    const TenantRepositoryProvider = {
      provide: TenantRepository,
      useValue: {
        findById: jest.fn().mockResolvedValue(tenant),
      },
    };

    const PasswordEncryptionProvider = {
      provide: PasswordEncryption,
      useValue: {
        compare: jest.fn().mockResolvedValue(true),
        hash: jest.fn().mockResolvedValue('hashedNewPassword'),
      },
    };

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserPasswordUseCase,
        UserRepositoryProvider,
        TenantRepositoryProvider,
        PasswordEncryptionProvider,
      ],
    }).compile();

    sut = app.get<UpdateUserPasswordUseCase>(UpdateUserPasswordUseCase);
    userRepository = app.get<UserRepository>(UserRepository);
    tenantRepository = app.get<TenantRepository>(TenantRepository);
    passwordEncryption = app.get<PasswordEncryption>(PasswordEncryption);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(tenantRepository).toBeDefined();
    expect(passwordEncryption).toBeDefined();
  });

  describe('execute', () => {
    const id = '019229dc-e8c6-72cc-b599-c938df401967';

    it('should call tenantRepository findById once', async () => {
      await sut.execute({ ...input, id });

      expect(tenantRepository.findById).toHaveBeenCalledTimes(1);
      expect(tenantRepository.findById).toHaveBeenCalledWith(input.tenantId);
    });

    it('should throw a NotFoundException if tenant is not found', async () => {
      jest.spyOn(tenantRepository, 'findById').mockResolvedValueOnce(null);

      await expect(sut.execute({ ...input, id })).rejects.toThrow(
        new NotFoundException(`Tenant not found for ID: ${input.tenantId}`),
      );
    });

    it('should throw NotFoundException if user does not exist', async () => {
      jest
        .spyOn(userRepository, 'findByIdAndTenantId')
        .mockResolvedValueOnce(null);

      await expect(sut.execute({ ...input, id })).rejects.toThrow(
        new NotFoundException('User not found!'),
      );
    });

    it('should throw BadRequestException if current password is incorrect', async () => {
      jest.spyOn(passwordEncryption, 'compare').mockResolvedValueOnce(false);

      await expect(sut.execute({ ...input, id })).rejects.toThrow(
        new BadRequestException('Current password is incorrect'),
      );
    });

    it('should call passwordEncryption hash with correct values', async () => {
      await sut.execute({ ...input, id });

      expect(passwordEncryption.hash).toHaveBeenCalledTimes(1);
      expect(passwordEncryption.hash).toHaveBeenCalledWith(input.newPassword);
    });

    it('should hash the new password and update the user', async () => {
      await sut.execute({ ...input, id });

      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(user);
    });
  });
});
