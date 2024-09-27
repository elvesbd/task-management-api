import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

import { dataSource } from './typeorm/datasource';
import { DatabaseService } from './database.service';
import {
  TypeORMUserRepository,
  TypeORMTaskRepository,
  TypeORMTenantRepository,
} from './typeorm/repositories';
import { UserRepository } from '@core/user/ports/repository';
import { TaskRepository } from '@core/task/ports/repository';
import { TenantRepository } from '@core/tenant/ports/repository';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DatabaseService,
      dataSourceFactory: async (
        options?: DataSourceOptions,
      ): Promise<DataSource> => {
        if (!options) {
          throw new Error('No DataSource options were provided!');
        }

        return dataSource.initialize();
      },
    }),
  ],
  providers: [
    {
      provide: UserRepository,
      useClass: TypeORMUserRepository,
    },
    {
      provide: TaskRepository,
      useClass: TypeORMTaskRepository,
    },
    {
      provide: TenantRepository,
      useClass: TypeORMTenantRepository,
    },
  ],
  exports: [UserRepository, TaskRepository, TenantRepository],
})
export class DatabaseModule {}
