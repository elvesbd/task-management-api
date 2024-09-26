import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { User } from '@core/user/model';
import { UserRepository } from '@core/user/ports/repository';
import { UpdateUserPasswordUseCase } from '@core/user/usecases';
import { UserDataBuilder } from '@test/__mocks__/data-builder/user';
import { PasswordEncryption } from '@core/authentication/ports/encryption';

describe('UpdateUserPasswordUseCase', () => {
  let sut: UpdateUserPasswordUseCase;
  let userRepository: UserRepository;
  let passwordEncryption: PasswordEncryption;

  const input = {
    email: 'user@mail.com',
    currentPassword: 'securePassword',
    newPassword: 'newPassword123',
  };

  const userMock = UserDataBuilder.aUser()
    .withPassword('hashedOldPassword')
    .build();
  const user = User.create(userMock);

  beforeEach(async () => {
    jest.clearAllMocks();

    const UserRepositoryProvider = {
      provide: UserRepository,
      useValue: {
        save: jest.fn(),
        findByEmail: jest.fn().mockResolvedValue(user),
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
        PasswordEncryptionProvider,
      ],
    }).compile();

    sut = app.get<UpdateUserPasswordUseCase>(UpdateUserPasswordUseCase);
    userRepository = app.get<UserRepository>(UserRepository);
    passwordEncryption = app.get<PasswordEncryption>(PasswordEncryption);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(passwordEncryption).toBeDefined();
  });

  describe('execute', () => {
    it('should throw NotFoundException if user does not exist', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(null);

      await expect(sut.execute(input)).rejects.toThrow(
        new NotFoundException('User not found!'),
      );
    });

    it('should throw BadRequestException if current password is incorrect', async () => {
      jest.spyOn(passwordEncryption, 'compare').mockResolvedValueOnce(false);

      await expect(sut.execute(input)).rejects.toThrow(
        new BadRequestException('Current password is incorrect'),
      );
    });

    it('should call passwordEncryption hash with correct values', async () => {
      await sut.execute(input);

      expect(passwordEncryption.hash).toHaveBeenCalledTimes(1);
      expect(passwordEncryption.hash).toHaveBeenCalledWith(input.newPassword);
    });

    it('should hash the new password and update the user', async () => {
      await sut.execute(input);

      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(user);
    });
  });
});
