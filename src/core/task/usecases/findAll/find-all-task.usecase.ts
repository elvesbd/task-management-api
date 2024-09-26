import { Injectable, NotFoundException } from '@nestjs/common';

import { Task } from '@core/task/model';
import { UseCase } from '@core/shared/contracts/usecases';
import { TaskRepository } from '@core/task/ports/repository';
import { TenantRepository } from '@core/tenant/ports/repository';

@Injectable()
export class FindAllTaskUseCase implements UseCase<null, Task[]> {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(tenantId: string): Promise<Task[]> {
    const tenant = await this.tenantRepository.findById(tenantId);
    if (!tenant)
      throw new NotFoundException(`Tenant not found for ID: ${tenantId}`);

    const tasks = await this.taskRepository.findAll(tenantId);

    if (!tasks || tasks.length === 0) {
      throw new NotFoundException(`No tasks found for tenant ID: ${tenantId}`);
    }

    return tasks;
  }
}
