import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { DeleteTaskUseCase } from '@core/task/usecases';
import { TaskRepository } from '@core/task/ports/repository';
import { TenantRepository } from '@core/tenant/ports/repository';
import { TaskDataBuilder } from '@test/__mocks__/data-builder/task';
import { TenantDataBuilder } from '@test/__mocks__/data-builder/tenant';

describe('DeleteTaskUseCase', () => {
  let sut: DeleteTaskUseCase;
  let taskRepository: TaskRepository;
  let tenantRepository: TenantRepository;

  const task = TaskDataBuilder.aTask().withId().build();
  const tenant = TenantDataBuilder.anTenant().withId().build();

  beforeEach(async () => {
    jest.clearAllMocks();

    const TaskRepositoryProvider = {
      provide: TaskRepository,
      useValue: {
        delete: jest.fn(),
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
        DeleteTaskUseCase,
        TaskRepositoryProvider,
        TenantRepositoryProvider,
      ],
    }).compile();

    sut = app.get<DeleteTaskUseCase>(DeleteTaskUseCase);
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

    it('should call taskRepository findByIdAndTenantId once', async () => {
      await sut.execute(input);

      expect(taskRepository.findByIdAndTenantId).toHaveBeenCalledTimes(1);
      expect(taskRepository.findByIdAndTenantId).toHaveBeenCalledWith(
        input.id,
        tenant.id,
      );
    });

    it('should throw a NotFoundException if task not found', async () => {
      jest
        .spyOn(taskRepository, 'findByIdAndTenantId')
        .mockResolvedValueOnce(null);

      await expect(sut.execute(input)).rejects.toThrow(
        new NotFoundException('Task not found!'),
      );
    });

    it('should call taskRepository delete once', async () => {
      await sut.execute(input);

      expect(taskRepository.delete).toHaveBeenCalledTimes(1);
      expect(taskRepository.delete).toHaveBeenCalledWith(task.id);
    });
  });
});
