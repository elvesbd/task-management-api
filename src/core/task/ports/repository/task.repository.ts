import { Task } from '@core/task/model';

export abstract class TaskRepository {
  abstract save(user: Task): Promise<void>;
}
