import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { Task } from '@core/task/model';
import { UpdateTaskUseCase } from '@core/task/usecases';
import { TaskRepository } from '@core/task/ports/repository';
import { TenantRepository } from '@core/tenant/ports/repository';
import { TaskDataBuilder } from '@test/__mocks__/data-builder/task';
import { TenantDataBuilder } from '@test/__mocks__/data-builder/tenant';

describe('UpdateTaskUseCase', () => {
  let sut: UpdateTaskUseCase;
  let taskRepository: TaskRepository;
  let tenantRepository: TenantRepository;

  const input = TaskDataBuilder.aTask().build();
  const task = Task.create(input);
  const tenant = TenantDataBuilder.anTenant().withId().build();

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

    it('should call tenantRepository findByIdAndTenantId once', async () => {
      await sut.execute({ ...input, id });

      expect(taskRepository.findByIdAndTenantId).toHaveBeenCalledTimes(1);
      expect(taskRepository.findByIdAndTenantId).toHaveBeenCalledWith(
        id,
        tenant.id,
      );
    });

    it('should throw a NotFoundException if task not found', async () => {
      jest
        .spyOn(taskRepository, 'findByIdAndTenantId')
        .mockResolvedValueOnce(null);

      await expect(sut.execute({ ...input, id })).rejects.toThrow(
        new NotFoundException('Task not found!'),
      );
    });

    it('should call tenantRepository save once', async () => {
      await sut.execute({ ...input, id });

      expect(taskRepository.save).toHaveBeenCalledTimes(1);
      expect(taskRepository.save).toHaveBeenCalledWith(task);
    });

    it('should update the title only', async () => {
      const updateInput = TaskDataBuilder.aTask()
        .withTitle('New Title')
        .build();

      const output = await sut.execute({ ...updateInput, id });

      expect(output.id).toBe(task.id);
      expect(output.title).toBe(updateInput.title);
      expect(output.deadline).toBe(task.deadline);
      expect(output.tenantId).toBe(task.tenantId);
      expect(output.description).toBe(task.description);
    });
  });
});
