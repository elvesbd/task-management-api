import { Module } from '@nestjs/common';

import { AuthModule } from '@infra/auth';
import { LoginUseCase } from '@core/authentication/usecases';
import {
  CreateTenantUseCase,
  DeleteTenantUseCase,
  UpdateTenantUseCase,
  FindAllTenantUseCase,
  FindByIdTenantUseCase,
} from '@core/tenant/usecases';
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  UpdateUserUseCase,
  FindAllUserUseCase,
  FindByIdUserUseCase,
  UpdateUserPasswordUseCase,
} from '@core/user/usecases';
import {
  CreateTaskUseCase,
  DeleteTaskUseCase,
  UpdateTaskUseCase,
  FindAllTaskUseCase,
  FindTaskByIdUseCase,
  UpdateTaskStatusUseCase,
} from '@core/task/usecases';
import { LoginController } from '@infra/http/presenters/controllers/authentication';
import {
  CreateTenantController,
  DeleteTenantController,
  FindAllTenantsController,
  FindByIdTenantController,
  UpdateTenantController,
} from '@infra/http/presenters/controllers/tenant';
import {
  CreateUserController,
  DeleteUserController,
  UpdateUserController,
  FindAllUsersController,
  FindUserByIdController,
  UpdateUserPasswordController,
} from '@infra/http/presenters/controllers/user';
import {
  CreateTaskController,
  DeleteTaskController,
  UpdateTaskController,
  FindAllTasksController,
  FindTaskByIdController,
  UpdateTaskStatusController,
} from '@infra/http/presenters/controllers/task';
import { DatabaseModule } from '@infra/database';
import { SignToken } from '@core/authentication/ports/token';
import { UserRepository } from '@core/user/ports/repository';
import { TaskRepository } from '@core/task/ports/repository';
import { TenantRepository } from '@core/tenant/ports/repository';
import { PasswordEncryption } from '@core/authentication/ports/encryption';
import { AppHealthController } from '@infra/http/presenters/controllers/health-check';

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [
    {
      provide: LoginUseCase,
      useFactory: (
        tokenSigner: SignToken,
        userRepository: UserRepository,
        passwordEncryption: PasswordEncryption,
      ): LoginUseCase =>
        new LoginUseCase(tokenSigner, userRepository, passwordEncryption),
      inject: [SignToken, UserRepository, PasswordEncryption],
    },
    {
      provide: CreateTenantUseCase,
      useFactory: (tenantRepository: TenantRepository): CreateTenantUseCase =>
        new CreateTenantUseCase(tenantRepository),
      inject: [TenantRepository],
    },
    {
      provide: DeleteTenantUseCase,
      useFactory: (tenantRepository: TenantRepository): DeleteTenantUseCase =>
        new DeleteTenantUseCase(tenantRepository),
      inject: [TenantRepository],
    },
    {
      provide: UpdateTenantUseCase,
      useFactory: (tenantRepository: TenantRepository): UpdateTenantUseCase =>
        new UpdateTenantUseCase(tenantRepository),
      inject: [TenantRepository],
    },
    {
      provide: FindAllTenantUseCase,
      useFactory: (tenantRepository: TenantRepository): FindAllTenantUseCase =>
        new FindAllTenantUseCase(tenantRepository),
      inject: [TenantRepository],
    },
    {
      provide: FindByIdTenantUseCase,
      useFactory: (tenantRepository: TenantRepository): FindByIdTenantUseCase =>
        new FindByIdTenantUseCase(tenantRepository),
      inject: [TenantRepository],
    },
    {
      provide: CreateUserUseCase,
      useFactory: (
        userRepository: UserRepository,
        tenantRepository: TenantRepository,
        passwordEncryption: PasswordEncryption,
      ): CreateUserUseCase =>
        new CreateUserUseCase(
          userRepository,
          tenantRepository,
          passwordEncryption,
        ),
      inject: [UserRepository, TenantRepository, PasswordEncryption],
    },
    {
      provide: DeleteUserUseCase,
      useFactory: (
        userRepository: UserRepository,
        tenantRepository: TenantRepository,
      ): DeleteUserUseCase =>
        new DeleteUserUseCase(userRepository, tenantRepository),
      inject: [UserRepository, TenantRepository],
    },
    {
      provide: UpdateUserUseCase,
      useFactory: (
        userRepository: UserRepository,
        tenantRepository: TenantRepository,
      ): UpdateUserUseCase =>
        new UpdateUserUseCase(userRepository, tenantRepository),
      inject: [UserRepository, TenantRepository],
    },
    {
      provide: FindAllUserUseCase,
      useFactory: (
        userRepository: UserRepository,
        tenantRepository: TenantRepository,
      ): FindAllUserUseCase =>
        new FindAllUserUseCase(userRepository, tenantRepository),
      inject: [UserRepository, TenantRepository],
    },
    {
      provide: FindByIdUserUseCase,
      useFactory: (
        userRepository: UserRepository,
        tenantRepository: TenantRepository,
      ): FindByIdUserUseCase =>
        new FindByIdUserUseCase(userRepository, tenantRepository),
      inject: [UserRepository, TenantRepository],
    },
    {
      provide: UpdateUserPasswordUseCase,
      useFactory: (
        userRepository: UserRepository,
        tenantRepository: TenantRepository,
        passwordEncryption: PasswordEncryption,
      ): UpdateUserPasswordUseCase =>
        new UpdateUserPasswordUseCase(
          userRepository,
          tenantRepository,
          passwordEncryption,
        ),
      inject: [UserRepository, TenantRepository, PasswordEncryption],
    },
    {
      provide: CreateTaskUseCase,
      useFactory: (
        taskRepository: TaskRepository,
        tenantRepository: TenantRepository,
      ): CreateTaskUseCase =>
        new CreateTaskUseCase(taskRepository, tenantRepository),
      inject: [TaskRepository, TenantRepository],
    },
    {
      provide: DeleteTaskUseCase,
      useFactory: (
        taskRepository: TaskRepository,
        tenantRepository: TenantRepository,
      ): DeleteTaskUseCase =>
        new DeleteTaskUseCase(taskRepository, tenantRepository),
      inject: [TaskRepository, TenantRepository],
    },
    {
      provide: UpdateTaskUseCase,
      useFactory: (
        taskRepository: TaskRepository,
        tenantRepository: TenantRepository,
      ): UpdateTaskUseCase =>
        new UpdateTaskUseCase(taskRepository, tenantRepository),
      inject: [TaskRepository, TenantRepository],
    },
    {
      provide: FindAllTaskUseCase,
      useFactory: (
        taskRepository: TaskRepository,
        tenantRepository: TenantRepository,
      ): FindAllTaskUseCase =>
        new FindAllTaskUseCase(taskRepository, tenantRepository),
      inject: [TaskRepository, TenantRepository],
    },
    {
      provide: FindTaskByIdUseCase,
      useFactory: (
        taskRepository: TaskRepository,
        tenantRepository: TenantRepository,
      ): FindTaskByIdUseCase =>
        new FindTaskByIdUseCase(taskRepository, tenantRepository),
      inject: [TaskRepository, TenantRepository],
    },
    {
      provide: UpdateTaskStatusUseCase,
      useFactory: (
        taskRepository: TaskRepository,
        tenantRepository: TenantRepository,
      ): UpdateTaskStatusUseCase =>
        new UpdateTaskStatusUseCase(taskRepository, tenantRepository),
      inject: [TaskRepository, TenantRepository],
    },
  ],
  controllers: [
    AppHealthController,
    CreateTenantController,
    DeleteTenantController,
    FindAllTenantsController,
    FindByIdTenantController,
    UpdateTenantController,
    CreateUserController,
    DeleteUserController,
    UpdateUserController,
    UpdateUserPasswordController,
    FindAllUsersController,
    FindUserByIdController,
    CreateTaskController,
    DeleteTaskController,
    UpdateTaskController,
    FindAllTasksController,
    FindTaskByIdController,
    UpdateTaskStatusController,
    LoginController,
  ],
})
export class HttpModule {}
