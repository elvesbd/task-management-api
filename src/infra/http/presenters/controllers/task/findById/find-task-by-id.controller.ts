import { Body, Controller, Get, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiParam,
} from '@nestjs/swagger';

import { ApiPath, ApiTag } from '../constants';
import { FindTaskByIdUseCase } from '@core/task/usecases';
import {
  TaskViewModel,
  TaskVMResponse,
} from '@infra/http/presenters/view-models/task';

type FindByIdTaskDto = {
  tenantId: string;
};

@ApiTags(ApiTag)
@Controller(ApiPath)
export class FindTaskByIdController {
  constructor(private readonly findTaskByIdUseCase: FindTaskByIdUseCase) {}

  @ApiOperation({
    description: 'Find a task by ID within a specific tenant.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the task to be found.',
    type: String,
  })
  @ApiOkResponse({
    description: 'Task found successfully.',
    type: TaskVMResponse,
  })
  @ApiNotFoundResponse({
    description: 'Tenant or Task not found.',
  })
  @Get(':id')
  public async findByIdTask(
    @Param('id') id: string,
    @Body() dto: FindByIdTaskDto,
  ): Promise<TaskVMResponse> {
    const task = await this.findTaskByIdUseCase.execute({ ...dto, id });

    return TaskViewModel.toHTTP(task);
  }
}
