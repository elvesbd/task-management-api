import { Body, Controller, Patch, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

import { TaskStatus } from '@core/task/enum';
import { ApiPath, ApiTag } from '../constants';
import { UpdateTaskStatusUseCase } from '@core/task/usecases';

type UpdateTaskStatusDto = {
  tenantId: string;
  status: TaskStatus;
};

@ApiTags(ApiTag)
@Controller(ApiPath)
export class UpdateTaskStatusController {
  constructor(
    private readonly updateTaskStatusUseCase: UpdateTaskStatusUseCase,
  ) {}

  @ApiOperation({
    description: 'Update the status of an existing task.',
  })
  @ApiParam({
    name: 'taskId',
    required: true,
    description: 'ID of the task to update the status.',
    type: String,
  })
  @ApiOkResponse({
    description: 'Task status updated successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Tenant or Task not found.',
  })
  @Patch('task/:taskId/status')
  public async updateTaskStatus(
    @Param('taskId') taskId: string,
    @Body() dto: UpdateTaskStatusDto,
  ): Promise<void> {
    const { tenantId, status } = dto;

    await this.updateTaskStatusUseCase.execute({
      taskId,
      tenantId,
      status,
    });
  }
}
