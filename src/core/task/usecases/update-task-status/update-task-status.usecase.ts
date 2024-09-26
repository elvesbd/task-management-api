import { Injectable, NotFoundException } from '@nestjs/common';

import { TaskStatus } from '@core/task/enum';
import { TaskRepository } from '@core/task/ports/repository';
import { TenantRepository } from '@core/tenant/ports/repository';

type Input = {
  taskId: string;
  tenantId: string;
  status: TaskStatus;
};

@Injectable()
export class UpdateTaskStatusUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(input: Input): Promise<void> {
    const { taskId, tenantId, status } = input;

    const tenant = await this.tenantRepository.findById(tenantId);
    if (!tenant)
      throw new NotFoundException(`Tenant with ID ${tenantId} not found.`);

    const task = await this.taskRepository.findByIdAndTenantId(
      taskId,
      tenant.id,
    );

    if (!task)
      throw new NotFoundException(
        `Task with ID ${taskId} not found for this tenant.`,
      );

    task.assignStatus(status);

    await this.taskRepository.save(task);
  }
}
