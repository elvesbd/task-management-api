import { Task } from '@core/task/model';

export abstract class TaskRepository {
  abstract save(user: Task): Promise<void>;
  abstract findByIdAndTenantId(
    id: string,
    tenantId: string,
  ): Promise<Task | null>;
}
