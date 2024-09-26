import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { Task } from '@core/task/model';
import { UpdateTaskUseCase } from '@core/task/usecases';
import { TaskRepository } from '@core/task/ports/repository';
import { TenantRepository } from '@core/tenant/ports/repository';
import { TaskDataBuilder } from '@test/__mocks__/data-builder/task';
import { UserDataBuilder } from '@test/__mocks__/data-builder/user';

describe('UpdateTaskUseCase', () => {
  let sut: UpdateTaskUseCase;
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
        save: jest.fn(),
        findByIdAndTenantId: jest.fn().mockResolvedValue(task),
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
        UpdateTaskUseCase,
        TaskRepositoryProvider,
        TenantRepositoryProvider,
      ],
    }).compile();

    sut = app.get<UpdateTaskUseCase>(UpdateTaskUseCase);
    taskRepository = app.get<TaskRepository>(TaskRepository);
    tenantRepository = app.get<TenantRepository>(TenantRepository);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
    expect(taskRepository).toBeDefined();
    expect(tenantRepository).toBeDefined();
  });

  describe('execute', () => {
    const id = '019229dc-e8c6-22cc-b654-c938df401789';

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
  });
});
