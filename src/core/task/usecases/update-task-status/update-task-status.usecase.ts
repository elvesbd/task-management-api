import { Injectable, NotFoundException } from '@nestjs/common';

import { TaskStatus } from '@core/task/enum';
import { TaskRepository } from '@core/task/ports/repository';
import { TenantRepository } from '@core/tenant/ports/repository';

type Input = {
  id: string;
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
    const { id, tenantId, status } = input;

    const tenant = await this.tenantRepository.findById(tenantId);
    if (!tenant)
      throw new NotFoundException(`Tenant with ID ${tenantId} not found.`);

    const task = await this.taskRepository.findByIdAndTenantId(id, tenant.id);

    if (!task)
      throw new NotFoundException(
        `Task with ID ${id} not found for this tenant.`,
      );

    task.assignStatus(status);

    await this.taskRepository.save(task);
  }
}
