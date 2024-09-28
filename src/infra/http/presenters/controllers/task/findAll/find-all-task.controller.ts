import { Controller, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { ApiPath, ApiTag } from '../constants';
import { FindAllTaskUseCase } from '@core/task/usecases';
import {
  TaskViewModel,
  TaskVMResponse,
} from '@infra/http/presenters/view-models/task';
import { GetCurrentTenantId } from '@infra/auth/decorators';
@ApiBearerAuth()
@ApiTags(ApiTag)
@Controller(ApiPath)
export class FindAllTasksController {
  constructor(private readonly findAllTaskUseCase: FindAllTaskUseCase) {}

  @ApiOperation({
    description: 'Retrieve all tasks for a specific tenant.',
  })
  @ApiNotFoundResponse({
    description: 'Tenant not found or no tasks found for the tenant.',
  })
  @ApiOkResponse({
    description: 'Tasks retrieved successfully.',
    type: [TaskVMResponse],
  })
  @Get()
  public async findAllTasks(
    @GetCurrentTenantId() tenantId: string,
  ): Promise<TaskVMResponse[]> {
    const tasks = await this.findAllTaskUseCase.execute(tenantId);

    return TaskViewModel.toHTTPList(tasks);
  }
}
