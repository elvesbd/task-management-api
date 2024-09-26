import { Task } from '@core/task/model';

export abstract class TaskRepository {
  abstract save(user: Task): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findAll(tenantId: string): Promise<Task[]>;
  abstract findByIdAndTenantId(
    id: string,
    tenantId: string,
  ): Promise<Task | null>;
}
