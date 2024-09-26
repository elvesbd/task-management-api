import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { Task } from '@core/task/model';
import { FindAllTaskUseCase } from '@core/task/usecases';
import { TaskRepository } from '@core/task/ports/repository';
import { TenantRepository } from '@core/tenant/ports/repository';
import { TaskDataBuilder } from '@test/__mocks__/data-builder/task';
import { UserDataBuilder } from '@test/__mocks__/data-builder/user';

describe('FindAllTaskUseCase', () => {
  let sut: FindAllTaskUseCase;
  let taskRepository: TaskRepository;
  let tenantRepository: TenantRepository;

  const input = TaskDataBuilder.aTask().build();
  const task = Task.create(input);
  const tenant = UserDataBuilder.aUser().withId().build();

  beforeEach(async () => {
    jest.clearAllMocks();

    const TaskRepositoryProvider = {
      provide: TaskRepository,
      useValue: {
        findAll: jest.fn().mockResolvedValue([task]),
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
        FindAllTaskUseCase,
        TaskRepositoryProvider,
        TenantRepositoryProvider,
      ],
    }).compile();

    sut = app.get<FindAllTaskUseCase>(FindAllTaskUseCase);
    taskRepository = app.get<TaskRepository>(TaskRepository);
    tenantRepository = app.get<TenantRepository>(TenantRepository);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
    expect(taskRepository).toBeDefined();
    expect(tenantRepository).toBeDefined();
  });

  describe('execute', () => {
    const tenantId = '019229dc-e8c6-72cc-b599-c938df401967';

    it('should call tenantRepository findById once', async () => {
      await sut.execute(tenantId);

      expect(tenantRepository.findById).toHaveBeenCalledTimes(1);
      expect(tenantRepository.findById).toHaveBeenCalledWith(input.tenantId);
    });

    it('should throw a NotFoundException if tenant is not found', async () => {
      jest.spyOn(tenantRepository, 'findById').mockResolvedValueOnce(null);

      await expect(sut.execute(tenantId)).rejects.toThrow(
        new NotFoundException(`Tenant not found for ID: ${input.tenantId}`),
      );
    });

    it('should call taskRepository find all once', async () => {
      await sut.execute(tenantId);

      expect(taskRepository.findAll).toHaveBeenCalledTimes(1);
      expect(taskRepository.findAll).toHaveBeenCalledWith(tenantId);
    });
  });
});
