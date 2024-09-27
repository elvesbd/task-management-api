import { Body, Controller, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { ApiPath, ApiTag } from '../constants';
import { FindAllTaskUseCase } from '@core/task/usecases';
import { TaskViewModel } from '@infra/http/presenters/view-models/task';

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
    type: [TaskViewModel],
  })
  @Get()
  public async findAllTasks(
    @Body() dto: { tenantId: string },
  ): Promise<TaskViewModel[]> {
    const { tenantId } = dto;
    const tasks = await this.findAllTaskUseCase.execute(tenantId);

    return TaskViewModel.toHTTPList(tasks);
  }
}
