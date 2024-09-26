import { Injectable, NotFoundException } from '@nestjs/common';

import { Task } from '@core/task/model';
import { UseCase } from '@core/shared/contracts/usecases';
import { TaskRepository } from '@core/task/ports/repository';
import { TenantRepository } from '@core/tenant/ports/repository';

type Input = {
  title: string;
  deadline: Date;
  tenantId: string;
  description: string;
};

@Injectable()
export class CreateTaskUseCase implements UseCase<Input, Task> {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(input: Input): Promise<Task> {
    const tenant = await this.tenantRepository.findById(input.tenantId);
    if (!tenant) {
      throw new NotFoundException(`Tenant not found for ID: ${input.tenantId}`);
    }

    const task = Task.create({
      ...input,
      tenantId: tenant.id,
    });
    await this.taskRepository.save(task);

    return task;
  }
}
