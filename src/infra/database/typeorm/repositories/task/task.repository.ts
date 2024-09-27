import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Task } from '@core/task/model';
import { TaskRepository } from '@core/task/ports/repository';
import { dataSource } from '@infra/database/typeorm/datasource';
import { TypeORMTaskMapper } from '@infra/database/typeorm/mappers';
import { TypeORMTaskEntity } from '@infra/database/typeorm/entities';

@Injectable()
export class TypeORMTaskRepository implements TaskRepository {
  private repository: Repository<TypeORMTaskEntity>;

  constructor() {
    this.repository = dataSource.getRepository(TypeORMTaskEntity);
  }

  public async save(task: Task): Promise<void> {
    const newTask = TypeORMTaskMapper.toPersistence(task);
    await this.repository.save(newTask);
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  public async findAll(tenantId: string): Promise<Task[]> {
    const tasks = await this.repository.find({ where: { tenantId } });
    return TypeORMTaskMapper.toDomainList(tasks);
  }

  public async findByIdAndTenantId(
    id: string,
    tenantId: string,
  ): Promise<Task | null> {
    const taskEntity = await this.repository.findOne({
      where: { id, tenantId },
    });
    return taskEntity ? TypeORMTaskMapper.toDomain(taskEntity) : null;
  }
}
