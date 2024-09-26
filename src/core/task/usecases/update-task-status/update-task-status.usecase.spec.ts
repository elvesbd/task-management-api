import { TaskStatus } from '@core/task/enum';
import { UpdateTaskStatusUseCase } from './update-task-status.usecase';
import { TaskRepository } from '@core/task/ports/repository';
import { TenantRepository } from '@core/tenant/ports/repository';
import { TenantDataBuilder } from '@test/__mocks__/data-builder/tenant';
import { Task } from '@core/task/model';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TaskDataBuilder } from '@test/__mocks__/data-builder/task';

describe('UpdateTaskStatusUseCase', () => {
  let sut: UpdateTaskStatusUseCase;
  let taskRepository: TaskRepository;
  let tenantRepository: TenantRepository;

  const input = {
    taskId: '123',
    tenantId: 'tenant1',
    status: TaskStatus.COMPLETED,
  };

  const tenant = TenantDataBuilder.anTenant().build();
  const taskMock = TaskDataBuilder.aTask().build();
  const task = Task.create(taskMock);

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
        UpdateTaskStatusUseCase,
        TaskRepositoryProvider,
        TenantRepositoryProvider,
      ],
    }).compile();

    sut = app.get<UpdateTaskStatusUseCase>(UpdateTaskStatusUseCase);
    taskRepository = app.get<TaskRepository>(TaskRepository);
    tenantRepository = app.get<TenantRepository>(TenantRepository);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
    expect(taskRepository).toBeDefined();
    expect(tenantRepository).toBeDefined();
  });

  it('should call tenantRepository findById once', async () => {
    await sut.execute(input);

    expect(tenantRepository.findById).toHaveBeenCalledTimes(1);
    expect(tenantRepository.findById).toHaveBeenCalledWith(input.tenantId);
  });

  it('should throw a NotFoundException if tenant is not found', async () => {
    jest.spyOn(tenantRepository, 'findById').mockResolvedValueOnce(null);

    await expect(sut.execute(input)).rejects.toThrow(
      new NotFoundException(`Tenant with ID ${input.tenantId} not found.`),
    );
  });

  it('should call tenantRepository findById once', async () => {
    await sut.execute(input);

    expect(taskRepository.findByIdAndTenantId).toHaveBeenCalledTimes(1);
    expect(taskRepository.findByIdAndTenantId).toHaveBeenCalledWith(
      input.taskId,
      tenant.id,
    );
  });
});
