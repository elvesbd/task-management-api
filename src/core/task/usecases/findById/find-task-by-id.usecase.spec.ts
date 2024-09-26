import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { FindTaskByIdUseCase } from '@core/task/usecases';
import { TaskRepository } from '@core/task/ports/repository';
import { TenantRepository } from '@core/tenant/ports/repository';
import { TaskDataBuilder } from '@test/__mocks__/data-builder/task';
import { TenantDataBuilder } from '@test/__mocks__/data-builder/tenant';

describe('FindTaskByIdUseCase', () => {
  let sut: FindTaskByIdUseCase;
  let taskRepository: TaskRepository;
  let tenantRepository: TenantRepository;

  const task = TaskDataBuilder.aTask().withId().build();
  const tenant = TenantDataBuilder.anTenant().withId().build();

  beforeEach(async () => {
    jest.clearAllMocks();

    const TaskRepositoryProvider = {
      provide: TaskRepository,
      useValue: {
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
        FindTaskByIdUseCase,
        TaskRepositoryProvider,
        TenantRepositoryProvider,
      ],
    }).compile();

    sut = app.get<FindTaskByIdUseCase>(FindTaskByIdUseCase);
    taskRepository = app.get<TaskRepository>(TaskRepository);
    tenantRepository = app.get<TenantRepository>(TenantRepository);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
    expect(taskRepository).toBeDefined();
    expect(tenantRepository).toBeDefined();
  });

  describe('execute', () => {
    const input = {
      id: '086229dc-e8c6-72cc-b599-c938df401741',
      tenantId: '019229dc-e8c6-72cc-b599-c938df401967',
    };

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
  });
});
