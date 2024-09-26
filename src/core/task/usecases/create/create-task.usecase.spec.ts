import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CreateTaskUseCase } from '@core/task/usecases';
import { TaskRepository } from '@core/task/ports/repository';
import { TenantRepository } from '@core/tenant/ports/repository';
import { TaskDataBuilder } from '@test/__mocks__/data-builder/task';
import { UserDataBuilder } from '@test/__mocks__/data-builder/user';
import { Task } from '@core/task/model';
import { TenantDataBuilder } from '@test/__mocks__/data-builder/tenant';

describe('CreateTaskUseCase', () => {
  let sut: CreateTaskUseCase;
  let taskRepository: TaskRepository;
  let tenantRepository: TenantRepository;

  const input = TaskDataBuilder.aTask().build();
  const tenant = TenantDataBuilder.anTenant().withId().build();

  beforeEach(async () => {
    jest.clearAllMocks();

    const TaskRepositoryProvider = {
      provide: TaskRepository,
      useValue: {
        save: jest.fn(),
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
        CreateTaskUseCase,
        TaskRepositoryProvider,
        TenantRepositoryProvider,
      ],
    }).compile();

    sut = app.get<CreateTaskUseCase>(CreateTaskUseCase);
    taskRepository = app.get<TaskRepository>(TaskRepository);
    tenantRepository = app.get<TenantRepository>(TenantRepository);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
    expect(taskRepository).toBeDefined();
    expect(tenantRepository).toBeDefined();
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

    it('should create a task and return it when tenant is found', async () => {
      const output = await sut.execute(input);

      expect(output.id).toBeDefined();
      expect(output.title).toBe(input.title);
      expect(output.deadline).toBe(input.deadline);
      expect(output.tenantId).toBe(input.tenantId);
      expect(output.description).toBe(input.description);
    });
  });
});
