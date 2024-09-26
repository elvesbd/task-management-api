import { Injectable, NotFoundException } from '@nestjs/common';

import { UseCase } from '@core/shared/contracts/usecases';
import { TaskRepository } from '@core/task/ports/repository';
import { TenantRepository } from '@core/tenant/ports/repository';

type Input = {
  id: string;
  tenantId: string;
};

@Injectable()
export class DeleteTaskUseCase implements UseCase<Input, void> {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(input: Input): Promise<void> {
    const tenant = await this.tenantRepository.findById(input.tenantId);
    if (!tenant)
      throw new NotFoundException(`Tenant not found for ID: ${input.tenantId}`);

    const task = await this.taskRepository.findByIdAndTenantId(
      input.id,
      tenant.id,
    );

    if (!task) throw new NotFoundException('Task not found!');

    await this.taskRepository.delete(task.id);
  }
}
