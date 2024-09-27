import { Body, Controller, Patch, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

import {
  TaskViewModel,
  TaskVMResponse,
} from '@infra/http/presenters/view-models/task';
import { ApiPath, ApiTag } from '../constants';
import { UpdateTaskUseCase } from '@core/task/usecases';
import { UpdateTaskDto } from '@infra/http/presenters/controllers/task/dtos';

@ApiTags(ApiTag)
@Controller(ApiPath)
export class UpdateTaskController {
  constructor(private readonly updateTaskUseCase: UpdateTaskUseCase) {}

  @ApiOperation({
    description: 'Update an existing task.',
  })
  @ApiBody({
    type: UpdateTaskDto,
    description: 'Task data to update.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the task to be updated.',
    type: String,
  })
  @ApiOkResponse({
    description: 'Task updated successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Tenant or Task not found.',
  })
  @Patch(':id')
  public async updateTask(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ): Promise<TaskVMResponse> {
    const task = await this.updateTaskUseCase.execute({
      id,
      ...dto,
    });

    return TaskViewModel.toHTTP(task);
  }
}
