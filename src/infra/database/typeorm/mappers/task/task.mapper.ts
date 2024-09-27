import { Task } from '@core/task/model';
import { TypeORMTaskEntity } from '@infra/database/typeorm/entities';

export class TypeORMTaskMapper {
  private constructor() {
    throw new Error(
      'TypeORMTaskMapper is a static class and should not be instantiated.',
    );
  }

  public static toDomain(persistence: TypeORMTaskEntity): Task {
    return new Task({
      id: persistence.id,
      title: persistence.title,
      deadline: persistence.deadline,
      tenantId: persistence.tenantId,
      status: persistence.status,
      description: persistence.description,
    });
  }

  public static toDomainList(persistenceList: TypeORMTaskEntity[]): Task[] {
    return persistenceList.map((persistence) => this.toDomain(persistence));
  }

  public static toPersistence(domain: Task): TypeORMTaskEntity {
    return {
      id: domain.id,
      title: domain.title,
      deadline: domain.deadline,
      tenantId: domain.tenantId,
      status: domain.status,
      description: domain.description,
    };
  }
}
